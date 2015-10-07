class GithubCommit < ActiveRecord::Base
  # include Cequel::Record
  # key :id, :text
  # key :ts, :timestamp
  # column :integration_id, :int, index: true
  # column :message, :text
  # column :url, :text

  belongs_to :github_activity

  def self.find_or_create(params, integration, activity)
    commit = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    commit = self.create(
              activity_id: activity.id,
              integration_id: integration.id,
              foreign_id: params["id"],
              message: params["message"],
              ts: params["timestamp"],
              url: params["url"]) unless commit
    commit
  end
end