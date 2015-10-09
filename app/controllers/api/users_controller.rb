class Api::UsersController < Api::BaseController
  def me
    if valid_user
      render json: valid_user, serializer: Api::UserSerializer, is_me: true, root: nil
    else
      render_error t('api.error.unauthorized')
    end
  end

  def stats
    @user = User.find_by(id: params[:id])
    render json: @user,
           serializer: Api::Statistics::UserSerializer,
           root: nil
  end
end
