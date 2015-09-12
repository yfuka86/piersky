PierSky ver2

# keep going

    cp config/database.yml.shared config/database.yml

    # config database.yml...

    bin/bundle  install --path=vendor/bundle
    bin/rake db:build (テストユーザー　test@piersky.com, test1@piersky.com, test2@piersky.com  pass: testtest)
    npm install

    bin/rails s

    To build js
    npm run-script build

    When develop around js
    npm run-script watch

    When following error occured,
    > piersky@ build /Volumes/work/piersky
    > browserify app/assets/javascripts/src/application.js -t babelify --extension=".js.jsx" -o app/assets/javascripts/dist/application.js

    Error: EMFILE, open '/Volumes/work/piersky/node_modules/react/package.json'
    npm ERR! weird error 1
    npm ERR! not ok code 0

    please exec following command
    ulimit -n 2560

    put export PIERSKY_MAIL_PASSWORD=[ask someone] in settingfile

# How to develop `Integration`

    $ brew install ngrok
    $ ngrok 3000

    or

    $ gem install ultrahook
    $ ultrahook stripe 3000
    (should go http://www.ultrahook.com/ and set info)
    put export PIERSKY_WEBHOOK_HOST=Forwarding url in settingfile

