const express   = require("express"),
    router      = express.Router(),
    Feed        = require("../models/Feed");

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
    Feed.findMany();
});

// GET route. Fetch the object (Specific by author)
router.get("/author/:authorID", (req, res) => {
    Feed.findMany({author:req.params.authorID}, (err, authorFeeds) => {
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
