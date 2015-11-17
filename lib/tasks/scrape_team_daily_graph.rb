require 'capybara/poltergeist'

class ScrapeTeamDailyGraph
  def initialize(team)
    @team = team
  end

  def execute
    Capybara.default_max_wait_time = 20
    Capybara.register_driver :poltergeist do |app|
      Capybara::Poltergeist::Driver.new(app, {js_errors: true, timeout: 1000})
    end
    Capybara.default_selector = :xpath
    session = Capybara::Session.new(:poltergeist)

    session.driver.headers = { 'User-Agent' => "Mozilla/5.0 (Macintosh; Intel Mac OS X)" }
    session.visit "#{Rails.application.config.app_domain}/graphs?team_id=#{@team.id}"
    session.find_by_id('graph_image_url').text
  end
end