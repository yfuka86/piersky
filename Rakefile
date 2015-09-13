# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

namespace :db do
  desc "build database (migrate, seed)"
  task :build => [:migrate, :seed] do |t|
  end
end

namespace :tmp do
  namespace :sqls do
    # desc "Clears all files in tmp/sqls"
    task :clear do
      FileUtils.rm(Dir[Rails.root.join('tmp/sqls/[^.]*')])
    end
  end
end

Rails.application.load_tasks
