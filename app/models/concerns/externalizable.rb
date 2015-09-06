module Concerns::Externalizable
  extend ActiveSupport::Concern

  included do
  end

  # ユーザーに一意の文字列を返します
  # ユーザーを一意に指定したいけどidそのものは見せたくない場合などに使います。
  #
  # @overload external_cid
  # @param [Hash] option リセットするかなどのオプション
  # @option option [TrueClass | FalseClass] :reset trueなら新たに数値を計算して保存して返します
  def external_cid(option = {})
    return nil unless self.id

    if read_attribute(:external_cid) && !option[:reset]
      return self.read_attribute(:external_cid)
    end

    update_attribute(:external_cid, calc_external_cid)

    read_attribute(:external_cid)
  end

  private

  def calc_external_cid
    cid = ((33_288_177 * (self.id % 89) + self.id) % 100_000_000).to_s.rjust(8, '0').split(//).rotate(5)
    even_digit_sum = cid.values_at(*cid.each_index.select(&:even?)).sum(&:to_i)
    odd_digit_sum = cid.values_at(*cid.each_index.select(&:odd?)).sum(&:to_i)
    check_digit_1 = (even_digit_sum * 11 + odd_digit_sum * 13) % 10
    check_digit_2 = (even_digit_sum * 31 + odd_digit_sum * 19) % 10
    cid.insert(4, check_digit_1.to_s)
    cid.insert(-1, check_digit_2.to_s)
    cid.join
  end
end
