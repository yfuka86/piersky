class MailPreview < MailView
  def setup_auth_mail
    user_id = 1
    AuthMailer.setup(user_id, 'raw_confirmation_token')
  end

  def invitation_auth_mail
    invitation_id = 1
    AuthMailer.invitation(invitation_id, 'raw_invitation_token')
  end

  def daily_summary_mail
    user_team_id = 1
    SummaryMailer.daily(user_team_id)
  end

  def weekly_summary_mail
    user_team_id = 1
    SummaryMailer.weekly(user_team_id)
  end
end