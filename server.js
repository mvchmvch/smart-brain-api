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
	
	pg('users').where('id', '=', id)
	.increment('entries',1) 
	.returning('entries')
	.then(entries => {
		if (entries.length) {
			res.json(entries[0])
		} else {
			res.status(404).json('unable to get entries')
		}
	}) 
	.catch (err => res.status(404).json('unable to get entries'))
})



app.post('/signin', (req, resp) => {

	pg.select('email', 'hash')
	.from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
		if(isValid) {
			return pg.select('*').from('users')
				.where('email', '=', req.body.email)
				.then (user => {
					resp.json(user[0])	
				})
				.catch(err => {
					resp.status(400).json('error logging in')
				})
		} else {
			resp.status(400).json('wrong credentials')
		}
	})
	.catch(err => {
		resp.status(400).json('error logging in')
	})
})

app.post('/register', (req, res) => {
	
	const {email, name, password} = req.body;

	const hash = bcrypt.hashSync(password);
	pg.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning ('*')
			.insert({
				email:email,
				name:name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0])	
			}) 
			
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to register!'))
})



app.listen(3000, () => {
	console.log ('app is running on port 3000');
})

