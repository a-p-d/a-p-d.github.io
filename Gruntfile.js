module.exports = function(grunt) {
"use strict";
  
  grunt.initConfig({

    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>) \n' +
            ' * Copyright <%= pkg.author.name %> \n' +
            ' * Licensed under <%= pkg.license.type %> \n' +
            ' */\n',

    // Task configuration.
    clean: {
      css: ["assets/stylesheets/*.css"],
      js: ["assets/scripts/*.js"],
      fonts: ["assets/fonts/*"],
      tmp: ["assets/scripts/tmp"]
    },

    // CSS Compile
    less: {
      main: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'main.css.map',
          sourceMapFilename: 'assets/stylesheets/less/main.css.map'
        },
        files: {
          'assets/stylesheets/main.css': 'assets/stylesheets/less/main.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      main: {
        options: {
          map: true
        },
        src: 'assets/stylesheets/main.css'
      }
    },
    
    csscomb: {
      options: {
        config: 'config/.csscomb.json'
      },
      main: {
        files: {
          'assets/stylesheets/main.css': ['assets/stylesheets/main.css']
        }
      }
    },
    
    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      main: {
        src: 'assets/stylesheets/main.css',
        dest: 'assets/stylesheets/main.min.css'
      }
    },

    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      css: {
        src: 'assets/stylesheets/*.css'
      }
    },

    // JS compile
    concat: {
      main: {
        options: {
          banner: '<%= banner %>\n<%= jqueryCheck %>',
          stripBanners: false
        },
        src: ["assets/scripts/src/*.js"],
        dest: 'assets/scripts/main.js'
      },
      bootstrap: {
        src: [
          'assets/vendor/bootstrap/js/transition.js',
          'assets/vendor/bootstrap/js/alert.js',
          'assets/vendor/bootstrap/js/button.js',
          'assets/vendor/bootstrap/js/carousel.js',
          'assets/vendor/bootstrap/js/collapse.js',
          'assets/vendor/bootstrap/js/dropdown.js',
          'assets/vendor/bootstrap/js/modal.js',
          'assets/vendor/bootstrap/js/tooltip.js',
          'assets/vendor/bootstrap/js/popover.js',
          'assets/vendor/bootstrap/js/scrollspy.js',
          'assets/vendor/bootstrap/js/tab.js',
          'assets/vendor/bootstrap/js/affix.js'     
        ],
        dest: 'assets/scripts/tmp/bootstrap.js'
      },     
      plugins: {
        options: {
          banner: '<%= banner %>\n<%= jqueryCheck %>',
          stripBanners: false
        },
        src: [
          'assets/vendor/jquery/dist/jquery.min.js',
          'assets/scripts/tmp/bootstrap.min.js',
          'assets/vendor/fluidbox/jquery.fluidbox.min.js'       
        ],
        dest: 'assets/scripts/plugins.min.js'
      }
    },
    
    uglify: {
      options: {
        preserveComments: 'some'
      },
      bootstrap: {
        src: 'assets/scripts/tmp/bootstrap.js',
        dest: 'assets/scripts/tmp/bootstrap.min.js'
      },     
      main: {
        src: 'assets/scripts/main.js',
        dest: 'assets/scripts/main.min.js'
      }

    },
  
    jshint: {
      grunt: {
        options: {
          jshintrc: 'config/.grunt-jshintrc'
        },
        src: 'Gruntfile.js'
      },
      main: {
        options: {
          jshintrc: 'config/.jshintrc'
        },
        src: 'assets/scripts/main.js'
      }
    },
        
    // Copy assets from the vendor folder
    copy: {
      fontawesome: {
        expand: true,
        flatten: true,
        src: 'assets/vendor/font-awesome/fonts/*',
        dest: 'assets/fonts/'
      },
      ubuntu: {
        expand: true,
        flatten: true,
        src: 'assets/vendor/font-ubuntu/*',
        dest: 'assets/fonts/'
      }
    },
    
    shell: {
      jekyllServe: {
        command: "jekyll serve --baseurl="
      },
      jekyllBuild: {
        command: "jekyll build --config _config.yml"
      }
    },
    
    
    watch: {
      options: {
        livereload: true
      },
      site: {
        files: ["*.html", "_data/*.yml", "_layouts/*.html", "_posts/*.md", "_projects/*.md", "_includes/*.html"],
        tasks: ["shell:jekyllBuild"]
      },
      js: {
        files: ["assets/scripts/src/*.js"],
        tasks: ['clean:js', 'concat:main', 'jshint:main', 'concat:bootstrap', 'uglify', 'concat:plugins', 'clean:tmp', 'shell:jekyllBuild']
      },
      css: {
        files: ["assets/stylesheets/less/**/*.less"],
        tasks: ['clean:css', 'less', 'autoprefixer', 'csscomb', 'cssmin', 'usebanner:css', 'shell:jekyllBuild']
      }
    }
    
  });

  // Autoload Grunt plugins from the devDependencies array of package.json 
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // Tasks
  grunt.registerTask('test', ['jshint:grunt']);
  grunt.registerTask('css-compile', ['clean:css', 'less', 'autoprefixer', 'csscomb', 'cssmin', 'usebanner:css']);
  grunt.registerTask('js-compile', ['clean:js', 'concat:main', 'jshint:main', 'concat:bootstrap', 'uglify', 'concat:plugins', 'clean:tmp']);
  grunt.registerTask('fonts-compile', ['clean:fonts', 'copy:fontawesome', 'copy:ubuntu']);
  grunt.registerTask('assets-compile', ['css-compile', 'js-compile', 'fonts-compile']);
  grunt.registerTask("serve", ["shell:jekyllServe"]); 
  grunt.registerTask('dev', ['assets-compile',"shell:jekyllBuild", 'watch']);
   
};