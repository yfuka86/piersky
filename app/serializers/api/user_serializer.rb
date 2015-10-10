class Api::UserSerializer < ActiveModel::Serializer

  attributes :email, :id, :name, :teams, :summary

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

  def summary
    return unless options[:team]
    period = SkyModule.get_period
    user_team = object.user_teams.find_by(team: object.current_team)
    identities =  user_team.identities
    identity_ids = identities.pluck(:id)
    integration_ids = identities.pluck(:integration_id).uniq
    integrations = ::Integration.where(id: integration_ids)

    counts = integrations.map do |integration|
      q = integration.activity_class.where(identity_id: identity_ids)
      daily_counts = q.where(ts: SkyModule.get_inclusive_period).group("date_trunc('day', ts)").count
      period.map{|d| daily_counts.select{|k, v| k == d}.values.sum }.reverse
    end
    counts.transpose.map(&:sum)
  end
end
