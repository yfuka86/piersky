class ActivitySlack
  include Cequel::Record
  key :identity_id, :int
  key :ts, :timestamp

  column :channel_id, :text, index: true
  column :type, :text
  column :message, :text

  def self.by_integration(integration)
    self.values_at(*integration.identities.pluck(:id))
  end

  def self.by_channel(integration, channel)
    self.by_integration(integration).where(channel_id: channel.id)
  end

  def self.oldest_ts(integration)
    self.by_integration(integration).first.try(:ts)
  end

  def self.latest_ts(integration)
    self.by_integration(integration).last.try(:ts)
  end

  def self.create_with_integration(message, channel, integration)
    if message["user"]
      activity = self.new(channel_id: channel.id, ts: message["ts"].to_f, message: message["text"], type: message["type"])
      activity.identity_id = IdentitySlack.find_or_initialize_with_id(message["user"], integration).tap(&:save!).id
      activity.save!
    end
  end
end
