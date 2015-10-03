class SlackJob < ActiveJob::Base
  queue_as :default

  def perform(integration_id)
    ActiveRecord::Base.transaction do
      integration = IntegrationSlack.find_by(id: integration_id)
      team = SlackTeam.find_or_create(integration.team_info)

      # fix range of time
      now = DateTime.now.to_f
      latest = ActivitySlack.latest_ts(integration).to_f || 1
      #

      integration.show_channels.each do |c|
        channel = SlackChannel.find_or_create(c)

        latest_in_fetched = latest
        until messages = integration.show_messages(channel, oldest: latest_in_fetched, latest: now) && messages.length == 0
          latest_in_fetched = masseges.last["ts"].to_f
          messages.each do |m|
            ActivitySlack.create_with_integration(m, integration)
          end
        end
      end
    end
  end
end
