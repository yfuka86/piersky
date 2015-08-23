class Api::SlackActivitySerializer < ActiveModel::Serializer

  attributes :id, :ts, :channel, :edited_at, :created_at
end
