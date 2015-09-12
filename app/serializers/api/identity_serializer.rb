class Api::IdentitySerializer < ActiveModel::Serializer
  attributes :id, :user_id, :type, :primary_key, :secondary_key, :is_verified

  def user_id
    object.user_team.user_id
  end
end
