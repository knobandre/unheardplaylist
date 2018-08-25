const express = require('express');
const router = express.Router();

const User = require('../model/User');

router.get('/get', (req, res, next) => {
    // todo - .find is deprecated
    User.find((err, users) => {
        if (err) {
            return handleError(err);
        }
        res.status(200).json(users);
    });
});

router.post('/post', (req, res, next) => {
    let user = new User({
        name: req.body.name,
    });
    user.save((err, result) => {
        if (err) {
            return handleError(err);
        }
        res.status(200).json({msg: 'User created successfully', result});
    });
});

router.put('/put/:id', (req, res, next) => {
    User.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {name: req.body.name}}, 
        (err, result) => {
            if (err) {
                return handleError(err);
            }
            res.status(200).json({msg: 'User updated successfully', result});
        }
    );
});

router.delete('/delete/:id', (req, res, next) => {
    User.remove(
        {_id: req.params.id},
        (err, result) => {
            if (err) {
                return handleError(err);
            }
            res.status(200).json(result);
        }
    );
});

function handleError() {
    // todo
}

module.exports = router;