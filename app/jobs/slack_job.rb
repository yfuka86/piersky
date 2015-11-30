class SlackJob < ActiveJob::Base
  queue_as :default

  def perform(integration_id)
    ActiveRecord::Base.transaction do
      integration = IntegrationSlack.find_by(id: integration_id)
      integration.connect_identities_by_email
      team = SlackTeam.find_or_create(integration.team_info, integration)

      # fix range of time
      now = DateTime.now.to_f
      latest_persisted = (ActivitySlack.latest_ts(integration) || 1.0).to_f
      #

      integration.show_channels.each do |c|
        channel = SlackChannel.find_or_create(c, integration)

        oldest_in_fetching = now
        until (messages = integration.show_messages(channel, oldest: latest_persisted, latest: oldest_in_fetching)) && messages.length == 0
          messages.each do |m|
            ActivitySlack.create_with_integration(m, channel, integration)
          end
          oldest_in_fetching = messages.last["ts"].to_f
        end
      end

      integration.default!
    end
  end
end
