class Api::Statistics::SlackSerializer < ActiveModel::Serializer
  attributes :integration_id

  def integration_id
    object.id
  end
end
