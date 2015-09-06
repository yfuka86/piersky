class Identity < ActiveRecord::Base
  belongs_to :user_team
  has_many :activities
end
