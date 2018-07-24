const express = require('express');
const app = express();

var Database = require('better-sqlite3');
var db = new Database('test1.db');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send('Welcome to Bridge!'));

app.post('/login', (req, res) => {

	let email = req.body.email;
	let password = req.body.password; //obv make this more secure later

	console.log(email)
	var user = db.prepare('SELECT * FROM user WHERE email=?').get(email);
	console.log(user)

	if (user) {

		if (user.password == password) {
			res.status(200).send(user.user_id);
		}
		else {
			res.status(501).send('Invalid Password')
		}
	} else {
		res.status(502).send('Invalid Username')
	}

});

app.post('/signup', (req, res) => 
	{
		let name = req.body.name;
		let email = req.body.email;
		let password = req.body.password; //obv make this more secure later

		console.log(name);

		//TODO check if user already exists.

		var info = db.prepare('INSERT INTO user (name,email,password) VALUES (\'' + name + '\',\'' + email +'\',\'' + password + '\');').run();

		console.log('Signed up as ' + info.lastInsertROWID.toString());
		res.status(200).send('Signed up as ' + info.lastInsertROWID.toString());



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
