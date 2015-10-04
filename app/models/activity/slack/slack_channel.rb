class SlackChannel
  include Cequel::Record
  key :integration_id, :int
  key :id, :text
  column :ts, :timestamp
  column :name, :text, index: true
  column :creator_id, :text, index: true
  column :is_general, :boolean

  def self.find_or_create(params, integration)
    channel = self[integration.id].find_by_id(params["id"])
    channel = self.create(integration_id: integration.id, id: params["id"], ts: params["created"], creator_id: params["creator"], name: params["name"]) unless channel
    channel.name = params["name"] if channel.name != params["name"]
    channel.save!
    channel
  end
end