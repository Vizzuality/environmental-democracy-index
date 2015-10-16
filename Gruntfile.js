'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    root: 'sites/all/themes/edi',

    clean: {
      app: ['<%= root %>/styles']
    },

    jshint: {
      files: [
        'Gruntfile.js',
        '<%= root %>/scripts/{,*/}{,*/}*.js',
        '!<%= root %>/scripts/*compiled.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    requirejs: {
      options: {
        preserveLicenseComments: false,
        useStrict: true,
        wrap: false
      },
      compile: {
        options: {
          baseUrl: '<%= root %>/scripts',
          mainConfigFile: '<%= root %>/scripts/main.js',
          include: 'main',
          name: '../vendor/almond/almond',
          out: '<%= root %>/scripts/main_compiled.js'
        }
      }
    },

    sass: {
      options: {
        style: 'expanded'
      },
      app: {
        files: {
          '<%= root %>/styles/main.css': '<%= root %>/sass/main.scss'
        }
      }
    },

    scsslint: {
      allFiles: [
        '<%= root %>/sass/{,*/}*{,*/}*.scss'
      ],
      options: {
        bundleExec: true,
        config: '.scss-lint.yml',
        colorizeOutput: true
      },
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      build: {
        src: '<%= root %>/styles/main.css',
        dest: '<%= root %>/styles/main.css'
      },
    },

    watch: {
      options: {
        nospawn: true
      },
      scripts: {
      files: ['<%= root %>/scripts/{,*/}*{,*/}*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: ['<%= root %>/sass/{,*/}*{,*/}*.scss'],
        tasks: ['sass']
      }
    }

  });

  grunt.registerTask('test', [
    'jshint',
    'scsslint'
  ]);

  grunt.registerTask('default', [
    'clean',
    'sass'
  ]);

  grunt.registerTask('build', [
    'clean',
    'sass',
    'requirejs',
    'autoprefixer'
  ]);
};
