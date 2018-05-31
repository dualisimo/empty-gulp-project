// nacitanie pluginov, nastavenie chybovych hlasok a vstupno/vystupnych ciest


var g = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

var p = require('gulp-load-plugins')({
		pattern: '*',
		scope: ['devDependencies'],
		replaceString: 'gulp-',
		camelize: true,
		lazy: false
	});

var e = function(err) {
		console.log(err.message, err.fileName, err.lineNumber);
		this.emit('end');
	};


// spojenie a minifikacia JS


g.task('scripts', function() {
	return g.src(p.mainBowerFiles())
	.pipe(p.plumber({ errorHandler: e }))
	.pipe(p.filter(['*.js']))
	.pipe(p.concatVendor('vendor.js'))
	.pipe(p.addSrc('source/scripts/*.js'))
	.pipe(p.order(['vendor.js', 'gallery.js', 'clustermarker.js', 'infobubble.js', 'map.js', 'main.js']))
	.pipe(p.replaceTask({
		usePrefix: false,
		preserveOrder: true,
		patterns: [
			{
				match: '( function( window ) {',
				replacement: ';( function( window ) {'
			}
		]
    }))
	.pipe(p.uglify())
	.pipe(p.concat('main.js'))
	.pipe(g.dest('public'));
});


g.task('sass', function(){
  return g.src(p.mainBowerFiles())
		.pipe(p.filter(['*.css']))
		.pipe(p.addSrc('source/styles/sass/main_sass.sass'))
		.pipe(sass())
		.pipe(g.dest('public'))
});

// spojenie, LESS spracovanie, pridanie vendor prefixov a minifikacia CSS


g.task('less', function() {
	return g.src(p.mainBowerFiles())
	.pipe(p.filter(['*.css']))
	.pipe(p.plumber({ errorHandler: e }))
	.pipe(p.addSrc('source/styles/less/main_less.less'))
	.pipe(p.order(['*.*', 'main_less.less']))
	.pipe(p.concat('main_less.less'))
	.pipe(p.replaceTask({
		usePrefix: false,
		preserveOrder: true,
		patterns: [
			{
				match: '.fa {',
				replacement: '.i {'
			},
			{
				match: '.fa-',
				replacement: '.i-'
			},
			{
				match: '.fa.',
				replacement: '.i.'
			},
			{
				match: '../fonts/fontawesome',
				replacement: 'fontawesome'
			}
		]
    }))
	.pipe(p.less({
		paths: ['source/styles/less']
	}))
	.pipe(p.autoprefixer({
		browsers: ['last 5 versions'],
		cascade: false
	}))
	.pipe(p.minifyCss({
		keepSpecialComments: 1,
		keepBreaks: false,
		aggressiveMerging: false,
		processImport: false
	}))
	.pipe(g.dest('public'));
});


// pisma


g.task('fonts', function() {
	return g.src(p.mainBowerFiles())
	.pipe(p.filter(['*.{eot,ttf,woff,woff2,svg}']))
	.pipe(g.dest('public'));
});


// kopirovanie assetov


g.task('assets', function() {
	return g.src(['source/{layouts,assets,fonts}/*.{json,png,jpg,gif,ico,woff,eot,svg,ttf}'])
	.pipe(p.flatten())
	.pipe(g.dest('public'));
});


// server a autoreload nahladovych HTML


g.task('browsersync', function() {
	var files = ['public/**/*.*'],
		settings = {
			proxy: 'http://localhost/~dual/oow_example/layouts/',

			ghostMode: {
				clicks: false,
				location: true,
				forms: false,
				scroll: true
			},
			open: true,
			notify: false,
			scrollProportionaly: false,
			scrollThrottle: 200
		};

	p.browserSync(files, settings);
});



// vycistenie priecinkov pred deployom


g.task('cleanup', function(cb) {
	return p.del(['public'], cb);
});


// deploy na produkciu


g.task('production', ['less', 'sass', 'scripts', 'fonts', 'assets'], function() {});


// defaultny task, pre development


g.task('default', ['production', 'browsersync'], function() {
	g.watch(['source/styles/less/*.{css,less}'], ['less']);
	g.watch(['source/styles/sass/*.{css,sass}'], ['sass']);
	g.watch(['source/scripts/*.js'], ['scripts']);
	g.watch(['source/assets/*.{png,jpg,gif,ico,woff,eot,svg,ttf}'], ['assets']);
});
