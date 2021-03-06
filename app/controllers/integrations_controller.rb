class IntegrationsController < WebBaseController
  skip_before_filter :verify_authenticity_token, :authenticate_user!, only: :incoming_webhook

  def incoming_webhook
    webhook = IntegrationWebhook.find_by(uid: params[:webhook_uid])
    if webhook.try(:execute, JSON.parse(params[:payload]))
      render json: { status: :ok }
    else
      render json: { status: :error }
    end
  end
end
