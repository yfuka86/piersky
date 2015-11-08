class IntegrationGithub < Integration
  def create_identity
    user = gh_client.users.get
    super(user.id, {name: user.login})
  end

  def update_setting(params)
    return if !params || !params[:repositories]
    ActiveRecord::Base.transaction do
      if repositories = params[:repositories].map{|repository| repository[:name]}
        repositories.each do |repository|
          self.webhooks.create(uid: SecureRandom.hex, name: repository) unless self.webhooks.exists?(name: repository)
        end
        self.webhooks.each { |webhook| webhook.destroy unless webhook.name.in?(repositories) }
      else
        self.webhooks.each(&:destroy)
      end
    end
  end

  def initialize_data
    self.syncing!
    Rails.configuration.active_job.queue_adapter = :sidekiq
    GithubJob.perform_later(self.id)
  end

  def refresh_data
    GithubJob.perform_later(self.id)
  end

  def fetch_syncables
    gh_client.repos.list.map(&:full_name)
  end

  def pull_requests
    gh_client.pull_requests
  end

  def user_by_name(name)
    gh_client.users.get(user: name)
  end

  def create_external_webhook(webhook)
    gh_client.repos.hooks.create *webhook.name.split('/'), {
      name:  'web',
      active: true,
      events: [:*],
      config: { url: webhook.webhook_url }
    }
  end

  def destroy_external_webhook(webhook)
    gh_client.repos.hooks.delete *webhook.name.split('/'), webhook.external_uid
  rescue ::Github::Error::NotFound
  end

  def execute_webhook(payload, webhook)
    if payload["zen"].present?
      webhook.update_attribute(:external_uid, payload["hook_id"])
    end
    ActivityGithub.create_with_webhook(payload, webhook)
  end

  def activities
    ActivityGithub[self.id]
  end

  def gh_client
    @gh_client ||= ::Github.new(oauth_token: self.token)
  end
end
