class User < ActiveRecord::Base
  attr_reader :raw_confirmation_token

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :confirmable, :omniauthable

  validates :email, presence: true

  has_many :user_teams, dependent: :destroy
  has_many :teams, through: :user_teams
  has_many :integrations
  has_many :invitations_sent, foreign_key: "inviter_id", class_name: "Invitation"
  has_many :invitations_received, foreign_key: "invitee_id", class_name: "Invitation"

  after_create :create_or_set_team

  def current_team
    if team = self.user_teams.find_by(is_logging_in: true).try(:team)
      team
    else
      team = self.teams.order(id: :asc).first
      team.user_teams.find_by(user_id: self.id).update_attribute(:is_logging_in, true)
      team
    end
  end

  def identities(team)
    user_teams.find_by(user: self, team: team).identities
  end

  def set_current_team(team)
    self.user_teams.find_by(is_logging_in: true).try(:update_attribute, :is_logging_in, false)
    self.user_teams.find_by(team: team).update_attribute(:is_logging_in, true)
  end

  def create_or_set_team
    if encrypted_password.present?
      Team.setup(self)
    end
  end

  def join_to_team!(team)
    UserTeam.create(team: team, user: self)
  end

  def self.confirmable_user(confirmation_token)
    original_token     = confirmation_token
    confirmation_token = Devise.token_generator.digest(self, :confirmation_token, confirmation_token)

    confirmable = find_or_initialize_with_error_by(:confirmation_token, confirmation_token)
  end
end
