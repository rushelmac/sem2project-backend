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

