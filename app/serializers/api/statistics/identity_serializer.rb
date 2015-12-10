class Api::Statistics::IdentitySerializer < ActiveModel::Serializer
  attributes :id, :range, :count, :contents

  def range
    options[:range_length]
  end

  def count
    summary[:count]
  end

  def contents
    summary.map do |k, v|
      if v.is_a?(Hash) && v[:count].to_i > 0
        {
          sentence: I18n.t(v[:sentence], {count: v[:count]}.merge(v[:options] || {})),
          # contentはここで使ってる
          contents: v[:query].order(ts: :desc).limit(options[:each_limit]).map(&:content)
        }
      else
        nil
      end
    end.compact
  end

  private

  def summary
    @summary ||= object.class.activity_class.identity_summary(object, options[:range])
  end
end
