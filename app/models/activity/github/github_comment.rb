class GithubComment < ActiveRecord::Base
  ACTIVITY_CLASS = ActivityGithub
  include Concerns::ActivityChild

  def self.find_or_create(params, integration, activity)
    comment = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    comment ||= self.create(
                activity_id: activity.id,
                integration_id: integration.id,
                foreign_id: params["id"],
                body: params["body"],
                ts: params["created_at"],
                url: params["url"])
    comment
  end
end