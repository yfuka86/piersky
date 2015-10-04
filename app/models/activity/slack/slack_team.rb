class SlackTeam
  include Cequel::Record
  key :integration_id, :int
  key :id, :text
  column :name, :text, index: true
  column :domain, :text
  column :email_domain, :text

  def self.find_or_create(params, intgration)
    team = self[integration.id].find_by_id(params["id"])
    team = self.create(integration_id: integration.id, id: params["id"], name: params["name"], domain: params["domain"], email_domain: params["email_domain"]) unless team
    team.name = params["name"] if team.name != params["name"]
    team.save!
    team
  end
end