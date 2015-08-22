class Activity < ActiveRecord::Base
  belongs_to :identity
  belongs_to :integration
end
