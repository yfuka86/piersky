class Integration < ActiveRecord::Base
  include Concerns::UserRelatable
  belongs_to :team
  has_one :setting, class_name: "::IntegrationSetting", dependent: :destroy
  has_many :webhooks, class_name: "::IntegrationWebhook", dependent: :destroy
  has_many :identities

  after_create :create_setting!
  after_create :create_identity
  after_create :initialize_data

  validates_associated :user
  validates_associated :setting

  enum status: [:default, :syncing]

  class << self
    def create_with_user(auth, user)
      self.new(user: user, team: user.current_team).tap do |integration|
        raise ActiveRecordNotFound unless integration

        integration.assign_attributes(
          token: auth.credentials.token,
          secret: auth.credentials.secret)

        integration.save!
      end
    end

    def service_name
      self.name.split('Integration')[1]
    end

    def identity_class
      ('Identity' + service_name).constantize
    end

    def activity_class
      ('Activity' + service_name).constantize
    end
  end

  def create_identity(primary_key, options={})
    #please override
    user_team = UserTeam.find_by(user: self.user, team: self.team)
    klass = self.class.identity_class
    unless klass.find_by(user_team: user_team)
      klass.create(integration: self,
                   user_team: user_team,
                   is_verified: true,
                   primary_key: primary_key,
                   secondary_key: options[:secondary_key],
                   name: options[:name])
    end
  end

  def summary
    self.class.activity_class.summary(self)
  end

  def initialize_data
    # please override
  end

  def refresh_data
    # please override
  end

  def update_setting(setting)
    # please override
  end

  def create_external_webhook(webhook)
    # please override
  end

  def destroy_external_webhook(webhook)
    # please override
  end

  def execute_webhook(payload)
    # please override
  end
end
