const express   = require('express'),
router      = express.Router(),
{ userProfile } = require('../models/userProfile');



// Create
router.post('/user-profile', (req, res) => {
    userProfile.create(req.body, (err, createdProfile) => {
        if(err) return res.status(500).send({message: "Couldn't create user profile"});
        createdProfile.user_id = req.user._id;
        createdProfile.save();
        res.status(200).send({message: "Profile created"});
    });
});

// Read
router.get('/user-profile/:id', (req, res) => {
    userProfile.findOne({"user_id":req.params.id}, (err, foundProfile) => {
        if(err) return res.status(204).send(err);
        res.send(foundProfile);
    });
});

// Update
router.put('/user-profile',  (req, res) => {
    userProfile.findOneAndUpdate({"user_id": req.user._id}, req.body, (err, updatedProfile) => {
        if(err) return res.send(err);
        res.status(200).send({message: "Profile updated", updatedProfile});
    });
});

// Delete
router.delete('/user-profile', (req, res) => {
    userProfile.findOneAndDelete({"user_id": req.user._id}, (err) => {
        if(err) return res.send(err);
        res.status(200).send({message: "Profile Deleted"});
    });
});

module.exports = router;