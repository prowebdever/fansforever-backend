const fs = require('fs');
const healthCheckRouteHandler = (req, res) => {
	let result = fs.readFileSync("./win.txt", 'utf8')
	console.log(result)
  res.status(200).json({ message: 'Server is up!',data:result });
};

module.exports = {
  healthCheckRouteHandler,
};
