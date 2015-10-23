module.exports = function(grunt) {

  //Plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-html2js');

  // Tasks
  grunt.registerTask('release-watch', ['release', 'watch:release']);
  grunt.registerTask('release', ['clean:dist', 'concat', 'uglify:app_main', 'copy:all', 'jshint', 'html2js', 'uglify:app_templates']);
  grunt.registerTask('timestamp', function() {
	grunt.log.subhead(Date());
  });  
  
  // Project configuration.
  grunt.initConfig({
	app_distdir: 'dist/app',
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
            '/*! https://github.com/niklr/angular-query-builder */\n',
	// variables used for plugins below
    src:{
        js: ['src/**/*.js'],
        html: ['*.html', 'src/**/*.html'],
        css: ['*.css'],
	},
	// directory to be cleaned
    clean: {
        dist: {
            src: ['<%= app_distdir %>/*', '!<%= app_distdir %>/img/**']
        }
    },
	// copies everything from src folder to dest folder (expand true keeps the directory structure)
	// makes all src relative to cwd
	copy:{
		all: {
			files: [
                { dest: '<%= app_distdir %>/libraries', src: '**', expand: true, cwd: 'libraries/' },
                { dest: '<%= app_distdir %>/main.js', src: 'main.js' },
                { dest: '<%= app_distdir %>/main.css', src: 'main.css' }
			]
		}
	},
	concat:{
	    app_dist:{
	        options:{
	            banner: "<%= banner %>"
	        },
	        src: ['<%= src.js %>'],
	        dest:'<%= app_distdir %>/js/<%= pkg.name %>.js'		
	    },
	    app_index:{
	        src: ['index.html'],
	        dest: '<%= app_distdir %>/index.html',
	        options: {
	            process: true
	        }
	    }
	},
	html2js: {
	    aqb: {
	        src: ['src/**/*.tpl.html'],
	        dest: '<%= app_distdir %>/js/angular-query-builder-templates.js'
	    }
	},
	uglify: {
		app_main:{
			options:{
				banner: "<%= banner %>"
			},
			src: '<%= app_distdir %>/js/<%= pkg.name %>.js',
			dest: '<%= app_distdir %>/js/<%= pkg.name %>.min.js'
		},
		app_templates: {
		    options: {
		        banner: "<%= banner %>"
		    },
		    src: '<%= app_distdir %>/js/angular-query-builder-templates.js',
		    dest: '<%= app_distdir %>/js/angular-query-builder-templates.min.js'
		}
	},
	watch:{
		all:{
		    files: ['<%= src.js %>', '<%= src.html %>', '<%= src.css %>'],
			tasks: ['default','timestamp']
		},
		release: {
		    files: ['<%= src.js %>', '<%= src.html %>', '<%= src.css %>'],
		    tasks: ['release', 'timestamp']
		}
	},
	jshint:{
	    files: ['<%= src.js %>'],
		options:{
			curly:true,
			eqeqeq:true,
			immed:true,
			latedef:true,
			newcap:true,
			noarg:true,
			sub:true,
			boss:true,
			eqnull:true,
            devel:true,
            undef:true,
            globals: {
                "$": false,
                "angular": false,
                "_": false
            }
		}
	}	
  });

};