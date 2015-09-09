class Api::IntegrationsController < Api::BaseController
  before_action :set_integration, only: [:show, :update, :destroy]

  def index
    @integrations = valid_team.integrations
    render json: @integrations, each_serializer: Api::IntegrationSerializer
  end

  def show
    render json: @integration, serializer: Api::IntegrationSerializer, root: nil, detail_required: true
  end

  def update
    @integration.update_setting(params[:integration][:setting])
    render json: @integration, serializer: Api::IntegrationSerializer, root: nil, detail_required: true
  rescue => ex
    fail ex
    render_error t('integration.api.errors.update_failed'), status: :internal_server_error
  end

  def destroy
    if @integration.destroy
      render json: @integration, serializer: Api::IntegrationSerializer, root: nil
    else
      render_error t('integration.api.errors.destroy_failed'), status: :internal_server_error
    end
  end

  private
  def set_integration
    @integration = valid_team.integrations.find_by(id: params[:id])
    render_error t('api.error.integrations.not_found'), status: :bad_request and return unless @integration
  end
end
