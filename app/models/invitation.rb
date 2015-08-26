class Invitation < ActiveRecord::Base
  belongs_to :invitee, class_name: 'User'
  belongs_to :inviter, class_name: 'User'
  belongs_to :team

  validates :invitee, presence: true
  validates :inviter, presence: true
  validates :team, presence: true

  before_destroy :destroy_unregistered_invitee

  INBITE_KEYS = [:email]

  def self.send_invitations(users_params=[], inviter, team)
    invitations = []
    errors = []
    users_params.map do |user_params|
      invitation, invitee = self.send_with_attributes({email: user_params[:email]}, inviter, team)
      invitations << invitation
      errors += invitation.errors.full_messages
    end
    [invitations, errors]
  end

  def self.send_with_attributes(attributes={}, inviter, team)
    key_attributes = {}
    attributes = attributes.with_indifferent_access
    INBITE_KEYS.each do |key|
      attribute = attributes.delete(key)
      key_attributes[key] = attribute.to_s.strip
    end

    invitee = User.find_or_initialize_with_errors(INBITE_KEYS, key_attributes)
    # when resend invitation, grab invitation here
    invitation = Invitation.find_by(invitee: invitee, inviter: inviter, team: team) ||
      self.new(invitee: invitee, inviter: inviter, team: team)

    raw_invitation_token = nil
    ActiveRecord::Base.transaction do
      if invitee.new_record?
        invitee.assign_attributes(attributes)
        invitee.class.skip_callback :create, :after, :send_on_create_confirmation_instructions
        invitee.save!
      else
        if invitee == inviter
          invitation.errors[:base] << I18n.t('auth.message.invitation_to_yourself')
        elsif UserTeam.find_by(user: invitee, team: team)
          invitation.errors[:base] << I18n.t('auth.message.user_already_in_team', email: invitee.email)
        elsif Invitation.find_by(invitee: invitee, team: team)
          invitation.errors[:base] << I18n.t('auth.message.invitation_already_sent', email: invitee.email)
        end
      end

      invitation.send_invitation if invitation.errors.empty?
    end

    [invitation, invitee]
  end

  def self.by_token(token)
    invitation_token = Devise.token_generator.digest(self, :token, token)
    invitation = self.find_by(token: invitation_token)
    invitation
  end

  def self.can_accept?(token)
    invitation_token = Devise.token_generator.digest(self, :token, token)
    invitation = self.find_by(token: invitation_token)
    invitation && invitation.persisted? && invitation.accepted_at.blank?
  end

  def self.accept_with_attributes(params, willResetPassword)
    invitation = self.by_token(params[:token])
    invitee = invitation.invitee
    ActiveRecord::Base.transaction do
      invitee.confirm!
      if willResetPassword
        invitee.reset_password!(params[:password], params[:password])
      end
      invitation.invitee.join_to_team!(invitation.team, user_name: params[:user_name], first_name: params[:first_name], last_name: params[:last_name], role: :member)
      invitation.accepted_at = Time.now.utc
      [invitation.tap(&:save!), invitee]
    end
  end

  # including save!
  def send_invitation
    raw_invitation_token = generate_invitation_token!
    mail = AuthMailer.invitation_mail(self.id, raw_invitation_token).deliver if self.errors.empty?
    self.sent_at = Time.now.utc
    self.save!
  end

  private

  def generate_invitation_token
    raw, enc = Devise.token_generator.generate(self.class, :token)
    self.token = enc
    raw_invitation_token = raw
  end

  def generate_invitation_token!
    raw_invitation_token = generate_invitation_token
    save! && raw_invitation_token
  end

  def encrypted_token
    self.token
  end

  def destroy_unregistered_invitee
    if self.invitee && !self.invitee.confirmed?
      self.invitee.destroy
    end
  end
end
