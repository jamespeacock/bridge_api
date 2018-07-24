const express = require('express');
const app = express();

var Database = require('better-sqlite3');
var db = new Database('test1.db');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send('Welcome to Bridge!'));

app.post('/login', (req, res) => {

	let email = req.params.email;
	let password = req.params.password; //obv make this more secure later

	var user = db.prepare('SELECT * FROM user WHERE email=?').get(email);

	if (user) {

		if (user.password == password) {
			res.status(200).send(user.user_id);
		}
		else {
			res.status(500).('Invalid Password')
		}
	} else {
		res.status(500).send('Invalid Username')
	}

});

app.post('/signup', (req, res) => 
	{

		db.prepare('INSERT INTO user (name,email,password) VALUES (' + name + ',\'' + email +'\',' + password + ');').put()
		res.send('signed up as ' + str(user_id))

	});

app.get('/search', (req, res) => {
	let query = req.body.query;
	res.send('search');
});

app.get('/profile/:id', (req, res) => {
	let user_id = req.params.id;
	var user = db.prepare('SELECT * FROM user WHERE id=?').get(user_id);
	var tags = db.prepare('SELECT * FROM tags WHERE user_id=?').all(user_id);
	
	for (var i = 0; i < tags.length; i++) {
		user[tags[i].tag_type] = tags[i].tag_content;
	}

	console.log(user);
	res.json(user);
});

app.post('/edit', (req, res) => res.send('edit'));

var server = app.listen(80, () => console.log('running app'));

module.exports = server;
