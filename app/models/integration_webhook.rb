class IntegrationWebhook < ActiveRecord::Base
  WEBHOOK_HOST = Rails.env.development? ? ENV["PIERSKY_WEBHOOK_HOST"] : "https://www.piersky.com/"
  belongs_to :integration

  after_create do |webhook|
    webhook.integration.create_external_webhook(webhook)
  end

  after_destroy do |webhook|
    next unless webhook.external_uid
    webhook.integration.destroy_external_webhook(webhook)
  end

  def execute(payload)
    self.integration.execute_webhook(payload, self)
  end

  def webhook_url
    WEBHOOK_HOST + "integrations/#{integration.team.id}/#{self.uid}"
  end
end
