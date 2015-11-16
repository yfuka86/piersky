class DailySummaryPresenter

  attr_accessor :text

  def initialize(user_team_id)
    user_team = UserTeam.find(user_team_id)
    user = user_team.user
    team = user_team.team
    @text = team.integrations.map(&:daily_summary)
    @graph = team_daily_graph(team)
  end

  def team_daily_graph(team)
    scraper = ScrapeTeamDailyGraph.new
    scraper.execute
  end
end
