class Integration::Github < Integration
  require_dependency 'activity/github'

  def create_identity
    super(gh_client.users.get.id)
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
    Activity::Github.create_with_webhook(payload, webhook)
  end

  private

  def gh_client
    @gh_client ||= ::Github.new(oauth_token: self.token)
  end
end
