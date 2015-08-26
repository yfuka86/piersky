class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable

  has_many :user_teams
  has_many :teams, through: :user_teams
  has_many :identities
  has_many :integrations
  has_many :invitations_sent, foreign_key: "inviter_id", class_name: "Invitation"
  has_many :invitations_received, foreign_key: "invitee_id", class_name: "Invitation"

  after_create :create_or_set_team

  def current_team
    if team = user_teams.find_by(is_logging_in: true).try(:team)
      team
    else
      team = teams.order(id: :asc).first
      team.user_teams.find_by(user_id: self.id).update_attribute(:is_logging_in, true)
      team
    end
  end

  def create_or_set_team
    if invitations_received.exists?
      UserTeam.create(team: invitations_received.first.team, user: self)
    else
      Team.setup(self)
    end
  end
end
