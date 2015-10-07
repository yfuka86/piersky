class Api::IntegrationSerializer < ActiveModel::Serializer
  attributes :id, :type, :user_id, :created_at, :label, :details, :status

  def type
    object.type.split('Integration')[1]
  end

  def details
    if options[:detail_required]
      klass = "Api::Integration::#{object.type.split('Integration')[1]}Serializer".constantize
      klass.new(object, root: nil)
    else
      nil
    end
  end
end
