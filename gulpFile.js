const gulp = require("gulp");
const nodemon = require("gulp-nodemon");

gulp.task("default", function(){
	nodemon({
		script: "app.js",
		env: {
			PORT:8000
		},
		ignore: ["./node_modules/**"]
	})
		.on("restart", function(){
			console.log("Restarting");
		});
});