class GithubPullRequest
  include Cequel::Record
  key :id, :int
  column :title, :text, index: true
  column :number, :int, index: true
  column :state, :text, index: true
  column :url, :text


  def self.find_or_create(params)
    pr = self[params["id"]].take(1)
    pr = self.create(id: params["id"], number: params["number"], url: params["url"]) unless pr
    pr.title = params["title"] if pr.title != params["title"]
    pr.state = params["state"] if pr.title != params["state"]
    pr.save!
    pr
  end
end