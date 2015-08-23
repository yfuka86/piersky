class Api::IntegrationSerializer < ActiveModel::Serializer

  attributes :id, :type, :user, :created_at

  def user
    Api::UserSerializer.new(object.user, root: nil)
  end
end
