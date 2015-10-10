module SkyModule
  class << self
    def today
      Date.today
    end

    def get_period
      (today - 30.day..today + 1.day)
    end
  end
end
