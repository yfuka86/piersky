class GithubCommit
  include Cequel::Record
  key :id, :text
  key :ts, :timestamp
  column :message, :text
  column :url, :text

  def self.find_or_create(params)
    commit = self[params["id"]].first
    commit = self.create(
              id: params["id"],
              message: params["message"],
              ts: params["timestamp"],
              url: params["url"]) unless commit
    commit
  end
end