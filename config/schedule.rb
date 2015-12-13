require File.expand_path(File.dirname(__FILE__) + "/environment")
set :output, 'log/cron.log'
set :environment, :production

every 3.hour do
  runner "Integration.refresh_all_data"
end

every 1.day, :at => '8:00 am' do
  runner "Team.send_daily_summary"
end
