class SummaryMailer < ActionMailer::Base
  include Roadie::Rails::Automatic
  layout 'email'

  def daily(user_team_id, test = true)
    @presenter = DailySummaryPresenter.new(user_team_id)
    user_team = UserTeam.find(user_team_id)
    team_name = user_team.team.name.presence || I18n.t('general.your_team')
    @emails = user_team.team.users.map(&:email).join(',')
    @subject = I18n.t('summary_mailer.daily_summary.subject', team: team_name)
    @title = @subject

    mail(from: I18n.t('identity'), to: (test ? 'yfuka86@gmail.com' : @emails), subject: @subject) do |format|
      format.html
    end
  end

  def weekly(user_team_id)
    @presenter = WeeklySummaryPresenter.new(user_team_id)
    user_team = UserTeam.find(user_team_id)
    @email = user_team.user.email
    team_name = user_team.team.name.presence || I18n.t('general.your_team')
    @subject = I18n.t('summary_mailer.weekly_summary.subject', team: team_name)
    @title = @subject

    mail(from: I18n.t('identity'), to: @email, subject: @subject) do |format|
      format.html
    end
  end
end
