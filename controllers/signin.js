
const handleSignin =  (req, resp, pg, bcrypt)  => {

	const {email, password} = req.body;

	if(!email || !password) {
		return resp.status(400).json('Incorrect signin data!')		
	}

	pg.select('email', 'hash')
	.from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash)
		if(isValid) {
			return pg.select('*').from('users')
				.where('email', '=', email)
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
}



module.exports = {
	handleSignin: handleSignin
}