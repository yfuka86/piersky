class GithubRepository < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  FOREIGN_KEY = :repository_id
  include Concerns::ActivityParent
  has_many :issues, class_name: 'GithubIssue', foreign_key: :repository_id
  has_many :pull_requests, class_name: 'GithubPullRequest', foreign_key: :repository_id

  def self.parse(params, integration)
    {
      foreign_id: params['id'],
      full_name: params['full_name']
    }
  end
end
