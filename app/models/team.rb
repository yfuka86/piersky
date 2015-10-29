class Team < ActiveRecord::Base
  has_many :user_teams, dependent: :destroy
  has_many :users, through: :user_teams

  has_many :invitations, dependent: :destroy
  has_many :integrations, dependent: :destroy

  scope :by_user, ->(user) { by_user_id(user.id) }
  scope :by_user_id, ->(user_id) { joins(:user_teams).where('user_teams.user_id = ?', user_id) }

  def self.setup(user, params={})
    team = self.new(params)
    team.users << user
    team.save!
  end
end
