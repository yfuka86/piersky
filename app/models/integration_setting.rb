class IntegrationSetting < ActiveRecord::Base
  has_many :webhooks, class_name: "::IntegrationWebhook", dependent: :destroy
  belongs_to :integration
end
