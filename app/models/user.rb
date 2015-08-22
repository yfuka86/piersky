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
end
