class DailySummaryPresenter

  attr_accessor :graph, :users, :no_user_identities

  def initialize(user_team_id)
    user_team = UserTeam.find(user_team_id)
    user = user_team.user
    team = user_team.team

    @graph = Rails.env.development? ? {
      image: '',
      legends: '<ul class="line-legend"><li><span style="background-color:#7e57c2"></span>Github</li><li><span style="background-color:#ef5350"></span>Slack</li></ul>'.html_safe
      } : team_daily_graph(team)
    summary = {}
    team.integrations.each do |integration|
      summary[integration.id] = integration.daily_summary
    end
    @users = team.
      user_teams.
      sort_by{|u| - u.daily_activity_count}.
      map do |u|
        identity_summaries = u.identities.map do |identity|
          summaries = summary[identity.integration_id] || {}
          summaries_obj = {object: identity, summary: {}}
          summaries.each do |k, v|
            if v.is_a?(Hash)
              summaries_obj[:summary][k] = {
                sentence: I18n.t(
                  v[:sentence],
                  {count: v[:count][identity.id]}.merge(v[:options] || {})
                ),
                # contentはここで使ってる
                contents: v[:query].where(identity_id: identity.id).order(ts: :desc).limit(5).reverse.map(&:content)
              } if v[:count][identity.id].to_i > 0
            end
          end
          summaries_obj
        end

        {user_team: u, identities: identity_summaries}
      end

    @no_user_identities = team.
      integrations.map do |i|
        i.identities.map do |identity|
          summaries = summary[identity.integration_id] || {}
          summaries_obj = {object: identity, summary: {}}
          summaries.each do |k, v|
            if v.is_a?(Hash)
              summaries_obj[:summary][k] = {
                sentence: I18n.t(
                  v[:sentence],
                  {count: v[:count][identity.id]}.merge(v[:options] || {})
                ),
                # contentはここで使ってる
                contents: v[:query].where(identity_id: identity.id).order(ts: :desc).limit(5).reverse.map(&:content)
              } if v[:count][identity.id].to_i > 0
            end
          end
          summaries_obj
        end
      end.flatten
  end

  def team_daily_graph(team)
    scraper = ScrapeTeamDailyGraph.new(team)
    scraper.execute
  end
end
