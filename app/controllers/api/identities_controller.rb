class Api::IdentitiesController < Api::BaseController
  def index
    @identities = Identity.includes(:integration).joins(:integration).where(integrations: {team_id: valid_team.id})
    render json: @identities, each_serializer: Api::IdentitySerializer
  end
end
