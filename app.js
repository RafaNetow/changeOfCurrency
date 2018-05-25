const express = require("express");
const request = require("request");
const _ = require("lodash");


let app = express();

let port = process.env.Port || 3000;

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

let CurrrencyRouter = express.Router();
const listOfCurrencies = ["GBP","AUD","BRL", "CAD","HNL","DKK","GBP","EUR","USD"].join(",");
const ApiKey = "ad0104bde1bca6d691decb0ad64e8e9b";

CurrrencyRouter.route("/latest/:currencies")
	.get(function (req,res){
		if(req.params.currencies.indexOf("-") > -1) {
			const currencies = req.params.currencies.split("-");
			const base = currencies[0];
			const versus = currencies[1];
			const url = `http://data.fixer.io/api/latest?access_key=${ApiKey}&base=${base}&symbols=${listOfCurrencies}`;
			request(url,(err,response,body) => {

				if(err) res.json(err);
				const queryRate = "rates."+versus;
				const apiResponse = JSON.parse(body);	
				const rate =_.get(apiResponse,queryRate);
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
/* c */
CurrrencyRouter.route("/historical/:currencies")
	.get(function (req,res){
		if (req.query.start || req.query.end) {
			const currencies = req.params.currencies.split("-");
			const base = currencies[0];
			const versus = currencies[1];
			const url = `http://data.fixer.io/api/timeseries?access_key=${ApiKey}&start_date=${req.query.start}&end_date=${req.query.end}&symbols=${listOfCurrencies}`;
			request(url,(err,response,body) => {

				const apiResponse = JSON.parse(body);
				const jsonArray = [];
				const arrayDate =_.toArray(apiResponse);
				console.log(arrayRates);
				const arrayRates =	_.toArray(apiResponse.rates);
				let count = 0;
				arrayDate.forEach(function (element){
					const rateVersus =_.get(arrayRates[count],versus);
					arrayDate[count] = rateVersus;

					count++;
					
				});
				
				let result = { base :base,
							   versus: versus,
							   start: req.query.start,
							   end:  req.query.end,
							   rate: arrayDate
				};
			
				res.json(result);
			});
			
		} else if(req.query.date) {
			const currencies = req.params.currencies.split("-");
			if(req.params.currencies.indexOf("-") > -1){
				const base = currencies[0];
				const versus = currencies[1];
				const url = `http://data.fixer.io/api/${req.query.date}?access_key=${ApiKey}&base=${base}&symbols=${listOfCurrencies}`;
				request(url,(err,response,body) => {
					const queryRate = "rates."+versus;
					const apiResponse = JSON.parse(body);	
					const rate =_.get(apiResponse,queryRate);
			
					const result = {base : apiResponse.base,
						date: apiResponse.date,
						versus: versus,
						rate: rate
					};
					res.json(result);
					
				});
			}
		
		}else{
			res.json("Server Error");
		}		
	}); 
app.use("/", CurrrencyRouter);



app.listen(port, function() {
	console.log("Gulp is cool");
});
