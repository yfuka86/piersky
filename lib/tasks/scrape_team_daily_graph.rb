require 'capybara/poltergeist'

class ScrapeTeamDailyGraph
  def initialize(team)
    @team = team
  end

  def execute
    Capybara.default_max_wait_time = 20
    Capybara.register_driver :poltergeist do |app|
      Capybara::Poltergeist::Driver.new(app,
        {
          js_errors: false,
          timeout: 1000,
          phantomjs_options: ['--debug=no', '--load-images=no', '--ignore-ssl-errors=yes', '--ssl-protocol=TLSv1'],
          debug: false
          })
    end
    Capybara.default_selector = :xpath
    session = Capybara::Session.new(:poltergeist)

    session.driver.headers = { 'User-Agent' => "Mozilla/5.0 (Macintosh; Intel Mac OS X)" }
    session.visit "https://developers.google.com/chart/interactive/docs/lines"#{Rails.application.config.app_domain}/graphs?team_id=#{@team.id}"
    sleep 5
    session.save_screenshot('debug.png', full: true)
    session.find_by_id('graph_image_url').text
  end
end