class Integration < ActiveRecord::Base
  include Concerns::UserRelatable
  belongs_to :team
  has_one :setting, class_name: "::IntegrationSetting", dependent: :destroy
  has_many :activities

  after_create :create_setting!
  after_create :create_identity

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

  def create_identity(key)
    user_team = UserTeam.find_by(user: self.user, team: self.team)
    binding.pry
    klass = ('Identity::' + self.class.name.split('::')[1]).constantize
    klass.create(user_team: user_team, is_verified: true, primary_key: key)
  end

  def update_setting(setting)
    # please override
  end
end
