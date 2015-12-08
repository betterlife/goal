/*eslint-env node */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            minify: {
                expand: true,
                cwd: 'public/stylesheets/',
                src: ['*.css', '!*.min.css'],
                dest: 'public/stylesheets/',
                ext: '.min.css'
            }
        },
        csslint : {
            src: ['public/stylesheets/*.css'],
            force: true
        },
        concat: {
            options: {
                separator : '',
                stripBanners: true
            },
            dist: {
                src  : [
                    'public/javascripts/clientUtil.js',
                    'public/javascripts/client.js',
                    'public/javascripts/controllers/*.js',
                    'public/javascripts/services/*.js',
                    'public/javascripts/directives/*.js'
                ],
                dest : 'public/javascripts/client.concat.js'
            }
        },
        uglify: {
            options: {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: {
                    except: ['jQuery', 'angular']
                }
            },
            files: {
                src     : 'public/javascripts/client.concat.js', // source files mask
                dest    : 'public/javascripts/',                 // destination folder
                expand  : true,                                  // allow dynamic building
                flatten : true,                                  // remove all unnecessary nesting
                ext     : '.min.js'                              // replace .js to .min.js
            }
        },
        jshint: {
            src : [
                'app/test/*.js',
                'app/routes/*.js',
                'app/models/*.js',
                'app/util/*.js',
                './*.js',
                'public/javascripts/client.js',
                'public/javascripts/clientUtil.js',
                'public/javascripts/controllers/*.js'
            ],
            options: {
                node : true,
                globals : {
                    "it"                : true,
                    jQuery              : true,
                    'angular'           : true,
                    '$'                 : true,
                    'modalInstanceCtrl' : true,
                    'clientUtil'        : true
                }
            }
        },
        mochaTest : {
            test : {
                options : {
                    ui : 'bdd',
                    //reporter: 'landing',
                    reporter: 'dot',
                    require: [
                    ]
                },
                src: ['test/cases/*Test.js']
            }
        },
        watch : {
            scripts: {
                files: ['public/javascripts/*.js', 'public/stylesheets/*.css', '!**/*.min.css', '!**/*.min.js', '!**/*.concat.js', '!Gruntfile.js'],
                tasks: ['cssmin', 'concat', 'uglify'],
                options: {
                    interrupt: true,
                    livereload: true,
                    debounceDelay: 500,
                    spawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('deploy',  ['cssmin', 'concat', 'uglify']);
    grunt.registerTask('default', ['cssmin', "csslint", 'concat', 'uglify', 'jshint']);
    grunt.registerTask('test',    ['cssmin', "csslint", 'concat', 'uglify', 'jshint', 'mochaTest']);
    grunt.registerTask('listen',  ['watch']);
};
