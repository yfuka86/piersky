class IntegrationSlack < Integration
  require "slack"
  USERNAME = "Piersky"
  ICON_URL = "https://www.blueskyexhibits.com/website/wp-content/uploads/sky-home.jpg"

  def create_identity
    info = slack_client.auth_test
    super(info["user_id"], {name: info["user"]})
  end

  def update_setting(setting)
  end

  def team_info
    slack_client.team_info["team"]
  end

  def show_channels
    slack_client.channels_list["channels"]
  end

  def channel_names
    show_channels.map {|x| "#" + x["name"] }
  end

  # :latest, :oldest, :inclusive, :count
  def show_messages(channel, options={})
    slack_client.channels_history({channel: channel.try(:id) || channel}.merge(options))["messages"]
  end

  def user_info(id)
    slack_client.users_info(user: id)["user"]
  end

  def post_message(channel:, pretext:, title:, title_link:, text:, color:)
    slack_client.chat_postMessage(
      channel: channel,
      text: "",
      username: USERNAME,
      icon_url: ICON_URL,
      attachments: [
        {
            fallback: "#{pretext} - #{title} - #{title_link}",
            pretext: pretext,
            title: title,
            title_link: title_link,
            text: text,
            color: color,
        }
      ].to_json
    )
  end

  private

  def slack_client
    ::Slack.configure do |config|
      config.token = self.token
    end
    @slack_client ||= ::Slack.client
  end
end
