PierSky ver2

# setup

before setup

    brew install node

    brew install postgresql
    (http://qiita.com/_daisuke/items/13996621cf51f835494b)
    (postgres -D /usr/local/var/postgres)
    createuser piersky
    createdb piersky_development -O piersky

    brew install cassandra
    (if you don't have java, install it and alias it)
    cassandra -f

setup

    git clone git@github.com:yfuka86/piersky.git
    cp config/database.yml.shared config/database.yml
    # config database.yml...


    bin/bundle install --path=vendor/bundle
    bin/rake db:build
    bin/rake cequel:keyspace:create
    bin/rake cequel:migrate
    npm install

    bin/rails s

# to develop js

    build:
    npm run-script build
    watch:
    npm run-script watch

When following error occured,

    > piersky@ build /Volumes/work/piersky
    > browserify app/assets/javascripts/src/application.js -t babelify --extension=".js.jsx" -o app/assets/javascripts/dist/application.js

    Error: EMFILE, open '/Volumes/work/piersky/node_modules/react/package.json'
    npm ERR! weird error 1
    npm ERR! not ok code 0

please exec following command

    ulimit -n 2560

# How to develop `Integration`

    brew install ngrok
    ngrok 3000

    or

    $ gem install ultrahook
    $ ultrahook stripe 3000
    (should go http://www.ultrahook.com/ and set info)
    put export PIERSKY_WEBHOOK_HOST=Forwarding url in settingfile
