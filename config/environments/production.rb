Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true
  config.serve_static_files = false

  class NoCompression
    def compress(string)
      # do nothing
      string
    end
  end
  config.assets.js_compressor = Uglifier.new(:mangle => false)

  config.assets.digest = true

  config.log_level = :info
  config.logger = Logger.new("log/production.log", 5, 10 * 1024 * 1024)
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.log_formatter = ::Logger::Formatter.new

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # General Settings
  config.app_domain = 'https://www.piersky.com'

  # Email Settings
  config.action_mailer.default_url_options = {host: config.app_domain, protocol: "https"}
  config.action_mailer.default(from: "mail@piersky.com")
  config.action_mailer.perform_deliveries = true
  config.action_mailer.delivery_method = :smtp
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
  # config.action_mailer.delivery_method = :ses
  # config.action_mailer.raise_delivery_errors = true
  # config.action_mailer.smtp_settings = {
  #   enable_starttls_auto: true,
  #   address: 'email-smtp.us-west-2.amazonaws.com',
  #   port: 465,
  #   domain: 'piersky.com',
  #   authentication: 'login',
  #   user_name: 'AKIAJLQQTFP6VFWQR4WA',
  #   password: 'At0w9LC0aYyFnrzCkqkbt5mY8rW07YxCmHWl/8a/G0K8',
  #   ssl: true,
  #   tls: true
  # }

  config.active_job.queue_adapter = :sidekiq
end

Piersky::Application.config.middleware.use ExceptionNotification::Rack,
  email: {
    email_prefix: '[piersky][error] ',
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
OMNIAUTH = HashWithIndifferentAccess.new(YAML.load_file("#{Rails.root}/config/omniauth_production.yml"))

Rails.application.config.middleware.use OmniAuth::Builder do
  configure do |config|
    config.full_host = 'https://www.piersky.com'
  end

  OMNIAUTH.each do |provider_name, info|
    provider provider_name, info[:key], info[:secret], info[:opts]
  end
end
