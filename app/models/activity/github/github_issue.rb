class GithubIssue < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  FOREIGN_KEY = :issue_id
  include Concerns::ActivityParent  
  belongs_to :github_repository, foreign_key: :repository_id

  def self.find_or_create(params, integration)
    issue = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    issue ||= self.create(
      github_repository: GithubRepository.find_or_create(params["repo"]),
      integration_id: integration.id, 
      foreign_id: params["id"], 
      number: params["number"], 
      url: params["url"], 
      ts: params["created_at"])
    issue.title = params["title"] if issue.title != params["title"]
    issue.state = params["state"] if issue.title != params["state"]
    issue.save!
    issue
  end
end
