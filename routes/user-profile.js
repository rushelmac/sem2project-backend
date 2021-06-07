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
router.put('/user-profile');
// Delete
router.delete('/user-profile');

module.exports = router;