class Api::Statistics::UserSerializer < ActiveModel::Serializer
  attributes :user_id, :channels, :today, :identities

  def user_id
    object.id
  end

  def today
    @today ||= SkyModule.today
  end

  def identities
    period = SkyModule.get_period
    q = ActivitySlack.where(identity_id: object.identities.pluck(:id), ts: period)
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
