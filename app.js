const express = require('express')

let app = express();

let port = process.env.Port || 3000;

let CurrrencyRouter = express.Router();

CurrrencyRouter.route("/Currrency")
	.get(function (req,res){
		let responseJson = {hello: "Hellow Loyica"};
		res.json(responseJson);
	});
app.use("/api", CurrrencyRouter);

app.get("/", function(req, res) {
	res.send("Welcome to my Api :D");
});

app.listen(port, function() {
	console.log("Gulp gonna help me");
});
