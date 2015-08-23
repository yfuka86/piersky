module Api
  class SlackGathersController< BaseController
    def index
      gathers = SlackGather.where(own_id: current_user.id)
      render json: gathers
    end

    def create
      gather = SlackGather.create(gather_params)
      gather.own_id = current_user.id

      if gather.save
        render json: gather
      else 
        render_error "save failed", status: :bad_request
      end
    end

    def show
      gather = SlackGather.find_by(id: params[:id], own_id: current_user.id)

      render_not_found && return if gather.blank?

      render json: gather
    end

    def add_activities
      gather = SlackGather.find_by(id: params[:id], own_id: current_user.id)

      render_not_found && return if gather.blank?

      params[:activities].each do |a_id|
        activity = SlackActivity.find_by(a_id)
        render_not_found && return if activity.blank?
        gather.activities << activity
      end

      render json: gather
    end

    private
    def gather_params
      params.require(:slack_gather).permit(:title)
    end

  end


end
