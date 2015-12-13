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
    session.visit "#{Rails.application.config.app_domain}/graphs?team_id=#{@team.id}"
    while(session.find(:css, 'div#graph_depicted').text != 'true') do
      sleep(3)
    end
    data_uri = session.evaluate_script("document.querySelector('#graph').toDataURL('image/png', 0)")
    data = URI::Data.new(data_uri).data.force_encoding("utf-8")

    path = "#{S3_DAILY_SUMMARY_IMAGE_PATH}_#{Time.now.to_i}_#{rand(1000)}.png"
    s3 = Aws::S3::Client.new(region: AWS_REGION, credentials: Aws::Credentials.new(AWS_S3_ID, AWS_S3_KEY))
    s3.put_object(
      acl: 'public-read',
      bucket: S3_BUCKET_NAME,
      key: path,
      body: data)

    page = Nokogiri::HTML.parse(session.html)
    {
      legends: page.css('#graph_legends').to_html(),
      image: "#{S3_BUCKET_FULLPATH}/#{path}"
    }
  end
end