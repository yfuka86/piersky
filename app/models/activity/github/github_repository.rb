class GithubRepository < ActiveRecord::Base
  # include Cequel::Record
  # key :integration_id, :int
  # key :id, :int
  # column :full_name, :text, index: true

  has_many :activity_github, primary_key: "foreign_id", foreign_key: "repository_id", class_name: "ActivityGithub"

  def self.find_or_create(params, integration)
    repository = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    repository = self.create(integration_id: integration.id, foreign_id: params["id"]) unless repository
    repository.full_name = params["full_name"] if repository.full_name != params["full_name"]
    repository.save!
    repository
  end
end
