class Api::IntegrationsController < Api::BaseController
  before_action :set_integration, only: [:show, :stats, :update, :destroy]

  def index
    @integrations = valid_team.integrations
    render json: @integrations, each_serializer: Api::IntegrationSerializer
  end

  def show
    render json: @integration, serializer: Api::IntegrationSerializer, root: nil, detail_required: true
  end

  def stats
    render json: @integration,
           serializer: "Api::Statistics::#{@integration.class.name.split('Integration')[1]}Serializer".constantize,
           root: nil
    @integration.refresh_data
  end

  def update
    ActiveRecord::Base.transaction do
      @integration.assign_attributes(integration_params)
      @integration.save!
      @integration.update_setting(params[:integration][:settings])
    end
    render json: @integration, serializer: Api::IntegrationSerializer, root: nil, detail_required: true
  rescue => ex
    render_error ex.message.presence || t('integration.api.errors.update_failed'), status: :internal_server_error
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
    if valid_user.email == 'yuta@piersky.com'
      @integration = Integration.find_by(id: params[:id])
    else
      @integration = valid_team.integrations.find_by(id: params[:id])
    end
    render_error t('integration.api.errors.not_found'), status: :bad_request and return unless @integration
  end

  def integration_params
    params.require(:integration).permit(:label)
  end
end
