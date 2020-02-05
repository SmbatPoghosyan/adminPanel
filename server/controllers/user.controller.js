const User = require('../models/user.model.js');

// Create and Save a new Branch
exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        User.find({username, password}).then(data => {
            if(!data[0]){
                res.status(404).send({
                    message: ""
                });
            } else if(data[0].username === 'superadmin') {
                return res.send({data: data[0],token: process.env.SUPERADMIN_TOKEN, success: true});
            } else {
                return res.send({data: data[0], success: true});
            }
        })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
};







