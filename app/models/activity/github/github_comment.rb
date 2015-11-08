class GithubComment < ActiveRecord::Base
  # include Cequel::Record
  # key :id, :int
  # key :ts, :timestamp
  # column :integration_id, :int, index: true
  # column :body, :text
  # column :url, :text

  belongs_to :activity_githubs, class_name: 'ActivityGithub'

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