# Keyword Suggest

<pre>
	A node.js tool to get keyword suggestions from bing and google.
</pre>

## Requirements

* `node.js 0.6.5`  || http://nodejs.org/
* `request module` || https://github.com/mikeal/request

## How to use it

The script takes 2 arguments, the keyword and the language. Currently only supports english from US and spanish from Mexico.

Example:

<pre>
ivan@scorpion:~$ node keywordGrab.js "tijuana" es
tijuana
tijuana hoy
tijuana press
tijuana.gob.mx
tijuana baja california
craigslist tijuana
tijuana innovadora
tijuana zona río
<pre>

