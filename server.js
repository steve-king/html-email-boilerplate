// load the things we need
var express = require('express');
var app = express();

// Register EJS template supoprt for HTML extension
app.engine('.html', require('ejs').__express);
// Register EJS template supoprt for CSS extension
app.engine('.html', require('ejs').__express);

// ROOT_FOLDER is set in Grunfile.js
var root_dir = './'+process.env.ROOT_FOLDER;
app.set('views', root_dir);

// Add routes to your HTML templates as needed
app.get(['/', '/index.html'], function(req, res){
	res.render('index.html', {
		data : {
			title : '',
			body_class : 'page-home'
		}
	});
});

// Register a static route to the root_dir
app.use(express.static(root_dir));

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Hosting '+process.env.ROOT_FOLDER+'/');
console.log('http://localhost:'+port);