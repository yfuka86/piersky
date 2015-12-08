class GithubCommit < ActiveRecord::Base
  ACTIVITY_RELATION_CLASS = GithubCommitActivity
  ACTIVITY_CLASS = ActivityGithub
  include Concerns::ActivityRelated

  scope :default_branch, -> {
    joins(activities: [:repository]).
    where("char_length(substring(activity_githubs.ref, github_repositories.default_branch)) != 0")
  }

  # should be called with count
  scope :group_by_author, -> (integration) {
    joins(:integration, :activities).
    where(integrations: {id: integration.id}, activity_githubs: {code: ActivityGithub::CODES[:push]}).
    group('github_commits.author_name')
  }

  def self.parse(params, integration)
    {
      foreign_id: params['id'],
      message: params['message'],
      ts: params['timestamp'],
      url: params['url'],
      author_name: params['author'].try(:[], 'name')
    }
  end
end