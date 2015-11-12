#!/usr/bin/env ruby
require 'rubygems'
require 'bundler'
require 'logger'

# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment', __FILE__)
run Rails.application
