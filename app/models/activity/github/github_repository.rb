class GithubRepository < ActiveRecord::Base
  # include Cequel::Record
  # key :integration_id, :int
  # key :id, :int
  # column :full_name, :text, index: true

  has_many :github_issues
  has_many :github_pull_requests
  has_many :activity_githubs, foreign_key: "repository_id", class_name: "ActivityGithub"

  def self.find_or_create(params, integration)
    repository = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    repository ||= self.create(foreign_id: params["id"], integration_id: integration.id)
    repository.full_name = params["full_name"] if repository.full_name != params["full_name"]
    repository.save!
    repository
  end
end
