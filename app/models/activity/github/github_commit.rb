class GithubCommit
  include Cequel::Record
  key :id, :text
  key :ts, :timestamp
  column :integration_id, :int, index: true
  column :message, :text
  column :url, :text

  def self.find_or_create(params, integration)
    commit = self[params["id"]].first
    commit = self.create(
              integration_id: integration.id,
              id: params["id"],
              message: params["message"],
              ts: params["timestamp"],
              url: params["url"]) unless commit
    commit
  end
end