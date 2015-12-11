class SlackJob < ActiveJob::Base
  queue_as :default

  def perform(integration_id)
    ActiveRecord::Base.transaction do
      integration = IntegrationSlack.find_by(id: integration_id)
      team_info = integration.team_info

      return unless team_info

      integration.connect_identities_by_email
      team = SlackTeam.find_or_create(team_info, integration)

      # fix range of time
      now = DateTime.now.to_f
      latest_persisted = (ActivitySlack.latest_ts(integration) || 1.0).to_f
      #

      integration.show_channels.each do |c|
        channel = SlackChannel.find_or_create(c, integration)

        oldest_in_fetching = now
        # oldest: latest_persisted,
        until (messages = integration.show_messages(channel, latest: oldest_in_fetching)) && messages.length == 0
          messages.each_with_index do |m, i|
            next if channel.activities.find_by(ts: Time.at(m["ts"]), message: m["text"]).present?

            ActivitySlack.create_with_integration(m, channel, integration)
          end
          oldest_in_fetching = messages.last["ts"].to_f
        end
      end

      integration.default!
    end
  end
end
