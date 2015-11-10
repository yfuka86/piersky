class Api::IntegrationSerializer < ActiveModel::Serializer
  attributes :id, :type, :user_id, :created_at, :label, :details, :status, :summary

  def type
    object.type.split('Integration')[1]
  end

  def details
    if options[:detail_required]
      klass = "Api::Integration::#{object.class.service_name}Serializer".constantize
      klass.new(object, root: nil)
    else
      nil
    end
  end

  def summary
    object.summary
  end
end
