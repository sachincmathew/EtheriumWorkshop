const request = require('request');

const URL = 'https://min-api.cryptocompare.com/data/price';

module.exports = function(tsyms = 'SGD') {
	return (
		new Promise((resolve, reject) => {
			request({
				method: 'GET',
				url: URL,
				qs: {
					fsym: 'ETH',
					tsyms: tsyms.toUpperCase().replace(/ /g, ''),
					sign: true
				}
			}, (err, resp, body) => {

				if (err || (!'authorization' in resp.headers)) {
					reject(err || { error: 'Mission Authorization header'});
					return;
				}

				let result = { data: JSON.parse(body) };

   			let sig = resp.headers['authorization'].substring('Signature '.length)
				let terms = sig.split(',')
				for (let t of terms) {
					let val = t.split('"');
					result[val[0].substring(0, val[0].length - 1)] = val[1]
				}

				result['timestamp'] = Math.round((new Date()).getTime() / 1000);

				resolve(result);
			})
		})
	);
}
