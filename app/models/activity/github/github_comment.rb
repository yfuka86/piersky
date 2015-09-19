class GithubComment
  include Cequel::Record
  key :id, :int
  column :body, :text
  column :ts, :timestamp
  column :url, :text

  def self.find_or_create(params)
    comment = self.find_by_id(params["id"])
    comment = self.create(
                id: params["id"],
                body: params["body"],
                ts: params["craeted_at"],
                url: params["url"]) unless comment
    comment
  end
end