class GithubIssue < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  FOREIGN_KEY = :issue_id
  include Concerns::ActivityParent  
  belongs_to :repository, class_name: 'GithubRepository', foreign_key: :repository_id

  def self.parse(params, integration)
    repo = params['repository']
    params = params['issue']
    {
      repository: GithubRepository.find_or_create!(repo, integration),
      foreign_id: params['id'],
      number: params['number'],
      url: params['url'],
      ts: params['created_at'],
      title: params['title'],
      state: params['state']
    }
  end
end
