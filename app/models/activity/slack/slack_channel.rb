class SlackChannel < ActiveRecord::Base
  ACTIVITY_CLASS = ActivitySlack
  FOREIGN_KEY = :channel_id
  PRIMARY_KEY = :foreign_id
  include Concerns::ActivityParent

  def self.find_or_create(params, integration)
    channel = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    channel = self.create(integration_id: integration.id, foreign_id: params["id"], ts: params["created"], creator_id: params["creator"], name: params["name"]) unless channel
    channel.name = params["name"] if channel.name != params["name"]
    channel.save!
    channel
  end
end