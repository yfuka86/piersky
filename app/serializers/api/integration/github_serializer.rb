class Api::Integration::GithubSerializer < ActiveModel::Serializer

  attributes :syncable_repositories, :repositories

  def syncable_repositories
    object.fetch_syncables
  end

  def repositories
    object.webhooks.pluck(:name)
  end
end
