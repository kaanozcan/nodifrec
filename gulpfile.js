const gulp = require("gulp");
const babel = require("gulp-babel");
const del = require("del");

gulp.task("clean-dist", function (done){
  del("./dist").then(done);
})

gulp.task("build-dist", function (){
  return gulp.src("./src/**/*.js")
              .pipe(babel({
                presets: ["react", "es2015", "stage-0"]
              }))
              .pipe(gulp.dest("./dist/"));
});

gulp.task("build", ["clean-dist", "build-dist"]);
