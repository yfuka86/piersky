class DailySummaryPresenter

  attr_accessor :graph, :text, :users

  def initialize(user_team_id)
    user_team = UserTeam.find(user_team_id)
    user = user_team.user
    team = user_team.team
    @graph = team_daily_graph(team)
    summary = {}
    team.integrations.each do |i|
      summary[i.id] = i.daily_summary
    end
    @users = team.user_teams.map do |u|
      u.identities.map do |identity|
        summary = summary[identity.integration_id]
        summary_obj = {}
        summary.each do |k, v|
          if v.is_a?(Hash)
            summary_obj[k] = {
              summary: I18n.t(v[:sentence], count: v[:count][identity.id]),
              contents: [
                v[:query].where(identity_id: identity.id).last.content
              ]
            }
          end
        end
      end
    end
  end

  def team_daily_graph(team)
    scraper = ScrapeTeamDailyGraph.new(team)
    scraper.execute
  end
end
