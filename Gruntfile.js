module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'css/soundgrid.css' : 'scss/soundgrid.scss'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);

  grunt.registerTask('serve', function (target) {});

  grunt.registerTask('server', 'Start a custom web server.', function() {
    grunt.log.writeln('Starting web server on port 1234.');
    require('./server.js').listen(1234);
  });
};