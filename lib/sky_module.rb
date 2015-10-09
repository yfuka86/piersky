module SkyModule
  class << self
    def today
      Date.today
    end

    def get_period
      (today - 31.day..today)
    end
  end
end
