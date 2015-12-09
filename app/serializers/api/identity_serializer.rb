class Api::IdentitySerializer < ActiveModel::Serializer
  attributes :id, :user_id, :type, :primary_key, :secondary_key, :is_verified, :name, :integration_id

  def user_id
    object.try(:user_team).try(:user_id)
  end
end
