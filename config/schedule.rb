require File.expand_path(File.dirname(__FILE__) + "/environment")
set :output, 'log/cron.log'

# 1分毎に回す
every 5.minute do
  runner "Team.send_daily_summary"
end

every 1.day, :at => '9:00 am' do
  runner "Team.send_daily_summary"
end
