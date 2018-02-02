const request = require("request")

const tealURL = "https://api.teal.cool/organizations/wjrh/latest"
const tealCall = function(){
	return new Promise((resolve, reject) => {
		request(tealURL, {json: true}, function(err, res, body){
			resolve(body)
		})
	})
}

tealCall().then(body => console.log(body))