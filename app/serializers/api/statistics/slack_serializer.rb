class Api::Statistics::SlackSerializer < ActiveModel::Serializer
  attributes :integration_id, :channels, :today, :identities

  def integration_id
    object.id
  end

  def today
    @today ||= Date.today
  end

  def channels
    @channels ||= SlackChannel[object.id].reduce({}){ |hash, (c)| hash.merge({c.id.to_sym => c.name})  }
  end

  def identities
    object.identities.map do |identity|
      channels_obj = {}
      channels.keys.each do |cid|
        channels_obj[cid] = period_map(ActivitySlack[identity.id].where(channel_id: cid)).map(&:count)
      end

      {
        id: identity.id,
        default: period_map(ActivitySlack[identity.id]).map(&:count),
      }.merge(channels_obj)
    end
  end

  def period_map(q)
    (1..31).map{|i| q.after(today - (i - 1).day).upto(today - (i - 2).day) }
  end
end
