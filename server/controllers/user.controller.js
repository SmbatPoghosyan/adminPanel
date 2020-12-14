const User = require('../models/user.model.js');

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
        res.send({message: 'Please enter Username and Password!'});
        res.end();
    }
};

exports.list = (req, res) => {
    User.find({ "username": { "$ne": 'superadmin' } }).then(data => {
        return res.send({data, success: true});
    })
};

exports.create = async (req, res) => {
    console.log(req.body);
    if(req.body.token && req.body.token === process.env.SUPERADMIN_TOKEN){
        if(!req.body.username) {
            return res.status(400).send({
                message: "Username can not be empty"
            });
        }
        if(!req.body.password) {
            return res.status(400).send({
                message: "Password can not be empty"
            });
        }

        const isUser = await User.findOne({username: req.body.username});

        if (isUser) {
            return res.status(400).send({
                message: "Username already exist"
            });
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.save()
          .then(data => {
              res.send({data, message: "You successfully create new user!"});
          }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user."
            });
        });
    } else {
        return res.status(401).send({
            message: "You don’t have permission"
        });
    }
};

exports.update = async (req, res) => {
    const data = {};
    if (req.body.username) {
        data.username = req.body.username;
    }
    if (req.body.password) {
        if (req.body.oldpassword) {
            const user = await User.findById(req.params.id);
            console.log(user);
            if(user.password !== req.body.oldpassword) {
                return res.status(400).send({message: "Wrong old password."});
            }
            data.password = req.body.password;
        }  else {
            return res.status(400).send({message: "Old password is required to change password."});
        }
    }

    const isUser = await User.findOne({username: req.body.username});


    if (isUser && isUser.id !== req.params.id) {
        return res.status(400).send({
            message: "Username already exist"
        });
    }

    User.findByIdAndUpdate(req.params.id, data, {new: true})
      .then(user => {
          console.log(user, "jhjghj");
          if(!user) {
              return res.status(404).send({
                  message: "User not found with id " + req.params.id
              });
          }
          return res.status(200).send({user, message: "You successfully update user!"});
      }).catch(err => {
          console.log(err)
        if(err) {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.id
            });
        }
      });
};

exports.delete = (req, res) => {
    console.log(req.query)
    if (req.query.token && req.query.token === process.env.SUPERADMIN_TOKEN) {
        User.findByIdAndRemove(req.params.id)
          .then(user => {
              if(!user) {
                  return res.status(404).send({
                      message: "User not found with id " + req.params.id
                  });
              }
              return res.status(200).send({message: 'User deleted successfully!'});
          }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.id
            });
        });
    } else {
        return res.status(401).send({
            message: "You don’t have permission"
        });
    }
};






