class Api::Statistics::TeamSerializer < ActiveModel::Serializer
  attributes :today, :activities

  def today
    @today ||= SkyModule.today
  end

  def activities
    integrations = object.integrations
    qs = integrations.map{|i| i.class.activity_class.where(identity_id: i.identities.pluck(:id))}
    {
      day: qs.map{|q| q.where(ts: (1.day.ago..DateTime.now)).count}.sum,
      week: qs.map{|q| q.where(ts: (7.day.ago..DateTime.now)).count}.sum,
      month: qs.map{|q| q.where(ts: (31.day.ago..DateTime.now)).count}.sum
    }
  end
end
