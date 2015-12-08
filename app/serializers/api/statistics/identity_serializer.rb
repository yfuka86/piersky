class Api::Statistics::IdentitySerializer < ActiveModel::Serializer
  attributes :count, :summary

  def count

  end

  def summary
    {
      sentence: I18n.t(
        v[:sentence],
        {count: v[:count][identity.id]}.merge(v[:options] || {})
      ),
      # contentはここで使ってる
      contents: v[:query].where(identity_id: identity.id).order(ts: :desc).limit(5).reverse.map(&:content)
    }
  end
end
