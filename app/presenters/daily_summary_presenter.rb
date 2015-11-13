class DailySummaryPresenter

  attr_accessor :text

  def initialize(user_team_id)
    user_team = UserTeam.find(user_team_id)
    @text = user_team.team.integrations.map(&:daily_summary)
  end
end
