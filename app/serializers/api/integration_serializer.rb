class Api::IntegrationSerializer < ActiveModel::Serializer
  attributes :id, :type, :user_id, :created_at, :label, :details

  def details
    if options[:detail_required]
      klass = "Api::#{object.type}Serializer".constantize
      klass.new(object, root: nil)
    else
      nil
    end
  end
end
