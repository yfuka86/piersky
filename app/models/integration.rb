class Integration < ActiveRecord::Base
  include Concerns::UserRelatable
  belongs_to :team

  has_one :setting, class_name: "::IntegrationSetting", dependent: :destroy
  after_create :create_setting!

  validates_associated :user
  validates_associated :setting

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
  end

  def update_setting(setting)
    # please override
  end
end
