const express = require("express");
const request = require("request");
const _ = require("lodash");


let app = express();

let port = process.env.Port || 3000;

let CurrrencyRouter = express.Router();
const listOfCurrencies = ["GBP","AUD","BRL", "CAD","HNL","DKK","GBP","EUR","USD"].join(",");

CurrrencyRouter.route("/latest/:currencies")
	.get(function (req,res){
		const ApiKey = "1c7bac7f6711a3c4247b432cd8acbebb";
		if(req.params.currencies.indexOf("-") > -1) {
			const currencies = req.params.currencies.split("-");
			const base = currencies[0];
			const versus = currencies[1];
			const url = `http://data.fixer.io/api/latest?access_key=${ApiKey}&base=${base}&symbols=${listOfCurrencies}`;
			request(url,(err,response,body) => {
				if(err) res.json(err);
				const queryRate = "rates."+versus;
				const rate =_.get(JSON.parse(body),queryRate);
				const apiResponse = JSON.parse(body);	
				const result = {base : apiResponse.base,
					date: apiResponse.date,
					versus: versus,
					rate: rate
				};
				res.json(result);
			});
			
			
		}else{
		
			const currency = req.params.currencies;
			
			const url = `http://data.fixer.io/api/latest?access_key=${ApiKey}&base=${currency}&symbols=${listOfCurrencies}`;
			request(url,(err,response,body) => {
				if(err) res.json(err);
				const apiResponse = JSON.parse(body);
				const result = {base : apiResponse.base,
					date: apiResponse.date,
					rates: apiResponse.rates};
				res.json(result);
			});
			
		}
	
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
