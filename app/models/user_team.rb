class UserTeam < ActiveRecord::Base
  belongs_to :user
  belongs_to :team
  has_many :identities

  validates :user, presence: true
  validates :team, presence: true
  validates :role, presence: true

  enum role: [:owner, :administrator, :member]

  def identity
    user_name.presence || user.email
  end

  def color
    SkyModule.color_by_key(identity)
  end
end