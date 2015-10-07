class GithubIssue < ActiveRecord::Base
  # include Cequel::Record
  # key :integration_id, :int
  # key :id, :int
  # key :ts, :timestamp
  # column :number, :int, index: true
  # column :title, :text, index: true
  # column :state, :text, index: true
  # column :url, :text

  has_many :activity_githubs, primary_key: "foreign_id", foreign_key: "issue_id", class_name: "ActivityGithub"

  def self.find_or_create(params, integration)
    issue = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    issue = self.create(integration_id: integration.id, foreign_id: params["id"], number: params["number"], url: params["url"], ts: params["created_at"]) unless issue
    issue.title = params["title"] if issue.title != params["title"]
    issue.state = params["state"] if issue.title != params["state"]
    issue.save!
    issue
  end
end
