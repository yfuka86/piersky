class Identity < ActiveRecord::Base
  belongs_to :team
  belongs_to :user_team

  def self.build_by_email(email, team)
    user_team_id = team.user_teams.joins(:user).find_by(email: email).try(:id)
    self.build(team: team, user_team_id: user_team_id, email_key: email)
  end
end
