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

var bing = function (q,mkt) {
	var keyword = encodeURI(q);
	switch (mkt) {
		case 'es':
			mkt = 'es-MX';
		break;
		case 'en':
			mkt = 'en-US';
		break;
		default:
			mkt = 'en-US';
		break;
	}	
	var requestDefaults = {
	'uri' : 'http://api.bing.com/qsonhs.aspx?FORM=ASAPIH&mkt='+mkt+'&type=cb&q='+keyword+'&cp=7&o=h',
	'headers': {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
	};
	keys = [];

	request(requestDefaults, function(e, res, body) {
		var respuesta = JSON.parse(body);
		try {
			var suggests  = respuesta.AS.Results[0].Suggests;

			for (var i in suggests) {
				var txt = suggests[i].Txt;
				txt = txt.replace(/(<([^>]+)>)/ig, '');
				keys.push(txt);
				//console.log('metiendo '+txt);
			}
		} catch(e) {
		}
		//console.log(cabo);
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
var search = process.argv[2];
var lang   = process.argv[3];
if (search != undefined) {
	//do a first search without extra letters
	bing(search, lang);
	for (var c in chars) {
		var t = bing(search+' '+chars[c], lang);
	}
} else {
	console.log("No search term given");
}
