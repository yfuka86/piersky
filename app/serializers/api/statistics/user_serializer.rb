class Api::Statistics::UserSerializer < ActiveModel::Serializer
  attributes :user_id, :today, :integrations

  def user_id
    object.id
  end

  def today
    @today ||= SkyModule.today
  end

  def integrations
    period = SkyModule.get_period
    user_team = UserTeam.find_by(user: object, team: object.current_team)
    identity_ids = user_team.identities.pluck(:integration_id).uniq
    integrations = Integration.where(id: identity_ids)

    integrations.map do |integration|
      q = integration.activity_class.where(identity_id: identity_ids)
      daily_counts = q.where(ts: period).group("date_trunc('day', ts)").count
      hourly_counts = q.group("date_part('hour', ts)").count
      {
        id: integration.id,
        default: period.map{|d| daily_counts.select{|k, v| k == d}.values.sum }.reverse,
        day: (0..23).map{|h| hourly_counts.select{|k, v| k == h}.values.sum }
      }
    end
  end
end
