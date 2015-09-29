class GithubComment
  include Cequel::Record
  key :id, :int
  key :ts, :timestamp
  column :body, :text
  column :url, :text

  def self.find_or_create(params)
    comment = self[params["id"]].first
    comment = self.create(
                id: params["id"],
                body: params["body"],
                ts: params["created_at"],
                url: params["url"]) unless comment
    comment
  end
end