/*
 * Copyright 2010-2011 Ivan Villareal
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
**/

var request = require('request');
var chars = ['a','b','c', 'd', 'e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var cabo = [];

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

var client = function (provider, q, mkt) {
	var keyword = encodeURI(q);
	var tld,lang;

	var requestDefaults = {
		'headers': {
			'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.8) Gecko/2009032609 Firefox/4.0.8'
		}
	};

	switch (mkt) {
		case 'es':
			mkt  = 'es-MX';
			lang = 'es';
			tld  = 'com.mx';
		break;
		case 'en':
			mkt = 'en-US';
			lang = 'en';
			tld  = 'com';
		break;
		default:
			mkt = 'en-US';
			lang = 'en';
			tld  = 'com';
		break;
	}	
	
	if (provider == 'bing') {
		requestDefaults.uri = 'http://api.bing.com/qsonhs.aspx?FORM=ASAPIH&mkt='+mkt+'&type=cb&q='+keyword+'&cp=7&o=h'; 
	} else if (provider == 'google') {
		requestDefaults.uri = 'http://clients1.google.'+tld+'/complete/search?hl='+lang+'&q='+keyword+'&json=t&ds=&client=serp'; 
	}
	keys = [];
	request(requestDefaults, function(e, res, body) {
		var respuesta = JSON.parse(body);
		var suggests;
		if (provider == 'bing') {
			try {
				suggests  = respuesta.AS.Results[0].Suggests;
				for (var i in suggests) {
					var txt = suggests[i].Txt;
					txt = txt.replace(/(<([^>]+)>)/ig, '');
					keys.push(txt);
				}
			} catch(e) {
				//bad response
			}
		} else if (provider == 'google') {
			try {
				suggests  = respuesta[1];
				for (var i in suggests) {
					var txt = suggests[i];
					keys.push(txt);
				}
			} catch(e) {
				//bad response
			}
		}
		
		out(keys);
	 });
}

var out = function(keys) {
	for (k in keys) {
			if (inArray(keys[k], cabo)) {
				//naranjas
			} else {
				cabo.push(keys[k]);
				console.log(keys[k]);
			}
		}
}


//main
var search   = process.argv[2];
var lang     = process.argv[3];
var provider = process.argv[4];

if (search != undefined) {
	//do a first search without extra letters
	if (provider == undefined) {
		client('google', search, lang);
		client('bing', search, lang);
		for (var c in chars) {
			client('bing', search+' '+chars[c], lang);
			client('google', search+' '+chars[c], lang);
		}
	} else {
		if (provider == 'google' || provider == 'bing') {
			client(provider, search, lang);
			for (var c in chars) {
				client(provider, search+' '+chars[c], lang);
			}
		} else {
			console.log('Unknown search provider specified');
			console.log('use either google or bing or none to process both of them');
		}
	}
} else {
	console.log("No search term given");
}
