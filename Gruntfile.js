module.exports = function(grunt){

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
            src: ['public/stylesheets/*.css']
        },
        concat: {
            options: {
                separator : '',
                stripBanners: true,
            },
            dist: {
                src  : ['public/javascripts/clientUtil.js', 'public/javascripts/client.js'],
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
                'test/*.js', 
                'routes/*.js', 
                'models/*.js', 
                'util/*.js', 
                './*.js', 
                'public/javascripts/client.js',
                'public/javascripts/clientUtil.js'
            ],
            options: {
                node : true,
                globals : {
                    "it"   : true, 
                    jQuery : true
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
                src: ['test/*Test.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['cssmin', "csslint", 'concat', 'uglify', 'jshint', 'mochaTest']);
};
