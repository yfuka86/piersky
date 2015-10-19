module SkyModule
  class << self
    def today(timezone=0)
      Time.current.in_time_zone(timezone).to_date
    end

    def get_day_interval(range: 31, end_at: nil, timezone: 0, inclusive: true)
      d = end_at.present? ? end_at.in_time_zone(timezone).to_date : today(timezone)

      (d - range.day..(inclusive ? d + 1.day : d))
    end

    # for postgres
    def count_of_group_by_day(query, timezone=0)
      offset = timezone_to_offset(timezone)
      query.group("(date_trunc('day', ts) +
                    case when (date_part('hour', ts) + #{offset}) >= 24 then interval '1 day' else interval '0 day' end -
                    case when (date_part('hour', ts) + #{offset}) < 0 then interval '1 day' else interval '0 day' end)").count
    end

    def get_time_series_by_day(query, timezone=0)
    end

  private
    def timezone_to_offset(timezone)
      if timezone.is_a?(Numeric)
        timezone
      else
        Time.current.in_time_zone(timezone).utc_offset / 3600.0
      end
    end
  end
end
