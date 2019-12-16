const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
 apiKey: '454dfe2690d64122815a1ad8a6ed3267'
});


const handleApiCall = (req, res) => {

	console.log(req.body.input)
	clarifaiApp.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data)
		})
		.catch (err =>{
			console.log(err)
			res.status(404).json('unable to work with API')
		})

}

const handleImage =  (req, res, pg)  => 
{
	
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
}

module.exports = {
	handleImage,
	handleApiCall
}