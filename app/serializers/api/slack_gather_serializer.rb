class Api::SlackGatherSerializer < ActiveModel::Serializer

  attributes :id, :title, :edited_at, :created_at

  has_many :activities

  def activities
    object.activities.active
  end

end
