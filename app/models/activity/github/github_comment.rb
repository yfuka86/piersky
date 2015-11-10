class GithubComment < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  include Concerns::ActivityChild

  def self.parse(params, integration)
    {
      foreign_id: params['id'],
      body: params['body'],
      ts: params['created_at'],
      url: params['url'],
    }
  end
end