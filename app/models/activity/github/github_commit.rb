class GithubCommit < ActiveRecord::Base
  # include Cequel::Record
  # key :id, :text
  # key :ts, :timestamp
  # column :integration_id, :int, index: true
  # column :message, :text
  # column :url, :text

  has_many :github_commit_activities
  has_many :activity_githubs, through: :github_commit_activities

  def self.find_or_create(params, integration, activity)
    commit = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    commit ||= self.create(
              integration_id: integration.id,
              foreign_id: params["id"],
              message: params["message"],
              ts: params["timestamp"],
              url: params["url"])
    activity.github_commits << commit
    commit
  end
end