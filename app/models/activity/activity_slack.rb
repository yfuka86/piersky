class ActivitySlack < ActiveRecord::Base
  include Concerns::Activity

  extend SkyModule
  self.inheritance_column = nil

  scope :by_channel, -> (integration, channel) { by_integration(integration).where(channel_id: channel.id) }

  def self.create_with_integration(message, channel, integration)
    if message["user"]
      activity = self.new(channel_id: channel.foreign_id,
                          ts: Time.at(message["ts"].to_f),
                          message: message["text"].length <= 255 ? message["text"] : '',
                          long_message: message["text"].length > 255 ? message["text"] : '',
                          type: message["type"])
      activity.identity_id = IdentitySlack.find_or_initialize_with_id(message["user"], integration).tap(&:save!).id
      activity.save!
    end
  end
end
