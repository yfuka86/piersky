class GithubIssue
  include Cequel::Record
  key :id, :int
  column :title, :text, index: true
  column :number, :int, index: true
  column :state, :text, index: true
  column :url, :text

  def self.find_or_create(params)
    issue = self.find_by_id(params["id"])
    issue = self.create(id: params["id"], number: params["number"], url: params["url"]) unless issue
    issue.title = params["title"] if issue.title != params["title"]
    issue.state = params["state"] if issue.title != params["state"]
    issue.save!
    issue
  end
end
