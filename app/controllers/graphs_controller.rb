class GraphsController < WebBaseController
  layout 'graph'
  skip_before_filter :verify_authenticity_token, :authenticate_user!, only: :index

  def index
    team = Team.find(params[:team_id])
    @string = team.integrations.map do |integration|
      {
        data: integration.daily_time_series,
        name: integration.name
      }
    end.to_json
  end
end
