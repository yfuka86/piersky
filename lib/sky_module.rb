module SkyModule
  class << self
    def today(time_zone=0)
      Time.current.in_time_zone(time_zone)
    end

    def yesterday(time_zone=0)
      today(time_zone) - 1.day
    end

    def yesterday_range(time_zone=0)
      yesterday(time_zone)..today(time_zone)
    end

    def get_day_interval(range: 28, end_at: nil, time_zone: 0, inclusive: true)
      d = end_at.present? ? end_at.in_time_zone(time_zone).to_date : today(time_zone).to_date

      (d + 1.day - range.day..(inclusive ? d + 1.day : d))
    end





    def get_day_time_series(q, range: 28, end_at: nil, reverse: true)
      inclusive = get_day_interval(range: range, end_at: end_at, time_zone: get_time_zone)
      exclusive = get_day_interval(range: range, end_at: end_at, time_zone: get_time_zone, inclusive: false)

      q = q.
          where(ts: inclusive).
          group_by_day(:ts, time_zone: get_time_zone).
          count
      list = exclusive.map{|d| q.find{|k, v| k.to_date == d}.try(:[], 1) || 0}
      reverse ? list.reverse : list
    end

    def get_hour_of_day_series(q)
      q = q.group_by_hour_of_day(:ts, time_zone: get_time_zone).count

      (0..23).map{|h| q.select{|k, v| k == h}.values.sum }
    end

    def get_hour_of_yesterday_series(q)
      q = q.where(ts: yesterday_range(get_time_zone)).group_by_hour_of_day(:ts, time_zone: get_time_zone).count
      
      (0..23).map{|h| q.select{|k, v| k == h}.values.sum }
    end

    def get_time_zone
      9
    end
  end
end
