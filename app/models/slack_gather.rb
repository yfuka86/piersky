class SlackGather < ActiveRecord::Base
  has_many :slack_activity_gathers
  has_many :slack_activities, through: :slack_activity_gathers
end
