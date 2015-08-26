class Integration::Slack < Integration
  require "slack"
  USERNAME = "Piersky"
  ICON_URL = "https://www.blueskyexhibits.com/website/wp-content/uploads/sky-home.jpg"

  def create_identity
    info = slack_client.auth_test
    super(info["user_id"], info["team_id"])
  end

  def update_setting(setting)
    return unless project = Project.find_by_id(setting[:project_id])
    self.setting.update_attributes(project_id: project.id, synced_object: setting[:channel])
  end

  def channel_names
    slack_client.channels_list["channels"].map {|x| "#" + x["name"] }
  end

  def show_channels
    slack_client.channels_list["channels"]
  end

  def show_messages(channel_id, ts)
    slack_client.channels_history(channel: channel_id, latest: ts)
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
