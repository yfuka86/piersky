class UserTeam < ActiveRecord::Base
  belongs_to :user
  belongs_to :team
  has_many :identities
  has_one :setting, class_name: 'UserTeamSetting', foreign_key: :user_team_id

  validates :user, presence: true
  validates :team, presence: true
  validates :role, presence: true

  enum role: [:owner, :administrator, :member]
end