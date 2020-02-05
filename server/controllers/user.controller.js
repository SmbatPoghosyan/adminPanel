const User = require('../models/user.model.js');

// Create and Save a new Branch
exports.login = (req, res) => {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password)
    if (username && password) {
        User.find({username, password}).then(data => {
            if(!data[0]){
                return res.status(404).send({
                    message: "Wrong login or password"
                });
            } else if(data[0].username === 'superadmin') {
                return res.send({data: data[0],token: process.env.SUPERADMIN_TOKEN});
            } else {
                return res.send(data[0]);
            }
        })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
};







