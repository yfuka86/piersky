class Api::Statistics::UserSerializer < ActiveModel::Serializer
  attributes :user_id, :today, :integrations

  def user_id
    object.id
  end

  def today
    @today ||= SkyModule.today
  end

  def integrations
    user_team = object.user_teams.find_by(team: object.current_team)
    integration_ids = user_team.identities.pluck(:integration_id).uniq
    integrations = ::Integration.where(id: integration_ids)

    integrations.map do |integration|
      q = integration.activity_class.where(identity_id: Identity.where(integration_id: integration.id, user_team_id: user_team.id).pluck(:id))
      {
        id: integration.id,
        default: SkyModule.get_day_time_series(q),
        day: SkyModule.get_hour_of_day_series(q)
      }
    end
  end
end
