const express = require('express');
const bodyParser = require('body-parser');
const robotController = require('./robot-controller.js');

const app = express();
const port = 3000;

// Initiate a blank robot variable
let robot;

// Use express as middleware, serve files from public directory and allow parsing of message body with bodyParser middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up express to listen to POST request and process commands accordingly
app.post('/control', (req, res) => {
    const {command} = req.body;

    // Input data is in most cases split by space, so deconstruct
    const cmd = command.split(' ');

    // Based on the format and initialization status of the robot, figure out what to do. Also catch any errors thrown and return to UI
    try {
        if (robot === undefined) {
            // In this case, we can safely assume that it's first run and the robot is not born yet
            
            // Validate and sanity check, for this action command length must be exactly two (x and y)
            if (cmd.length !== 2) {
                throw new Error('Grid size must be defined as two integers separated by a space, such as "5 5"');
            }
            
            // The robot is born, and the grid is defined
            robot = new robotController(parseInt(cmd[0]), parseInt(cmd[1]));

            // Return the next instruction to UI
            res.json({status: 'Great, the grid size is ' + cmd[0] + ' ' + cmd[1] + '. Now, define starting position in the grid and an initial direction in which to face, such as "1 2 N".'});
        } else {
            // Check if robot coordinates have been set. Otherwise treat input as starting instructions
            let robotPosition = robot.getPosition();

            if (robotPosition.x === undefined || robotPosition.y === undefined || robotPosition.orientation === undefined ) {
                // Treat input as starting position
                // Validate and sanity check, for this action command length must be exactly three (x, y and orientation)
                if (cmd.length !== 3) {
                    throw new Error('Starting position must be defined as two integers and an orientation represented by one letter, all separated by spaces, such as "1 2 N"');
                }

                // Further validation will be made in the robot controller. Also parse the X and Y as integers.
                robotPosition = robot.setStartPosition(parseInt(cmd[0]), parseInt(cmd[1]), cmd[2].toUpperCase());
            } else {
                // Treat input as navigational instructions.
                // Since this step takes a string of L/R/F characters we'll be polite and use the whole instructions variable, in case someone decides to segment it with spaces
                // Also let's make it uppercase
                const instructions = cmd.join('').toUpperCase();

                // Then make sure it's only containing F, L or R
                if (!instructions.match("[FLR]+")) {
                    throw new Error('Navigation instruction can only contain F for Forward, L for Left and R for Right. Right?');
                }

                // Now the input is sane enough to pass to the robot. But remember, if the robot walks off the edge, it dies and the program should also die.
                robotPosition = robot.navigate(instructions);
            }
            
            // If all goes well, return position to the UI
            res.json({status: 'The robot now has a position of ' + robotPosition.x + ' ' + robotPosition.y + ' and is facing ' + robotPosition.orientation + '.<br /><br />Where do you want to go next? Input F for Forwards, R for turn Right, L for turn Left, after one another without spacing to string a command together.'});
        }
    } catch (error) {
        res.status(400).json({status: error.message});

        // If the cause of the error is death by walking off grid, also kill the process
        if(error.cause === 'death') {
            process.exit();
        }
    }
});

// Set app up to listen
app.listen(port, () => {
    console.log('Robot controller listening at http://localhost:' + port);
});