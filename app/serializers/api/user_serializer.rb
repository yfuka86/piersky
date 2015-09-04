class Api::UserSerializer < ActiveModel::Serializer

  attributes :email, :id, :name, :teams

  def name
    if options[:is_me]
      object.user_teams.find_by(team: current_user.current_team).user_name
    elsif options[:team]
      object.user_teams.find_by(team: options[:team]).user_name
    else
      ''
    end
  end

  def teams
    if options[:is_me]
      object.teams.map do |team|
        Api::TeamSerializer.new(team, root: nil)
      end
    else
      nil
    end
  end
end
