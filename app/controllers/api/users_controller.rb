class Api::UsersController < Api::BaseController
  def me
    if valid_user
      render json: valid_user, serializer: Api::UserSerializer, current_user: valid_user, root: nil
    else
      render_error t('api.error.unauthorized')
    end
  end
end
