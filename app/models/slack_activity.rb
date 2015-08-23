class SlackActivity < ActiveRecord::Base
  has_many :slack_activity_gathers
  has_many :slack_gathers, through: :slack_activity_gathers

end
