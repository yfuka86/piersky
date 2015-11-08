class GithubPullRequest < ActiveRecord::Base
  # include Cequel::Record
  # key :integration_id, :int
  # key :id, :int
  # key :ts, :timestamp
  # column :number, :int, index: true
  # column :title, :text, index: true
  # column :state, :text, index: true
  # column :url, :text
  belongs_to :github_repository
  has_many :activity_githubs, foreign_key: "pull_request_id", class_name: "ActivityGithub"

  def self.find_or_create(params, integration)
    pr = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    pr = self.create(integration_id: integration.id, foreign_id: params["id"], number: params["number"], url: params["url"], ts: params["created_at"]) unless pr
    pr.title = params["title"] if pr.title != params["title"]
    pr.state = params["state"] if pr.title != params["state"]
    pr.save!
    pr
  end
end