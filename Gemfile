source 'http://rubygems.org'

gem 'rails',                   '3.2.2'

gem 'rake',                    '0.9.2.2'
gem 'pg',                      '0.13.2'
gem 'sequel',                  '3.42.0'
gem 'sequel_pg',               '1.6.3', require: 'sequel'

gem 'vizzuality-sequel-rails', '0.3.7', git: 'https://github.com/Vizzuality/sequel-rails.git'

gem 'rails_warden',            '0.5.2' # Auth via the Warden Rack framework
gem 'oauth',                   '0.4.5'
gem 'oauth-plugin',            '0.4.0.pre4'

gem 'redis',                   '2.2.2'
gem 'nokogiri',                '1.6.0'
gem 'statsd-client',           '0.0.7', require: 'statsd'
gem 'aws-sdk',                 '1.8.5'

# It's used in the dataimport and arcgis. Just two calls.
# It's a replacement for the ruby uri that it's supposed to
# perform better parsing of a URI
gem 'addressable',             '2.3.2', require: 'addressable/uri'

gem 'ejs',                     '~> 1.1.1'
gem 'execjs',                  '~> 0.4' # Required by ejs
gem 'therubyracer',            '0.12.1' # Required by ejs


group :production, :staging do
  gem 'unicorn',               '4.8.2'
  gem 'raindrops',             '0.12.0'
end

group :assets do
  gem "compass",               "0.12.3"
end

# Importer
gem 'roo',                     '1.13.2'
gem 'state_machine',           '1.1.2'
gem 'typhoeus',                '0.6.7'
gem 'charlock_holmes',         '0.7.2'
gem 'dbf',                     '2.0.6'

# Sync tables
gem 'faraday',                 '0.9.0'
gem 'retriable',               '1.4.1'  # google-api-client needs this
gem 'google-api-client',       '0.7.0'
gem 'dropbox-sdk',             '1.6.3'
gem 'instagram',               '1.1.3'

# Synchronizer
gem 'eventmachine',            '1.0.3'
gem 'em-pg-client',            '0.2.1'

# Service components (/services)
gem 'virtus',                   '1.0.0.beta3' #, git: 'https://github.com/solnic/virtus.git'
gem 'aequitas',                 '0.0.2'
gem 'uuidtools',                '2.1.3'

# Markdown
gem 'redcarpet', '3.1.1'

# TODO we should be able to remove this using the new
#      Rails routes DSL
gem 'bartt-ssl_requirement',   '~>1.4.0', require: 'ssl_requirement'

# TODO Production gems, put them in :production group
gem 'mixpanel',              '4.0.2'
gem 'rollbar',               '0.12.14'
gem 'resque',                '1.23.0'
gem 'resque-metrics',        '0.1.1'

group :development, :test do
  gem 'rb-readline'
  gem 'webrick',               '1.3.1'
  gem 'poltergeist',           '>= 1.0.0'
  gem 'selenium-webdriver',    '>= 2.5.0'

  gem 'mocha',                 '0.10.5'
  gem 'ci_reporter',           '1.8.4'

  gem 'debugger',              '1.6.8'

  gem 'rspec-rails',           '2.10.1'
  gem 'capybara',              '1.1.2'
  gem 'delorean'
  gem 'rack',                  '1.4.1'
  gem 'rack-test',             '0.6.2',  require: 'rack/test'
  gem 'factory_girl_rails',    '~> 4.0.0'

  # Server
  gem 'thin',                           require: false
end

# Load optional engines
# TODO activate when CartoDB plugins are finally included
# Dir['engines' + '/*/*.gemspec'].each do |gemspec_file|
#   dir_name = File.dirname(gemspec_file)
#   gem_name = File.basename(gemspec_file, File.extname(gemspec_file))
#   gem gem_name, :path => dir_name, :require => false
# end
