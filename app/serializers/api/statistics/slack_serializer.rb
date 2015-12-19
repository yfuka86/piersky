class Api::Statistics::SlackSerializer < ActiveModel::Serializer
  attributes :integration_id, :channels, :today, :identities

  def integration_id
    object.id
  end

  def channels
    @channels ||= SlackChannel.where(integration_id: object.id).reduce({}){ |hash, (c)| hash.merge({c.foreign_id.to_sym => c.name}) }
  end

  def today
    @today ||= SkyModule.today
  end

  def identities
    object.identities.map do |identity|
      q = ActivitySlack.where(identity_id: identity.id)
      next if q.count == 0

      channels_obj = {}
      channels.keys.each do |cid|
        channels_obj[cid] = SkyModule.get_day_time_series(q.where(channel_id: cid))
      end

      {
        id: identity.id,
        default: SkyModule.get_day_time_series(q)
      }.merge(channels_obj)
    end.compact
  end
end
