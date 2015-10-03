class Identity < ActiveRecord::Base
  belongs_to :integration
  belongs_to :user_team

  def self.build_by_email(email, integration)
    user_team_id = integration.team.user_teams.joins(:user).find_by(email: email).try(:id)
    self.build(integration_id: integration.id, user_team_id: user_team_id, email_key: email)
  end
end
