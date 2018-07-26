const express = require('express');
const app = express();

var Database = require('better-sqlite3');
var db = new Database('test1.db');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send('Welcome to Bridge!'));

app.post('/login', (req, res) => {

	let email = req.body.email;
	let password = req.body.password;

	console.log(`attempted login with ${email}`);
	
	let user = db.prepare('SELECT * FROM user WHERE email=?').get(email);

	//TODO: obv make this more secure later
	let pw_match = (user.password === password);

	if (user && pw_match) {
		res.status(200).send(user.user_id);
	} else if (user && !pw_match) {
		res.status(501).send('Invalid Password');
	} else {
		res.status(502).send('Invalid Email');
	}
});

app.post('/signup', (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let ref_code = req.body.ref_code;

	let user_exists = db.prepare('SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) AS "check"').get(email);

	if (user_exists.check === 1) res.status(200).send("user already exists!");	

	let user_insert = db.prepare('INSERT INTO user (name, email, password) VALUES (?, ?, ?);').run(name, email, password);
	
	let new_user_id = user_insert.lastInsertROWID;

	res.status(200).send(`new user ${new_user_id} added!`);	
});

app.get('/search', (req, res) => {
	let query = req.query.query;
	query = "%" + query + "%";
	
	let search_query = db.prepare('SELECT name, email FROM user JOIN tags ON user.id = tags.user_id WHERE tags.tag_content LIKE ? OR user.name LIKE ? OR user.email LIKE ?').get(query, query, query);

	console.log(search_query);

	res.send('search');
});

app.get('/profile/:id', (req, res) => {
	let user_id = req.params.id;
	var user = db.prepare('SELECT * FROM user WHERE id=?').get(user_id);
	var tags = db.prepare('SELECT * FROM tags WHERE user_id=?').all(user_id);

	for (var i = 0; i < tags.length; i++) {
		user[tags[i].tag_type] = tags[i].tag_content;
	}

	console.log(`Got user ${user.email}`);
	res.json(user);
});

app.post('/edit', (req, res) => res.send('edit'));

var server = app.listen(80, () => console.log('running app'));

module.exports = server;
