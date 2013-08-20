var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // We have lots of watchers
  grunt.event.setMaxListeners(50);

  // Load our environment specific settings
  grunt.settings = grunt.file.readJSON('user-settings.json');

  grunt.initConfig({
    // Application settings
    settings: grunt.util._.extend(grunt.settings, {
      basePath: './'
    }),

    //
    // grunt-contrib-clean
    // https://github.com/gruntjs/grunt-contrib-clean
    //
    clean: {
      options: {
        force: true
      },
      css: ['<%= settings.basePath %>/build/css'],
      js: ['<%= settings.basePath %>/build/js']
    },
    //
    // grunt-contrib-coffee
    // https://github.com/gruntjs/grunt-contrib-coffee
    //
    coffee: {
      app: {
        files: [{
          expand: true,
          cwd: '<%= settings.basePath %>/source/js/coffee',
          src: '**/*.coffee',
          dest: '<%= settings.basePath %>/build/js',
          ext: '.js'
        }]
      }
    },
    //
    // grunt-contrib-connect
    // http://github.com/gruntjs/grunt-contrib-connect
    //
    connect: {
      options: {
        port: '<%= settings.local.port %>',
        hostname: '<%= settings.local.domain %>',
        base: '<%= settings.basePath %>/.tmp'
      },
      staging: {
        options: {
          middleware: function (connect, options) {
            var folders = [
              connect.static(options.base + '/.tmp'),
              connect.static(options.base)
            ];

            if(grunt.settings.local.livereload) {
              folders.unshift(lrSnippet);
            }

            return folders;
          }
        }
      }
    },

    //
    // grunt-contrib-compass
    // https://github.com/gruntjs/grunt-contrib-compass
    //
    compass: {
      options: {
        relativeAssets: true
      },
      app: {
        options: {
          sassDir: '<%= settings.basePath %>/css',
          cssDir: '<%= settings.basePath %>/.tmp/css',
          require : [
            'susy'
          ]
        },
        dist: {},
        server: {
          options: {
              debugInfo: false
          }
        }
      }
    },
    //
    // grunt-open
    // https://github.com/onehealth/grunt-open
    //
    open: {
      search: {
        path: 'http://localhost:<%= connect.options.port %>/index.html'
      }
    },

    //
    // grunt-contrib-requirejs
    // https://github.com/gruntjs/grunt-contrib-requirejs
    //
    requirejs: {
      options: {
        optimize: "none",
        preserveLicenseComments: false,
        // appDir: "<%= settings.basePath %>/",
        baseUrl: "<%= settings.basePath %>/.tmp",
        dir: '<%= settings.basePath %>/.dist',
        skipDirOptimize: false,
        removeCombined: false,
        mainConfigFile: '<%= settings.basePath %>/common.js',
        modules: [

        ]
      },
      dist: {
        options: {
          optimize: "uglify"
        }
      },
      staging: {
        options: {
          optimize: "none"
        }
      }
    },
    //
    // grunt-contrib-copy
    // https://github.com/gruntjs/grunt-contrib-copy
    //
    copy: {
      staging: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= settings.basePath %>',
          src: ['**/*', '!.{dist,tmp,test}/**/*'],
          dest: '<%= settings.basePath %>/.tmp',
          filter: 'isFile'
        }]
      }
    },

    //
    // grunt-contrib-watch
    // https://github.com/gruntjs/grunt-contrib-watch
    //
    // We target our watchers to reduce memory overhead
    // ex: watch:coffeeConfigurator
    //
    // watch: {
    //   coffee: {
    //     files: ['<%= settings.basePath %>/**/*.coffee'],
    //     tasks: ['coffee'],
    //     spawn: true
    //   },
    //   compass: {
    //     files: ['<%= settings.basePath %>/**/*.{scss,sass}'],
    //     tasks: ['compass'],
    //     spawn: true
    //   },
    //   livereload: {
    //     files: [
    //       '<%= settings.basePath %>/.tmp/**/*.{html,js,css,tmpl,png,jpg,jpeg,web}'
    //     ],
    //     tasks: ['livereload']
    //   }
    // }
    watch: {
      options: {
        livereload: true,
        nospawn: true
      },
      coffee: {
        files: ['<%= settings.basePath %>/**/*.coffee'],
        tasks: ['coffee']
      },
      compass: {
        files: ['<%= settings.basePath %>/**/*.{scss,sass}'],
        tasks: ['compass']
      },
      assets: {
        files: [
          '<%= settings.basePath %>/**/*.{html,js,css,tmpl,png,jpg,jpeg,web}'
        ]
      }
    }
  });

  grunt.registerTask('default', ['clean', 'coffee','compass', 'watch']);
  grunt.registerTask('server', function(target) {
    var tasks = ['build', 'copy', 'connect:staging:keepalive'];//['clean', 'coffee', 'compass', 'open', 'connect:staging:keepalive', 'watch'];
    // if(!grunt.settings.local.open) {
    //   tasks.splice(tasks.indexOf('open'), 1);
    // }
    // if(target === 'dist') {
    //   tasks = ['build', 'open', 'connect:dist:keepalive'];
    // }
    grunt.task.run(tasks);
  });

  grunt.registerTask('build', function(target) {
    grunt.task.run(['clean', 'coffee', 'compass']);
  });

};
