// import express
const express = require("express");

// make a new router
const router = express.Router();

// make the route handler
router.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API",
	})
})

// export the router
module.exports = router;