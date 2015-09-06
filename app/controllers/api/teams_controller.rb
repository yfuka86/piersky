class Api::TeamsController < Api::BaseController
  def current
    team = valid_user.current_team
    if team
      render json: team, serializer: Api::TeamSerializer, detail_required: true, root: nil
    else
      render_error t('api.error.unauthorized')
    end
  end
end
