class Api::TeamSerializer < ActiveModel::Serializer

  attributes :id, :name, :users

  def users
    if options[:detail_required]
      object.users.map do |user|
        Api::UserSerializer.new(user, team: object, root: nil)
      end
    else
      nil
    end
  end
end
