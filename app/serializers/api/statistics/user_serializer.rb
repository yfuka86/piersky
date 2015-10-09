class Api::Statistics::UserSerializer < ActiveModel::Serializer
  attributes :user_id, :today, :integrations

  def user_id
    object.id
  end

  def today
    @today ||= SkyModule.today
  end

  def integrations
    period = SkyModule.get_period
    user_team = UserTeam.find_by(user: object, team: user.current_team)
    identity_ids = user_team.identities.pluck(:integration_id).uniq
    integrations = Integration.where(id: identity_ids)

    integrations.map do |integration|
      counts = integration.activity_class.where(identity_id: identity_ids, ts: period).group("date_trunc('day',ts)").count
      {
        id: integration.id
        default: period.map{|d| counts.select{|k, v| k == d}.values.sum }.reverse
      }
    end
  end
end
