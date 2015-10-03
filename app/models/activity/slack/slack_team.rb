class SlackTeam
  include Cequel::Record
  key :id, :int
  column :name, :text, index: true
  column :domain, :text
  column :email_domain, :text

  def self.find_or_create(params)
    team = self[params["id"]]
    team = self.create(id: params["id"], name: params["name"], domain: params["domain"], email_domain: params["email_domain"]) unless team
    team.name = params["name"] if team.name != params["name"]
    team.save!
    team
  end
end