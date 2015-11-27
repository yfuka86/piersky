module SkyModule
  class << self
    def now(time_zone=get_time_zone)
      Time.current.in_time_zone(time_zone)
    end

    def today(time_zone=get_time_zone)
      now(time_zone).to_date
    end

    def yesterday(time_zone=get_time_zone)
      today(time_zone) - 1.day
    end

    def yesterday_range(time_zone=get_time_zone)
      yesterday(time_zone)..today(time_zone)
    end

    def get_day_interval(range: 28, end_at: nil, time_zone: get_time_zone, inclusive: true)
      d = end_at.present? ? end_at.in_time_zone(time_zone).to_date : today(time_zone)

      (d + 1.day - range.day..(inclusive ? d + 1.day : d))
    end



    def get_day_time_group(q, range: 28, end_at: nil, reverse: true, column: :ts)
      inclusive_interval = get_day_interval(range: range, end_at: end_at, time_zone: get_time_zone)

      q.where(column => inclusive_interval).
        group_by_day(column, time_zone: get_time_zone).
        count
    end

    def get_day_time_series(q, range: 28, end_at: nil, reverse: true, column: :ts)
      exclusive_interval = get_day_interval(range: range, end_at: end_at, time_zone: get_time_zone, inclusive: false)

      q = get_day_time_group(q, range: range, end_at: end_at, reverse: reverse, column: column)
      list = exclusive_interval.map{|d| q.find{|k, v| k.to_date == d}.try(:[], 1) || 0}
      reverse ? list.reverse : list
    end

    def get_hour_of_day_series(q, column: :ts)
      q = q.group_by_hour_of_day(column, time_zone: get_time_zone).count

      (0..23).map{|h| q.select{|k, v| k == h}.values.sum }
    end

    def get_hour_of_yesterday_series(q, column: :ts)
      q = q.where(ts: yesterday_range(get_time_zone)).group_by_hour_of_day(column, time_zone: get_time_zone).count

      (0..23).map{|h| q.select{|k, v| k == h}.values.sum }
    end

    def get_time_zone
      9
    end




    COLORS = [:red, :pink, :purple, :deeppurple, :indigo, :blue, :lightblue, :cyan, :teal, :green,
              :lightgreen, :lime, :yellow, :amber, :orange, :deeporange, :brown, :bluegrey, :grey]

    COLOR_HEXES = {red: '#ef5350', pink: '#ec407a', purple: '#ab47bc', deeppurple: '#7e57c2', indigo: '#5c6bc0',
                   blue: '#42a5f5', lightblue: '#29b6f6', cyan: '#26c6da', teal: '#26a69a', green: '#66bb6a',
                   lightgreen: '#9ccc65', lime: '#d4e157', yellow: '#ffee58', amber: '#ffca28', orange: '#ffa726',
                   deeporange: '#ff7043', brown: '#8d6e63', bluegrey: '#78909c', grey: '#bdbdbd', identity: '1976d2'}

    def random_color
      COLORS[rand(COLORS.length)]
    end

    def color_by_key(key)
      sum = 0
      key.each_byte{|c| sum += c}
      COLORS[sum % COLORS.length]
    end

    def color_hex_by_key(key)
      COLOR_HEXES[color_by_key(key).to_sym]
    end
  end
end
