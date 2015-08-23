class Api::IntegrationsController < Api::BaseController

  def index
    @integrations = current_user.integrations
    render json: @integrations, each_serializer: Api::IntegrationSerializer
  end
end
