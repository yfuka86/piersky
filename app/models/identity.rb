class Identity < ActiveRecord::Base
  belongs_to :integration
  belongs_to :user_team

  scope :by_team, -> (team) { joins(:integration).where(integrations: {team_id: team.id}) }
  scope :by_email_key, -> (email) { where(email_key: email) }
  scope :by_user, -> (user, team) { by_team(team).where(user_team_id: user.user_teams.find_by(team: team).id) }

  class << self
    def service_name
      self.name.split('Identity')[1]
    end

    def integration_class
      ('Identity' + service_name).constantize
    end

    def activity_class
      ('Activity' + service_name).constantize
    end

    def build_by_email(email, integration)
      user_team_id = integration.team.user_teams.joins(:user).find_by(users: {email: email}).try(:id)
      self.new(integration_id: integration.id, user_team_id: user_team_id, email_key: email)
    end

    def link_user_team_by_email(user_team)
      ActiveRecord::Base.transaction do
        self.by_team(user_team.team).by_email_key(user_team.user.email).all? do |i|
          i.user_team_id = user_team.id
          i.save!
        end
      end
    end
  end

  def daily_count
    self.class.activity_class.daily_count(self)
  end

  def activities
    self.class.activity_class.where(identity: self)
  end
end
