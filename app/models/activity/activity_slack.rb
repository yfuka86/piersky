class ActivitySlack < ActiveRecord::Base
  self.inheritance_column = nil
  # include Cequel::Record
  # key :identity_id, :int
  # key :ts, :timestamp

  # column :channel_id, :text, index: true
  # column :type, :text
  # column :message, :text

  scope :by_integration, -> (integration) { where(identity_id: integration.identities.pluck(:id)) }
  scope :by_channel, -> (integration, channel) { by_integration(integration).where(channel_id: channel.id) }

  def self.oldest_ts(integration)
    self.by_integration(integration).order(ts: :asc).first.try(:ts)
  end

  def self.latest_ts(integration)
    self.by_integration(integration).order(ts: :desc).first.try(:ts)
  end

  def self.create_with_integration(message, channel, integration)
    if message["user"]
      activity = self.new(channel_id: channel.id,
                          ts: Time.at(message["ts"].to_f),
                          message: message["text"].length <= 255 ? message["text"] : '',
                          long_message: message["text"].length > 255 ? message["text"] : '',
                          type: message["type"])
      activity.identity_id = IdentitySlack.find_or_initialize_with_id(message["user"], integration).tap(&:save!).id
      activity.save!
    end
  end
end
