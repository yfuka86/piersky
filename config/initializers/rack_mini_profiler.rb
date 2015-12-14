if Rails.env.development?
  require 'rack-mini-profiler'
  alt + P で表示/非表示の切り替え
  Rack::MiniProfilerRails.initialize!(Rails.application)
  Rack::MiniProfiler.config.position = 'right'
  Rack::MiniProfiler.config.start_hidden = true
  Rack::MiniProfiler.config.toggle_shortcut = "ctrl+p"
end
