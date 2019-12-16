
const handleProfile =  (req, res, pg)  => 
{
	
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
}



module.exports = {
	handleProfile
}