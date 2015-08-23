class SlackActivityGather < ActiveRecord::Base
  belongs_to :slack_activity
  belongs_to :slack_gather
end
