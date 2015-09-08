class Api::Integration::GithubSerializer < ActiveModel::Serializer

  attributes :synced_repositories, :syncable_repositories

  def syncable_repositories
    object.fetch_syncables
  end

  def synced_repositories
    object.webhooks.pluck(:name)
  end
end
