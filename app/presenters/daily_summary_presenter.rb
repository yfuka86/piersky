class DailySummaryPresenter

  attr_accessor :graph, :text, :users

  def initialize(user_team_id)
    user_team = UserTeam.find(user_team_id)
    user = user_team.user
    team = user_team.team
    @graph = team_daily_graph(team)
    summary = team.integrations.map(&:daily_summary)
    @users = team.users.map do |u|
      u
    end
  end

  def team_daily_graph(team)
    scraper = ScrapeTeamDailyGraph.new(team)
    scraper.execute
  end
end
