class GithubRepository < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  FOREIGN_KEY = :repository_id
  include Concerns::ActivityParent
  has_many :github_issues, foreign_key: :repository_id
  has_many :github_pull_requests, foreign_key: :repository_id

  def self.find_or_create(params, integration)
    repository = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    repository ||= self.create(foreign_id: params["id"], integration_id: integration.id)
    repository.full_name = params["full_name"] if repository.full_name != params["full_name"]
    repository.save!
    repository
  end
end
