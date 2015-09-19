class GithubCommit
  include Cequel::Record
  key :id, :text
  column :message, :text
  column :ts, :timestamp
  column :url, :text

  def self.find_or_create(params)
    commit = self.find_by_id(params["id"])
    commit = self.create(
              id: params["id"],
              message: params["message"],
              ts: params["timestamp"],
              url: params["url"]) unless commit
    commit
  end
end