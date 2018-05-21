const express = require("express");
const _ = require("lodash")

let app = express();

let port = process.env.Port || 3000;

let CurrrencyRouter = express.Router();

CurrrencyRouter.route("/latest/:currency")
	.get(function (req,res){
		let responseJson = {hello: "currency response",
			testo: req.params.currency,
			queryParam: req.query.test};
		res.json(responseJson);
	});

CurrrencyRouter.route("/latest/:base-:versus")
	.get(function (req,res){
		let responseJson = {hello: "base and versus response",
			base: req.params.base,
			versus: req.params.versus,
			queryParam: req.query.test};
		res.json(responseJson);
	});  
CurrrencyRouter.route("/historical/:base-:versus")
	.get(function (req,res){
		if (req.query.start || req.query.end) {
			let responseJson = {hello: "historial base and versus response",
				base: req.params.base,
				versus: req.params.versus,
				start: req.query.start,
				end: req.query.end};
			res.json(responseJson);
		} else if( req.query.date) {
			let responseJson = {hello: "historial base and versus response",
				base: req.params.base,
				versus: req.params.versus,
				date: req.query.date};
			res.json(responseJson);
		}
		

	}); 
app.use("/", CurrrencyRouter);



app.listen(port, function() {
	console.log("Gulp is cool");
});
