class Log < ActiveRecord::Base
  enum code: [:mail]
end
