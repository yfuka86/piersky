class SlackChannel
  include Cequel::Record
  key :id, :int

  def self.find_or_create(params)
  end
end