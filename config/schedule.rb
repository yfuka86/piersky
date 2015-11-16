require File.expand_path(File.dirname(__FILE__) + "/environment")
set :output, 'log/cron.log'
set :environment, :production

every 1.hour do
  runner "Team.send_daily_summary"
end

every 1.day, :at => '9:00 am' do
  runner "Team.send_daily_summary"
end
