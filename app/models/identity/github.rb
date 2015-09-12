class Identity::Github < Identity

  def self.find_or_initialize_with_payload(payload, integration)
    identity = self.find_by(primary_key: payload["sender"]["id"])
    unless identity
      gh_user = integration.user_by_name(payload["sender"]["login"])
      identity = self.build_by_email(gh_user.email, integration.team)
      identity.primary_key = gh_user.id
    end
    identity
  end
end
