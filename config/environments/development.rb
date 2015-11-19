Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # General Settings
  config.app_domain = 'http://localhost:3000'

  # Email Settings
  config.action_mailer.default_url_options = {host: config.app_domain}#, protocol: "https"}
  config.action_mailer.default(from: "mail@piersky.com")
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true

  config.action_mailer.smtp_settings = {
    enable_starttls_auto: true,
    address: 'smtp.gmail.com',
    port: '587',
    domain: 'smtp.gmail.com',
    authentication: :plain,
    user_name: 'mail@piersky.com',
    password: 'ykSreiPykSreiP'
  }

  config.active_job.queue_adapter = :inline
end

Piersky::Application.config.middleware.use ExceptionNotification::Rack,
  email: {
    email_prefix: '[dev][piersky][error] ',
    sender_address: %{"PierSky Error" <mail@piersky.com>},
    exception_recipients: %w{yuta@piersky.com},
    smtp_settings: {
      enable_starttls_auto: true,
      address: 'smtp.gmail.com',
      port: '587',
      domain: 'smtp.gmail.com',
      authentication: :plain,
      user_name: 'mail@piersky.com',
      password: 'ykSreiPykSreiP'
    }
  }

# initialize omniauth constants before
OMNIAUTH = HashWithIndifferentAccess.new(YAML.load_file("#{Rails.root}/config/omniauth_development.yml"))

Rails.application.config.middleware.use OmniAuth::Builder do
  OMNIAUTH.each do |provider_name, info|
    provider provider_name, info[:key], info[:secret], info[:opts]
  end
end

