class SlackTeam < ActiveRecord::Base
  def self.find_or_create(params, integration)
    team = self.find_by(foreign_id: params["id"], integration_id: integration.id)
    team = self.create(integration_id: integration.id, foreign_id: params["id"], name: params["name"], domain: params["domain"], email_domain: params["email_domain"]) unless team
    team.name = params["name"] if team.name != params["name"]
    team.save!
    team
  end
end