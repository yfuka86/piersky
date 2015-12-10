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

  def identities_stats
    range_length = (params[:range].presence || 1).to_i
    range = (SkyModule.now - range_length.day)..SkyModule.now
    @user = User.find_by(id: params[:id])
    render_error and return if @user.blank? || @user.current_team.blank?
    @identities = Identity.by_user(@user, valid_team).sort{|i| -i.activities.where(ts: range).count}
    @identities = @identities[0, 2]
    render json: @identities,
           each_serializer: Api::Statistics::IdentitySerializer,
           root: :identities, range: range, range_length: range_length
  end
end
