module Api
  class SlackWrapperController< BaseController
    before_action :set_slack

    def index
      channels = @slack.show_channels
      render json: { success: true, channels: channels }.to_json
    end

    def show
      messages = @slack.show_messages(params[:id], params[:ts])
      render json: { success: true, messages: messages }.to_json
    end

    private
    def set_slack
      @slack = Integration.find_by(user: current_user, type: Integration::Slack)
    end

  end


end
