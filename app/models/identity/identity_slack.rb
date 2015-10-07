class IdentitySlack < Identity
  def self.find_or_initialize_with_id(id, integration)
    identity = self.find_by(integration_id: integration.id, primary_key: id)
    unless identity
      if another_identity = self.find_by(primary_key: id)
        identity = self.new(integration_id: integration.id)
        identity.attributes = another_identity
                              .attributes
                              .reject{|k, v| k.to_sym.in?([:id, :integration_id, :created_at, :updated_at]) }
      else
        info = integration.user_info(id)
        identity = self.build_by_email(info["profile"]["email"], integration)
        identity.primary_key = info["id"]
        identity.name = info["name"]
      end
    end
    identity
  end
end
