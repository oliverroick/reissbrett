module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'app/**/*.js']
        },
    });
};
