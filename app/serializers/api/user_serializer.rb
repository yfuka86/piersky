class Api::UserSerializer < ActiveModel::Serializer

  attributes :email, :id, :user_teams

  def user_teams
    current_user = options[:current_user]
    if current_user.present?
      object.user_teams.where(user_id: current_user.id).map do |user_team|
        Api::UserTeamSerializer.new(user_team, team: true, root: nil)
      end
    else
      []
    end
  end
end
