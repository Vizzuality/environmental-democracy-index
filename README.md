Requirements
------------

* [Node Js 0.10+](http://nodejs.org/download/)
* [PHP 5.4+](http://www.php.net//manual/es/install.php)
* [Ruby 1.9.3+](https://www.ruby-lang.org/en/downloads/)
* [MySQL 5.5+](http://dev.mysql.com/doc/refman/5.5/en/installing.html)
* [Drush](https://drupal.org/node/1791676)

Install global dependencies

    npm install -g bower grunt-cli
    gem install bundler


To start
--------

Duplicate and rename `sites/default/default.settings.php` to `sites/default/settings.php` and change database data, at project root execute:

    cp sites/default/default.settings.php sites/default/settings.php

Around line 213: (This is an example for local settings. Configure it with your enviroment)

    $databases = array (
      'default' =>
      array (
        'default' =>
        array (
          'database' => 'edi',
          'username' => 'root',
          'password' => 'root',
          'host' => '127.0.0.1',
          'port' => '',
          'driver' => 'mysql',
          'prefix' => '',
        ),
      ),
    );

Duplicate drush file running:
    
    cp sites/all/drush/edi.aliases.drushrc.php.sample sites/all/drush/edi.aliases.drushrc.php

At project's root execute follow lines ti give directory permissions:
    
    chmod 777 sites/default/files
    chmod 777 sites/default/private

Development
-----------

Install front-end dependencies
    
    bundle install
    npm install -d
    bower install

To compile styles

    grunt sass

To verify JS files and testing

    grunt test

To watch changes on files and compile assets, usefull to change styles and jshint

    grunt watch




  
