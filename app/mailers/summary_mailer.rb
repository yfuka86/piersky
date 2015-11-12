class SummaryMailer < ActionMailer::Base
  include Roadie::Rails::Automatic
  layout 'email'

  def daily_mail(user_team_id)
    @presenter = DailySummaryPresenter.new(user_team_id)
    @email = UserTeam.find(user_team_id).user.email 
    @subject = I18n.t('summary_mailer.daily_summary.subject')

    mail(from: MAIL_SENDER, to: @email, subject: @subject) do |format|
      format.html
      format.text
    end
  end

  def weekly_mail(user_team_id)
    @presenter = WeeklySummaryPresenter.new(user_team_id)
    @email = UserTeam.find(user_team_id).user.email 
    @subject = I18n.t('summary_mailer.weekly_summary.subject')
    
    mail(from: MAIL_SENDER, to: @email, subject: @subject) do |format|
      format.html
      format.text
    end
  end
end
