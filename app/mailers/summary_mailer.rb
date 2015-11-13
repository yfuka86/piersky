class SummaryMailer < ActionMailer::Base
  include Roadie::Rails::Automatic
  layout 'email'

  def daily_mail(user_team_id)
    @presenter = DailySummaryPresenter.new(user_team_id)
    user_team = UserTeam.find(user_team_id)
    @email = user_team.user.email 
    team_name = user_team.team.name || I18n.t('general.your_team')
    @subject = I18n.t('summary_mailer.daily_summary.subject', team: team_name)

    mail(from: MAIL_SENDER, to: @email, subject: @subject) do |format|
      format.html
      format.text
    end
  end

  def weekly_mail(user_team_id)
    @presenter = WeeklySummaryPresenter.new(user_team_id)
    user_team = UserTeam.find(user_team_id)
    @email = user_team.user.email 
    team_name = user_team.team.name || I18n.t('general.your_team')
    @subject = I18n.t('summary_mailer.weekly_summary.subject', team: team_name)
    
    mail(from: MAIL_SENDER, to: @email, subject: @subject) do |format|
      format.html
      format.text
    end
  end
end
