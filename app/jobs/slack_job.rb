class SlackJob < ActiveJob::Base
  queue_as :default

  def perform(integration_id)
    ActiveRecord::Base.transaction do
      integration = IntegrationSlack.find_by(id: integration_id)
      team = SlackTeam.find_or_create(integration.team_info)

      # fix range of time
      now = DateTime.now.to_f
      latest_persisted = ActivitySlack.latest_ts(integration) || 1.0
      #

      integration.show_channels.each do |c|
        channel = SlackChannel.find_or_create(c)

        oldest_in_fetched = now
        until (messages = integration.show_messages(channel, oldest: latest_persisted, latest: oldest_in_fetched)) && messages.length == 0
          messages.each do |m|
            ActivitySlack.create_with_integration(m, channel, integration)
          end
          oldest_in_fetched = messages.last["ts"].to_f
        end
      end
    end
  end
end
