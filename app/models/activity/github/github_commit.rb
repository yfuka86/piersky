class GithubCommit < ActiveRecord::Base
  ACTIVITY_RELATION_CLASS = GithubCommitActivity
  ACTIVITY_CLASS = ActivityGithub
  include Concerns::ActivityRelated

  def self.parse(params, integration)
    {
      foreign_id: params['id'],
      message: params['message'],
      ts: params['timestamp'],
      url: params['url']
    }
  end
end