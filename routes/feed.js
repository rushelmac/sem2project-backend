const express   = require("express"),
    router      = express.Router(),
    {Feed}      = require("../models/Feed"),
    { User }    = require("../models/User");

// POST route. Create feed
router.post("/", (req, res) => {
    Feed.create(req.body.Feed, (err, createdFeed) => {
        if(err){
            return res.status(500).send({
                message: "Couldn't create database for feed"
            });
        }
        res.status(201).send(createdFeed);
    });
});

// GET route. fetch latest feeds. (Take argument from the params, filter feeds by target audience, sort by timestamp)
router.get("/all/:pageNo", (req, res) => {
    // Get the user id from request and fetch user object
    const client = User.findById(req.user.id);
    
    // Check its user type and branch (Currently branch and year not available in user model)
    // Fetch a range of feed according to pageNo (Currently sending all the feeds)  
    Feed.findMany({$where:{target_audience:client.user_role}}).toArray((err, foundFeeds) => {
        if(err){
            res.status(500).send({
                message: "Could'nt fetch the feeds"
            })
        }
        res.status(200).send(foundFeeds);
    });
});

// GET route. Fetch the object (Specific by author)
router.get("/author", (req, res) => {
    Feed.findMany({author:req.user.id}, (err, authorFeeds) => {
        if(err){
            return res.status(500).send({
                message: "Error finding given author feeds"
            });
        }
        res.status(200).send(authorFeeds);
    });
});

// GET route. Fetch the object (Specific by postID)
router.get("/:postID", (req, res) => {
    Feed.findByID(req.params.postID, (err, foundFeed) => {
        if(err){
            return res.status(500).send({
                message: "Internal server error"
            });
        }
        res.status(200).send(foundFeed);
    });
});

// UPDATE route. Update the feed (Only by author)
router.put("/:postID", (req, res) => {
    Feed.findByIDAndUpdate(req.params.postID, req.body.feed, (err, updatedFeed) => {
        if(err){
            return res.status(500).send({
                message: "Internal server error"
            });
        }
        res.status(200).send(updatedFeed);
    });
});

// DELETE route. Delete the feed (By author)
router.delete("/:postID", (req, res) => {
    Feed.findByIdAndDelete(req.params.postID, (err) => {
        if(err){
            return res.status(500).send({
                message: "There was an error deleting the feed"
            });
        }
        res.status(200).send({
            message: "Successfully deleted the post." 
        });
    });
});

module.exports = router;