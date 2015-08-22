class Integration::Github < Integration
  def update_setting(params)
    return unless project = Project.find_by_id(params.try(:[], :project_id))
    ActiveRecord::Base.transaction do
      self.setting.update_attribute(:project_id, project.id)

      if repositories = params[:repositories].map{|repository| repository[:name]}
        repositories.each do |repository|
          self.setting.webhooks.create(uid: SecureRandom.hex, name: repository) unless self.setting.webhooks.exists?(name: repository)
        end
        self.setting.webhooks.each { |webhook| webhook.destroy unless webhook.name.in?(repositories) }
      else
        self.setting.webhooks.each(&:destroy)
      end
    end
  end

  def fetch_syncables
    gh_client.repos.list.map(&:full_name)
  end

  def gh_client
    @gh_client ||= ::Github.new(oauth_token: self.token)
  end
end
