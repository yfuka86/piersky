class IntegrationWebhook < ActiveRecord::Base
end
class IntegrationWebhook < ActiveRecord::Base
  WEBHOOK_HOST = Rails.env.development? ? ENV["PIERSKY_WEBHOOK_HOST"] : "http://hooks-old.piersky.com/"
  belongs_to :integration_setting

  def integration
    integration_setting.integration
  end

  def project
    integration_setting.project
  end

  after_create do |webhook|
    # https://developer.github.com/webhooks/#events
    webhook.integration.gh_client.repos.hooks.create *webhook.name.split('/'), {
      name:  'web',
      active: true,
      events: [:issues, :pull_request],
      config: { url: webhook.webhook_url }
    }
  end

  after_destroy do |webhook|
    next unless webhook.external_uid
    begin
      webhook.integration.gh_client.repos.hooks.delete *webhook.name.split('/'), webhook.external_uid
    rescue Github::Error::NotFound
    end
  end

  def execute(payload)
    case self.integration
    when Integration::Github
      # https://developer.github.com/v3/activity/events/types/
      if payload["zen"].present?
        self.update_attribute(:external_uid, payload["hook_id"])
      elsif payload["action"] == "opened"
        issue_params = payload["issue"] || payload["pull_request"]
        self.project.tasks.build.tap do |new_task|
          new_task.assign_with_user(self.integration.user, {
            title: issue_params["title"],
            origin: :github
            })
          new_task.save!
          send_to_socket(new_task)
        end
      end
    end
  end

  def send_to_socket(task)
    conn = Faraday.new(url: WEB_SOCKET_ROOT) do |faraday|
      faraday.request  :url_encoded
      faraday.response :logger
      faraday.adapter  Faraday.default_adapter
    end

    project = task.project
    team = project.team

    conn.post do |req|
      req.url '/webhook'
      req.headers['Content-Type'] = 'application/json'
      req.body = {
        team_id: team.external_cid,
        project_id: project.id,
        task: Api::TaskSerializer.new(task, root: nil)
      }.to_json
    end
  end

  def webhook_url
    WEBHOOK_HOST + "integrations/#{self.integration.team.external_cid}/#{self.uid}"
  end

end
