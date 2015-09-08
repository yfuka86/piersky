class Api::IntegrationsController < Api::BaseController
  before_action :set_integration, only: [:update, :destroy]

  def index
    @integrations = valid_team.integrations
    render json: @integrations, each_serializer: Api::IntegrationSerializer
  end

  def update
    render_error t('api.error.integrations.not_found'), status: :bad_request and return unless @integration
    @integration.update_setting(params[:integration][:setting])
    render json: @integration, serializer: Api::IntegrationSerializer, root: nil
  rescue => ex
    fail ex
    render_error t('api.errors.integrations.import_failed'), status: :internal_server_error
  end

  def destroy
    team = valid_user.teams.find_by(external_cid: params[:team_id])
    integration = team.integrations.find_by(id: params[:id])
    if integration.destroy
      render json: integration, serializer: Api::IntegrationSerializer, root: nil
    else
      render_error t('api.errors.integrations.destroy_failed'), status: :internal_server_error
    end
  end

  private
  def set_integration
    team = valid_user.teams.find_by(external_cid: params[:integration][:team_id])
    @integration = team.integrations.find_by(id: params[:id])
  end
end
