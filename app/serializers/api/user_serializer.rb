class Api::UserSerializer < ActiveModel::Serializer

  attributes :email, :id, :name, :teams, :summary, :gravatar_url, :identity, :color

  def user_team
    @user_team ||= if options[:is_me]
      object.user_teams.find_by(team: current_user.current_team)
    elsif options[:team]
      object.user_teams.find_by(team: options[:team])
    end
  end

  def name
    user_team.try(:user_name)
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

  def identity
    user_team.identity
  end

  def color
    user_team.color
  end

  def summary
    return unless options[:team]
    user_team = object.user_teams.find_by(team: object.current_team)
    integration_ids = user_team.identities.pluck(:integration_id).uniq
    integrations = ::Integration.where(id: integration_ids)

    counts = integrations.map do |integration|
      q = integration.class.activity_class.where(identity_id: Identity.where(integration_id: integration.id, user_team_id: user_team.id).pluck(:id))
      SkyModule.get_day_time_series(q)
    end.push((1..28).map{0})

    recent = {}
    integrations.map do |integration|
      q = integration.class.activity_class.where(identity_id: Identity.where(integration_id: integration.id, user_team_id: user_team.id).pluck(:id))
      recent[integration.class.service_name] ||= 0
      recent[integration.class.service_name] += q.where(ts: 1.day.ago..DateTime.now).count
    end

    {count: counts.transpose.map(&:sum), recent: recent}
  end
end
