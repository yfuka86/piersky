class GithubCommit < ActiveRecord::Base
  ACTIVITY_RELATION_CLASS = GithubCommitActivity
  ACTIVITY_CLASS = ActivityGithub
  include Concerns::ActivityRelated

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