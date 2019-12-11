const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors  = require('cors');
const knex = require('knex');


const pg = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'mvch',
    password : 'mvch',
    database : 'smart-brain'
  }
});

const app = express();
app.use( bodyParser.json());
app.use(cors());


const database = {
	users: [
	{
		id: '123',
		name: 'John',
		email: 'john@gmail.com',
		password: '$2a$10$IfTbRqfaElOh6ESkTFi9geyW16qCxNFSvYkp11vY28u7VLFqtbyZu',
		//pass = cookies
		entries: 0,
		joined: new Date()
	},
	{
		id: '124',
		name: 'Sally',
		email: 'sally@gmail.com',
		password: 'bananas',
		entries: 0,
		joined: new Date()
	}
	]
}

app.get('/', (req, res) => {
	res.send(database.users)
})


app.get('/profile/:id', (req, res) => {
	
	const {id} = req.params;
	let found = false;

	pg.select('*').from('users').where({id})
	.then(user => {
	
		if(user.length){
			res.json(user[0]);	
		} else {
			res.status(404).json('no such user')
		}
	})
	.catch (err => res.status(404).json('error getting the user'))	
})





app.put('/image', (req, res) => {
	
	const {id} = req.body;
	let found = false;

	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	} )
	
	if (!found)	 {
		res.status(404).json('no such user')		
	}		
		
})



app.post('/signin', (req, resp) => {
	
	let found = false;
	database.users.forEach(user => {
		if (user.email === req.body.email) {
			found = true;
			bcrypt.compare(req.body.password, user.password, function(err, res) {
	    		res ? resp.json(user)
					: resp.status(400).json('error logging in')
	    	});
	    }
	})
	if (!found){
		resp.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	
	const {email, name, password} = req.body;
	let tmpHash ='';

	bcrypt.hash(password, null, null, function(err, hash) {
		tmpHash =  hash;
	
		pg('users')
		.returning ('*')
		.insert({
			email:email,
			name:name,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0])	
		}) 
		.catch(err => res.status(400).json('Unable to register!'))

	
		
		

	});
})




app.listen(3000, () => {
	console.log ('app is running on port 3000');
})



/*


bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});


*/