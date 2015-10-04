class GithubIssue
  include Cequel::Record
  key :integration_id, :int
  key :id, :int
  key :ts, :timestamp
  column :number, :int, index: true
  column :title, :text, index: true
  column :state, :text, index: true
  column :url, :text

  def self.find_or_create(params, integration)
    issue = self[integration.id].find_by_id(params["id"])
    issue = self.create(integration_id: integration.id, id: params["id"], number: params["number"], url: params["url"], ts: params["created_at"]) unless issue
    issue.title = params["title"] if issue.title != params["title"]
    issue.state = params["state"] if issue.title != params["state"]
    issue.save!
    issue
  end
end
