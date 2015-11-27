class AuthMailer < ActionMailer::Base
  include Roadie::Rails::Automatic
  layout 'email'

  def setup(user_id, raw_confirmation_token)
    @resource = User.find_by(id: user_id)
    @email = @resource.email
    @token = raw_confirmation_token
    @subject = I18n.t('auth.mail.setup.title')

    mail(from: MAIL_SENDER, to: @email, subject: @subject) do |format|
      format.html
    end
  end

  def invitation(invitation_id, raw_invitation_token)
    @invitation = Invitation.find_by(id: invitation_id)
    @team = @invitation.team
    @inviter = @invitation.inviter
    @inviter_name = @inviter.email
    @invitee = @invitation.invitee
    @subject = I18n.t('auth.mail.invitation.title', inviter_name: @inviter_name, team_name: @team.name)
    @raw_invitation_token = raw_invitation_token

    mail(from: MAIL_SENDER, to: @invitee.email, subject: @subject) do |format|
      format.html
    end
  end
end
