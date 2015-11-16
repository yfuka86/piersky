class ScrapeTeamDailyGraph
  def self.execute
    Capybara.register_driver :poltergeist do |app|
      Capybara::Poltergeist::Driver.new(app, {js_errors: false, timeout: 1000})
    end
    Capybara.default_selector = :xpath
    session = Capybara::Session.new(:poltergeist)
    session.driver.headers = { 'User-Agent' => "Mozilla/5.0 (Macintosh; Intel Mac OS X)" }
    session.visit "https://www.piersky.com/graphs"
    page = Nokogiri::HTML.parse(session.html)
  end
end