class GithubComment
  include Cequel::Record
  key :id, :int
  key :ts, :timestamp
  column :integration_id, :int, index: true
  column :body, :text
  column :url, :text

  def self.find_or_create(params, integration)
    comment = self[params["id"]].first
    comment = self.create(
                integration_id: integration.id,
                id: params["id"],
                body: params["body"],
                ts: params["created_at"],
                url: params["url"]) unless comment
    comment
  end
end