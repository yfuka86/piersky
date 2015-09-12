require 'connection_pool'

REDIS_HOST = ENV['REDIS_HOST'] || '127.0.0.1'
Redis::Objects.redis = ConnectionPool.new(size: 5, timeout: 5) { Redis.new(host: REDIS_HOST, port: 6379) }
