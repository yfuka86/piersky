class MailPreview < MailView
  def daily_mail
    user_team_id = 1
    mail = SummaryMailer.daily_mail(user_team_id)
  end
end
