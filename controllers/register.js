

const handleRegister =  (req, res, pg, bcrypt)  => {
	
	const {email, name, password} = req.body;

	if(!name || !email || !password) {
		return res.status(400).json('Incorrect register data!')		
	}

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
}

module.exports = {
	handleRegister: handleRegister
}