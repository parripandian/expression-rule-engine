/**
 * Created by Parri on 8/28/2016.
 */

module.exports = function (grunt) {
    var package = grunt.file.readJSON('package.json');

    var project = {
        name: 'expression-rule-engine',
        source: {
            path: 'src',
            file: 'expression-rule-engine.js',
            minFile: 'expression-rule-engine.min.js',
            map: 'expression-rule-engine.min.js.map'
        },
        build: {
            path: 'build',
            file: 'expression-rule-engine.js',
            minFile: 'expression-rule-engine.min.js'
        }
    };

    grunt.initConfig({
        pkg: package,
        project: project,

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            build: {
                src: ['<%= project.source.path %>/<%= project.source.file %>']
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>) */',
                report: 'gzip',
                sourceMap: "<%= pkg.name %>/<%= project.source.map %>",
                sourceMappingURL: "<%= project.source.map %>",
                sourceMapPrefix: 1
            },
            build: {
                src: "<%= project.build.path %>/<%= project.build.file %>",
                dest: "<%= project.build.path %>/<%= project.build.minFile %>"
            }
        },
        concat: {
            options: {
                process: {
                    data: {
                        version: package.version,
                        description: package.description,
                        author: package.author,
                        license: package.license,
                        url: package.repository.url
                    }
                }
            },
            js: {
                src: ['<%= project.source.path %>/<%= project.source.file %>'],
                dest: '<%= project.build.path %>/<%= project.build.file %>'
            }
        },
        clean: {
            build: ['<%= project.build.path %>/']
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'MochaTestResults.txt',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['tests/**/*.js']
            }
        },
        compress: {
            production: {
                options: {
                    archive: '<%= project.name %>-<%= pkg.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= project.build.path %>/',
                    src: '*',
                    dest: '<%= project.name %>-<%= pkg.version %>'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
    grunt.registerTask('test', ['concat', 'jshint', 'mochaTest']);
    grunt.registerTask('package', ['clean', 'concat', 'jshint', 'mochaTest', 'uglify', 'compress']);
};
