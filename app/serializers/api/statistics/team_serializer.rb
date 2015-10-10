class Api::Statistics::TeamSerializer < ActiveModel::Serializer
  attributes :today, :users

  def today
    @today ||= SkyModule.today
  end

  def users
    # period = SkyModule.get_period
    # user_team = object.user_teams.find_by(team: object.current_team)
    # identity_ids = user_team.identities.pluck(:integration_id).uniq
    # integrations = ::Integration.where(id: identity_ids)

    # integrations.map do |integration|
    #   q = integration.activity_class.where(identity_id: identity_ids)
    #   daily_counts = q.where(ts: SkyModule.get_inclusive_period).group("date_trunc('day', ts)").count
    #   hourly_counts = q.group("date_part('hour', ts)").count
    #   {
    #     id: integration.id,
    #     default: period.map{|d| daily_counts.select{|k, v| k == d}.values.sum }.reverse,
    #     day: (0..23).map{|h| hourly_counts.select{|k, v| k == h}.values.sum }
    #   }
    # end
  end
end