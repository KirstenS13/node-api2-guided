// can make custom scripts in package.json under "scripts"
// run them by "npm run script-name"
// npm start NOT npm run start

// saving something as a devDependency keeps it separate from production level
// what's needed when developing aren't the same as what's needed for production

const express = require("express")
// import routers
const usersRouter = require("./users/users-router");
const welcomeRouter = require("./welcome/welcome-router");

const server = express()
const port = 4000

server.use(express.json())
// attach the routers to this main server
server.use(usersRouter)
server.use(welcomeRouter)

// moved the welcome endpoint to welcome-router.js

// moved the user endpoints to users-router.js



server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
