module.exports = function(grunt) {

	// Load plugins
	require('load-grunt-tasks')(grunt);

	// If tasks are taking a long time, uncomment the below to get more info
	// require('time-grunt')(grunt);

	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),

		// -------------------------------------------------------------------------------------------------------------------
		// FOLDER PATHS (no trailing slash)
		// -------------------------------------------------------------------------------------------------------------------
		// Set the below paths to wherever your dev & build folders are, e.g 'src', 'dist', 'public_html', whatever
		// Besides the name of your HTML includes folder, we'll assume everything else will follow this structure:
		// - css/
		// - fonts/
		// - images/ - as opposed to 'img' because Photoshop saves slices to an "images" folder
		// - js/
		// - scss/
		// NOTE: You must edit .bowerrc and change the bower_components directory to wherever your dev folder is
		paths: {
			dev: 'dev',
			build: 'build',
			html_includes: 'includes', // You might want to change this to 'html' or 'ejs' or whatever template language you use
			temp: '.tmp' // Here as an option but you probably don't want to change this
		},

		// -------------------------------------------------------------------------------------------------------------------
		// TASK CONFIGURATION
		// -------------------------------------------------------------------------------------------------------------------

		sass: {
			dev: {
				options: {
					outputStyle: 'compressed'
				},
				files: [{
					//'<%=paths.dev%>/css/': '<%=paths.dev%>/scss/*.scss',
					expand: true,
					cwd: '<%=paths.dev%>/scss/',
					src: ['*.scss'],
					dest: '<%=paths.dev%>/css',
					ext : '.css'
				}]
			}
		},

		emailBuilder: {
			inline: {
				options: {
				
				},
				files : [{
					expand: true,
					cwd: '<%=paths.temp%>',
					src: '*.html',
					dest: '<%=paths.build%>'
				}]
			}
		},

		// HOUSEKEEPING
		// ---------------------------------------
		clean: {
			// grunticon: [
			// 	'<%=paths.dev%>/preview.html', // We don't need the icon preview file littering up our root
			// 	'<%=paths.dev%>/grunticon.loader.js' // This has already been copied to js/ and committed, so delete this
			// ],
			temp: [
				'<%=paths.temp%>'
			]
		},

		// WATCH
		// ---------------------------------------
		watch: {	
			options: {
				interrupt: true,
				spawn: false
			},
			sass: {
				files: '<%=paths.dev%>/**/*.scss',
				tasks: ['sass']
			}
		},

		// NODE SERVER
		// These defaults are useful for static HTML projects
		// If you're writing an actual NodeJS app, remove the included server.js and update config as needed.
		// ---------------------------------------
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					env : {
						ROOT_FOLDER : '<%=paths.dev%>'
					},
					ignore: [
						'Gruntfile.js',
						'node_modules/**',
						'**/bower_components/**',
						'<%=paths.dev%>/**/*.js',
						'<%=paths.temp%>/**/*.js',
						'<%=paths.build%>/**/*.js'
					],
				}
			},
			build: {
				script: 'server.js',
				options: {
					env : {
						ROOT_FOLDER : '<%=paths.build%>'
					},
					ignore: [
						'Gruntfile.js',
						'node_modules/**',
						'**/bower_components/**',
						'<%=paths.dev%>/**/*.js',
						'<%=paths.temp%>/**/*.js',
						'<%=paths.build%>/**/*.js'
					],
				}
			}
		},

		// CONCURRENT
		// - Run tasks in parallel. Prime example is having watch and nodemon running together
		// - Be wary - the CPU overhead for spawning concurrent tasks often negates any time savings made, so test it out
		// ---------------------------------------
		concurrent: {
			watch_serve: {
				tasks: ['watch', 'nodemon:dev'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		
		// BUILD TASKS
		// ---------------------------------------
		copy: {
			temp: {
				files: [{
					expand: true,
					cwd: '<%=paths.dev%>',
					src: [
						'**/*.*',
						'!*.html'
					],
					dest: '<%=paths.temp%>'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: '<%=paths.temp%>',
					src: [
						'**/*.*',
						'!*.html',
						'!scss/**/*.*',
						'!**/*.css',
						'!**/includes/**',
						'!**/*.{png,jpg,gif,svg}'
					],
					dest: '<%=paths.build%>'
				}]
			}
		},

		imagemin: {
			build: {
				options: {
					//cache: false,
					optimizationLevel: 7,
					pngquant: true,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: '<%=paths.temp%>',
					src: ['images/**/*.{png,jpg,gif}', 'css/**/*.{png,jpg,gif}'],
					dest: '<%=paths.build%>'
				}]
			}
		},

		// Render out EJS template tags in the below HTML files to temp folder
		render: {
			index: {
				options: {
					data : {
						'title' : '',
						'body_class': 'page-home'
					}
				},
				files: {
					'<%=paths.temp%>/index.html': ['<%=paths.dev%>/index.html']
				}
			}
		},

		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					minifyCSS: true
				},
				files: [{  
					expand: true,
					cwd: '<%=paths.build%>',
					src: '*.html',
					dest: '<%=paths.build%>'
				}]
			}
		}

		// replace: {
		// 	build: {
		// 		src: ['<%=paths.temp%>/*.html'],        // source files array (supports minimatch)
		// 		dest: 'build/',             			// destination directory or file
		// 		replacements: [{
		// 			from: 	'<script src="bower_components/modernizr/modernizr.js"></script>',
		// 			to: 	'<script src="js/vendor/modernizr.custom.min.js"></script>'
		// 		}]
		// 	}
		// }
	
	});
	
	// -------------------------------------------------------------------------------------------------------------------
	// TASK REGISTRATION
	// -------------------------------------------------------------------------------------------------------------------

	// DEFAULT TASK
	// --------------------------------------- 
	// - Runs watch and node server in parallel
	// Watch will:
	// - Compile SCSS to CSS in dev 
	// - Run jshint on new files only
	// - Keep an eye on your icons folder and compile new icon CSS and images as needed
	// Host will:
	// - Run a node server on dev folder with EJS template support
	// - If you don't want a server running, just run "grunt watch" instead
	grunt.registerTask('default', ['sass:dev', 'concurrent:watch_serve']);

	// Standalone server tasks. 
	// Run 'grunt serve' to check out your build folder in the browser.
	grunt.registerTask('serve:dev', ['nodemon:dev']);
	grunt.registerTask('serve', ['nodemon:build']);

	// -------------------------------------------------------------------------------------------------------------------
	// BUILD TASK
	// -------------------------------------------------------------------------------------------------------------------

	// DEV TO TEMP
	grunt.registerTask('build_dev_to_temp', [
		// Any extra processes that need to happen first go here
		// e.g concatenating Node EJS templates into a single, flat HTML file
		// Or vendor prefixing sass output before minification?
		'copy:temp',
		'render:index',	
	]);

	// TEMP TO BUILD
	grunt.registerTask('build_temp_to_build', [

		//'copy:build',
  		'emailBuilder:inline',
		'htmlmin:build',
  		
  		// Run imagemin on new files only
  		'newer:imagemin:build',

		'clean:temp'
	]);

	// COMBINED BUILD TASK
	grunt.registerTask('build', ['sass:dev', 'build_dev_to_temp', 'build_temp_to_build', 'serve']);

};