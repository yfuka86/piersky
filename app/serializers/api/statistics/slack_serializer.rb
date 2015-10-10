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
    period = SkyModule.get_period
    q = ActivitySlack.where(identity_id: object.identities.pluck(:id), ts: SkyModule.get_inclusive_period)
                     .group('identity_id', 'channel_id', "date_trunc('day',ts)").count

    object.identities.map do |identity|
      counts = q.select{|k, v| k[0] == identity.id}

      channels_obj = {}
      channels.keys.each do |cid|
        channels_obj[cid] = period.map{|d| counts.find{|k, v| k[1].to_sym == cid && k[2] == d}.try(:[], 1) || 0}.reverse
      end

      {
        id: identity.id,
        default: period.map{|d| counts.select{|k, v| k[2] == d}.values.sum }.reverse
      }.merge(channels_obj)
    end
  end
end
