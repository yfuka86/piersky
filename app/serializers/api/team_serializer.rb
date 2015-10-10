class Api::TeamSerializer < ActiveModel::Serializer

  attributes :id, :name, :users, :summary

  def users
    if options[:detail_required]
      object.users.map do |user|
        Api::UserSerializer.new(user, team: object, root: nil)
      end
    else
      nil
    end
  end

  def summary
    options[:detail_required] ? Api::Statistics::TeamSerializer.new(object, root: nil) : nil
  end
end
