class Api::IntegrationsController < Api::BaseController

  def index
    @integrations = valid_team.integrations
    render json: @integrations, each_serializer: Api::IntegrationSerializer
  end
end
