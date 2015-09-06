class Api::IntegrationSerializer < ActiveModel::Serializer
  attributes :id, :type, :user_id, :created_at
end
