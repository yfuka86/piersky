class IntegrationWebhook < ActiveRecord::Base
  WEBHOOK_HOST = Rails.env.development? ? ENV["PIERSKY_WEBHOOK_HOST"] : "http://hooks-old.piersky.com/"
  belongs_to :integration_setting

  def integration
    integration_setting.integration
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
        # ここに連携の処理
      end
    end
  end

  def webhook_url
    WEBHOOK_HOST + "integrations/#{self.integration.team.external_cid}/#{self.uid}"
  end

end
