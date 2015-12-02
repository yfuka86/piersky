class ActivitySlack < ActiveRecord::Base
  include Concerns::Activity
  self.inheritance_column = nil

  belongs_to :channel, class_name: 'SlackChannel', foreign_key: :channel_id

  scope :by_channel, -> (integration, channel) { by_channel_id(integration, channel.id) }
  scope :by_channel_id, -> (integration, channel_id) { by_integration(integration).where(channel_id: channel_id)}

  class << self
    def create_with_integration(message, channel, integration)
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

    def daily_summary(integration)
      obj = {}
      obj[:main] = daily_time_series(integration)

      channels = self.
        where(ts: SkyModule.yesterday_range).
        group(:channel_id).
        count.
        sort_by{|k, v| -v}.
        map{|c| c[0]}

      channels.each do |c|
        channel_name = SlackChannel.find_by(foreign_id: c).name
        q = self.
          by_channel_id(integration, c).
          where(ts: SkyModule.yesterday_range)
        obj[c.to_sym] = {sentence: 'integration.slack.sentence.message', options: {channel: channel_name}, query: q, count: q.group(:identity_id).count}
      end

      obj
    end
  end

  def content
    message.gsub(/<(.*?)\|?(.*?)>/) do |word|
      if $1[0, 2] == '@U'
        "@#{IdentitySlack.find_by(primary_key: $1[1..-1]).try(:name) || $2 || $1[1..-1]}"
      elsif $1[0, 2] == '#C'
        "##{SlackChannel.find_by(foreign_id: $1[1..-1]).try(:name) || $2 || $1[1..-1]}"
      elsif $1[0, 4] == 'http'
        str = $1
        m = $1.match(/(.*)\|(.*)/)
        m ? "<a href='#{m[1]}'>#{m[2]}</a>" : "<a href='#{str}'>#{str}</a>"
      else
        str = $1
        m = $1.match(/(.*)\|(.*)/)
        m ? m[2] : str
      end
    end.html_safe
  end
end