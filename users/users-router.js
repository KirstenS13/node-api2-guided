// SHORTCUT: highlight a word, press cmd + d to select the other instances (press as many times as needed), then can edit all at once

const express = require("express");
const users = require("./users-model")

// creates a standalone "mini" express application that we can merge with the main one in 'index.js'
const router = express.Router();

router.get("/users", (req, res) => {
    // send req.query if we want to sort the results
    users.find(req.query)
        .then((users) => {
            res.status(200).json(users)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving the users",
            })
        })
})

router.get("/users/:id", (req, res) => {
    users.findById(req.params.id)
        .then((user) => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: "User not found",
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving the user",
            })
        })
})

router.post("/users", (req, res) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({
            message: "Missing user name or email",
        })
    }

    users.add(req.body)
        .then((user) => {
            res.status(201).json(user)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error adding the user",
            })
        })
})

router.put("/users/:id", (req, res) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({
            message: "Missing user name or email",
        })
    }

    users.update(req.params.id, req.body)
        .then((user) => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: "The user could not be found",
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error updating the user",
            })
        })
})

router.delete("/users/:id", (req, res) => {
    users.remove(req.params.id)
        .then((count) => {
            if (count > 0) {
                res.status(200).json({
                    message: "The user has been nuked",
                })
            } else {
                res.status(404).json({
                    message: "The user could not be found",
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error removing the user",
            })
        })
})

// create endpoint that returns all the posts for a user
router.get("/users/:id/posts", (req, res) => {
    // these model functions return a promise, so we have to wait for the promise to resolve with ".then" or reject with ".catch"
    users.findUserPosts(req.params.id)
        .then((posts) => {
            // don't have to check to make sure "posts" exists, because it could potentially be an empty array and that's okay
            res.json(posts)
        })
        .catch((error) => {
            // we do not know what this error is
            // we don't want to leak sensitive information to the client, so send the client a generic error message, but console.log the error so we can see it
            // just log this error and send back a generic error response since we're not exactly sure what went wrong
            console.log(error);
            res.status(500).json({ message: "Could not get user posts" });
        })
})

// create endpoint that returns a single post for a user
router.get("/users/:userID/posts/:postID", (req, res) => {
    users.findUserPostById(req.params.userID, req.params.postID)
        .then((post) => {
            if (post) {
                res.json(post)
            } else {
                res.status(404).json({ message: "Post was not found for that user" })
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Could not get user post" })
        })
})

// create endpoint for adding a new post for a user
router.post("/users/:id/posts", (req, res) => {
    // don't continue if there is missing data
    if (!req.body.text) {
        // return this to stop execution
        return res.status(400).json({ message: "Please provide text for the post" })

        // return in order to stop execution of code, so that JS doesn't try to run code even if there is an error
        // could just return here, as below
        // return
    }
    
    // you can either send `req.body` directly, or specify each key individually
    // users.addUserPost(req.params.id, req.body)
    // remember to send the post as an object
    users.addUserPost(req.params.id, { text: req.body.text })
        .then((post) => {
            res.status(201).json(post)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Could not add post" })
        })
})

// CommonJS style exporting (an older way of doing exports)
// it's an older way of doing modules like in React (import/export)
module.exports = router;

// "require" is to "import" as "module.exports" is to "export"