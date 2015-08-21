class IntegrationsController < WebBaseController
  skip_before_filter :verify_authenticity_token, :authenticate_user!, only: :incoming_webhook

  def establish
    return if !params[:provider] || !params[:team_id] || !current_user
    klass = "Integration::#{params[:provider].classify}".constantize
    team = current_user.teams.find_by(external_cid: params[:team_id])
    klass.establish(team, current_user, params[:options])
    redirect_to "/auth/#{params[:provider]}"
  end

  def incoming_webhook
    webhook = IntegrationWebhook.find_by(uid: params[:webhook_uid])
    if webhook.try(:execute, JSON.parse(params[:payload]))
      render json: { status: :ok }
    else
      render json: { status: :error }
    end
  end
end
