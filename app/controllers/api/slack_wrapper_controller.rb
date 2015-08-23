module Api
  class SlackWrapperController< BaseController
    before_action :set_slack

    def index
      channels = @slack.show_channels
      render json: { success: true, channels: channels }.to_json
    end

    def show
      messages = @slack.show_messages(params[:id], params[:ts])
      messages["messages"].each do |message|
        next if message["type"]!= "message" || message["text"].blank?
        activity = SlackActivity.find_by(channel: params[:id], ts: message["ts"])
        if activity.blank?
          activity_params = { user_id: current_user.id, channel: params[:id], ts: message["ts"], message: message["text"].slice(1, 100)}
          activity = SlackActivity.create(activity_params)
          activity.save!
        end
      end
      render json: { success: true, messages: messages }.to_json
    end

    private
    def set_slack
      @slack = Integration.find_by(user: current_user, type: "Integration::Slack")
    end

  end


end
