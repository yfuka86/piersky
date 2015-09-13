REDIS_HOST = ENV['REDIS_HOST'] || '127.0.0.1'
Redis.current = Redis.new(host: REDIS_HOST, port: 6379)
