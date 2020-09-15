const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();
const posthtml = require("gulp-posthtml");
const del = require("del");
const webp = require("gulp-webp");
const htmlmin = require("gulp-htmlmin");
const jsminify = require("gulp-uglify");
const cssmin = require('gulp-cssmin');

//del

const clean = () => {
  return del("build");
};

//copy

const copy = () => {
  return gulp
    .src(["source/fonts/**/*.{woff,woff2}", "source/img/**", "source/js/**"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
};

// Styles

const styles = () => {
  return gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(cssmin())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;


//svg

const sprite = () => {
  return gulp
    .src("source/img/**/*/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("svgsprite.svg"))
    .pipe(gulp.dest("build/img"));
};

//html

const html = () => {
  return gulp.src("source/*.html").pipe(gulp.dest("build")).pipe(sync.stream());
};

exports.html = html;

//img

const images = () => {
  return gulp
    .src("source/img/**/*.{jpg,png,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.svgo(),
      ])
    );
};

//webp

const webpimage = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(
      webp({
        quality: 90,
      })
    )
    .pipe(gulp.dest("build/img"));
};

exports.webpimage = webpimage;

const js = () => {
  return gulp.src([
    "source/js/*.js"])
    .pipe(jsminify())
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};
exports.js = js;

const build = gulp.series(clean, copy, styles, webpimage, sprite, js, html);

exports.build = build;

// Server

const serve = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.serve = serve;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", gulp.series(html));
  gulp.watch("source/js/*.js").on("change", gulp.series(js));
};

exports.default = gulp.series(build, serve, watcher);
