class IdentityGithub < Identity
  class << self
    def find_or_initialize_with_payload(payload, integration)
      identity = self.find_by(integration_id: integration.id, primary_key: payload["sender"]["id"])
      unless identity
        gh_user = integration.user_by_name(payload["sender"]["login"])
        identity = self.build_by_email(gh_user.email, integration)
        identity.primary_key = gh_user.id
        identity.name = payload["sender"]["login"]
      end
      identity.set_author_name
      identity
    end
  end

  # set name (author name) as secondary key
  def set_author_name
    self.secondary_key = self.integration.gh_client.users.get(self.primary_key).name
  end
end
