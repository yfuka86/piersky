class GithubPullRequest < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  FOREIGN_KEY = :pull_request_id 
  include Concerns::ActivityParent  
  belongs_to :github_repository, foreign_key: :repository_id

  def self.find_or_create(params, integration)
    pr = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    pr ||= self.create(
      github_repository: GithubRepository.find_or_create(params["repo"]),
      integration_id: integration.id, 
      foreign_id: params["id"], 
      number: params["number"], 
      url: params["url"], 
      ts: params["created_at"])
    pr.title = params["title"] if pr.title != params["title"]
    pr.state = params["state"] if pr.title != params["state"]
    pr.save!
    pr
  end
end