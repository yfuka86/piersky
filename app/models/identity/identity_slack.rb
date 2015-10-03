class IdentitySlack < Identity
  def self.find_or_initialize_with_id(id, integration)
    identity = self.find_by(primary_key: id)
    unless identity
      info = integration.user_info(id)
      identity = self.build_by_email(info["profile"]["email"], integration)
      identity.primary_key = info["id"]
      identity.name = info["name"]
      identity.save!
    end
    identity
  end
end
