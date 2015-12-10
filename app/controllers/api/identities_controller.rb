class Api::IdentitiesController < Api::BaseController
  def index
    @identities = Identity.includes(:integration).joins(:integration).where(integrations: {team_id: valid_team.id})
    render json: @identities, each_serializer: Api::IdentitySerializer
  end

  def update
    @identity = Identity.includes(:integration).joins(:integration).where(integrations: {team_id: valid_team.id}).find_by(id: params[:id])
    @user_team = valid_team.user_teams.find_by(user_id: params[:user_id])
    @identity.update!(user_team: @user_team)
    render json: @identity, serializer: Api::IdentitySerializer, root: nil
  end

  def stats
    @identity = Identity.includes(:integration).joins(:integration).where(integrations: {team_id: valid_team.id}).find_by(id: params[:id])
    range_length = (params[:range].presence || 1).to_i
    render json: @identity,
           serializer: Api::Statistics::IdentitySerializer,
           root: nil,
           range: (SkyModule.now - range_length.day)..SkyModule.now,
           range_length: range_length,
           each_limit: (params[:each_limit] || 1).to_i
  end
end
