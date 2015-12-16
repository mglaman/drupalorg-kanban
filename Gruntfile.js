/*global module:false*/
/*global require:false*/
module.exports = function(grunt) {
  // Require normal dependencies.
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      files: [
        'build/*',
        'release/*'
      ]
    },

    concat: {
      options: {
        banner: '<%= banner %>' + grunt.file.read('src/js/_banner.header.js'),
        footer: grunt.file.read('src/js/_banner.footer.js'),
        stripBanners: true
      },
      build: {
        src: [
          'src/js/**/*.js',
          '!src/js/_banner.header.js',
          '!src/js/_banner.footer.js',
          '!src/js/init.js',
          'src/js/init.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    jshint: {
      package: {
        options: {
          jshintrc: '.jshintrc',
        },
        src: 'package.json'
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      js: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'src/js/**/*.js'
      }
    },

    sed: {
      name: {
        path: 'build/',
        pattern: '%PKG.NAME%',
        replacement: '<%= pkg.name %>',
        recursive: true
      },
      title: {
        path: 'build/',
        pattern: '%PKG.TITLE%',
        replacement: '<%= pkg.title || pkg.name %>',
        recursive: true
      },
      description: {
        path: 'build/',
        pattern: '%PKG.DESCRIPTION%',
        replacement: '<%= pkg.description %>',
        recursive: true
      },
      homepage: {
        path: 'build/',
        pattern: '%PKG.HOMEPAGE%',
        replacement: '<%= pkg.homepage || "" %>',
        recursive: true
      },
      author: {
        path: 'build/',
        pattern: '%PKG.AUTHOR%',
        replacement: '<%= pkg.author.name %>',
        recursive: true
      },
      icon: {
        path: 'build/',
        pattern: '%PKG.ICON%',
        replacement: '<%= pkg.icon || "icon.png" %>',
        recursive: true
      },
      license: {
        path: 'build/',
        pattern: '%PKG.LICENSE%',
        replacement: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
        recursive: true
      },
      version: {
        path: 'build/',
        pattern: '%PKG.VERSION%',
        replacement: '<%= pkg.version %>',
        recursive: true
      }
    },

    uglify: {
      options: {
        beautify: true
      },
      default: {
        src: '<%= concat.build.dest %>',
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    copy: {
      chrome: {
        files: [
          {
            expand: true,
            cwd: 'templates/chrome/',
            src: ['**'],
            dest: 'build/chrome/'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['icon.png'],
            dest: 'build/chrome/'
          },
          {
            expand: true,
            cwd: 'build/',
            src: ['<%= pkg.name %>.js'],
            dest: 'build/chrome/'
          }
        ]
      },
    },

    compress: {
      chrome: {
        options: {
          archive: 'release/chrome/<%= pkg.name %>.zip',
          mode: 'zip'
        },
        expand: true,
        cwd: 'build/chrome/',
        src: ['**/*'],
        dest: '/'
      }
    },
  });
    // Default tasks.
  grunt.registerTask('default', 'Compiles code.',
    ['clean', 'concat', 'copy', 'sed']);

  // Test tasks.
  grunt.registerTask('test', 'Runs tests.',
    ['qunit']);
  grunt.registerTask('travis-ci', 'Compiles code and runs tests.',
    ['default', 'test']);

  // Build tasks.
  grunt.registerTask('build', 'Compiles code and builds all extensions.',
    ['default', 'uglify', 'build:chrome']);
  grunt.registerTask('build:chrome', 'Builds the Chrome extension.',
    ['compress:chrome']);

};
