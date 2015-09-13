source 'https://rubygems.org'
ruby "2.2.0"

gem 'rails', '4.2.3'

gem 'active_model_serializers', '0.8.3'
gem 'kaminari'

gem 'mysql2'
gem 'pg', group: :production
gem 'arproxy', '0.2.0'

gem 'sdoc', '~> 0.4.0', group: :doc

gem 'devise', '~> 3.4.1'

# for integrations
gem 'faraday', '0.9.1'
gem 'omniauth'

gem 'omniauth-github'
gem "github_api"
gem 'omniauth-slack'
gem 'slack-api'
gem 'omniauth-wunderlist'
gem 'wunderlist-api'

# go international
gem 'i18n'
gem "i18n-js"

# for monitoring
gem 'newrelic_rpm'
gem 'exception_notification', '4.1.1'
gem 'slack-notifier'

# for heroku
gem 'rails_12factor', group: :production

gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'turbolinks'

gem 'rack-cors', :require => 'rack/cors'

# for mail
gem 'roadie-rails'
gem 'mail_view', :git => 'https://github.com/basecamp/mail_view.git'

# to db:build in production
gem 'faker'

group :development, :test do
  gem 'rspec-rails', '~> 2.14.2'
  gem 'factory_girl_rails', '~> 4.4.1'
  # for tracking performance
  gem 'rack-mini-profiler', require: false

  # for DEBUG
  gem 'pry'
  gem 'pry-remote'
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'byebug'
  gem 'web-console', '~> 2.0'
  gem 'http-dump'
end

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
