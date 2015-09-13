class Api::IdentitiesController < Api::BaseController
  def index
    @identities = Identity.includes(:user_team).joins(:user_team).where(user_teams: {team_id: valid_team.id})
    render json: @identities, each_serializer: Api::IdentitySerializer
  end
end
