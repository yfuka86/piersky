class ActivitySlack < Activity
  include Cequel::Record
  key :integration_id, :int
  key :identity_id, :int
  key :ts, :timestamp

  column :channel_id, :int, index: true

  def self.create()
    messages = @slack.show_messages(params[:id], params[:ts])
    activities = []
    oldest_ts = nil
    messages["messages"].each do |message|
      oldest_ts = message["ts"] || oldest_ts
      next if message["type"]!= "message" || message["text"].blank? || message["user"].blank?
      activity = SlackActivity.find_by(channel: params[:id], ts: message["ts"])
      if activity.blank?
        activity_params = { user_id: message["user"], channel: params[:id], ts: message["ts"], message: message["text"].slice(0, 100)}
        activity = SlackActivity.create(activity_params)
        activity.save!
      end
      activities.push(activity)
    end

    if defined?(activity) && activity.class == self
      # activity.payload = p.to_s
      activity.repository_id = GithubRepository.find_or_create(p["repository"]).id
      activity.integration_id = integration.id
      activity.identity_id = IdentityGithub.find_or_initialize_with_payload(payload, integration).tap(&:save!).id
      activity.save!
      true
    else
      false
    end
  end
end
