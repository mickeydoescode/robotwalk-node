# robotwalk-node

A simple demonstration of a front-end controlling a node.js based back-end

## Starting the program

To start the program, run `npm start` at the command line.

This will run an express web server hosting the controller interface.

To access the interface, open your browser and go to `http://localhost:3000`

## Testing the program

To start testing using Jest, run `npm test` at the command line.

This will execute testing on the RobotController class that contains robot movement logic and robot state.

## Code notes

A decision was made to utilize a web frontend for ease of use, where the commands would be sent in stages in order to properly check input and set state in the right order, and also to be a bit more verbose and user-friendly. The program could just as easily be made to run only in the console listening to commands through `readline` using `stdin`.

The program is intentionally made to allow for grid sizes up to "maxInt", and to simplify a bit floats will be crudely parsed as integers.

As expandability goes, the front- and back-end could trivially be modified to allow for graphical representation of the grid and the position and orientation of the robot by also returning the grid size in addition to position. The front-end can then render according to this information.