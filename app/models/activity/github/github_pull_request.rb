class GithubPullRequest
  include Cequel::Record
  key :id, :int
  key :ts, :timestamp
  column :number, :int, index: true
  column :title, :text, index: true
  column :state, :text, index: true
  column :url, :text

  def self.find_or_create(params)
    pr = self[params["id"]].first
    pr = self.create(id: params["id"], number: params["number"], url: params["url"], ts: params["created_at"]) unless pr
    pr.title = params["title"] if pr.title != params["title"]
    pr.state = params["state"] if pr.title != params["state"]
    pr.save!
    pr
  end
end