module.exports = class RobotController {
    constructor(width, height) {
        if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0) {
            throw new Error('Grid size must consist of two positive integers, for example 5 5');
        }

        this.width = width;
        this.height = height;

        this.directions = ['N', 'E', 'S', 'W'];

        // Note that the grid is oriented in such a way that 0 0 is in the South-West corner.
    }

    setStartPosition(startX = 0, startY = 0, startOrientation = 'N') {
        // Sanity check
        if (!Number.isInteger(startX) || !Number.isInteger(startY) || startX < 0 || startY < 0 || startX > this.width || startY > this.height) {
            throw new Error('Starting position must be a positive integer smaller than or equal to the room size of ' + this.width + ' ' + this.height);
        }

        if (!this.directions.includes(startOrientation)) {
            throw new Error('Starting direction must be a direction such as "N E S W".');
        }

        this.x = startX;
        this.y = startY;
        this.orientation = startOrientation;

        return this.getPosition();
    }

    navigate(instructions) {
        // Split the instruction into characters
        const commands = instructions.split('');

        for (let command of commands) {
            switch (command) {
                case 'L':
                    this.turnLeft();
                    break;
                case 'R':
                    this.turnRight();
                    break;
                case 'F':
                    this.moveForward();
                    break;
                default:
                    throw new Error('Invalid positioning command: ' + command);
            }
        }

        return this.getPosition();
    }

    turnLeft() {
        // Use the orientation index to represent the directions as numbers in order to calculate new position
        let currentOrientationIndex = this.directions.indexOf(this.orientation);
        this.orientation = this.directions[(currentOrientationIndex + 3) % 4];
    }

    turnRight() {
        // Use the orientation index to represent the directions as numbers in order to calculate new position
        let currentOrientationIndex = this.directions.indexOf(this.orientation);
        this.orientation = this.directions[(currentOrientationIndex + 1) % 4];
    }

    moveForward() {
        // Move the robot forwards, depending on orientation
        // Also make sure that the little fellow doesn't wander off into the void, in that case it's game over
        switch (this.orientation) {
            case 'N':
                if (++this.y > this.height) {
                    this.gameOver();
                }
                break;
            case 'E':
                if (++this.x > this.width) {
                    this.gameOver();
                }
                break;
            case 'S':
                if (--this.y < 0) {
                    this.gameOver();
                }
                break;
            case 'W':
                if (--this.x < 0) {
                    this.gameOver();
                }
                break;
        }
    }

    getPosition() {
        return {x: this.x, y: this.y, orientation: this.orientation};
    }

    gameOver() {
        // Don't only throw a witty error, but also throw a cause which then will be used to exit the program entirely.
        throw new Error('Robot walked off the edge of the grid and sadly passed away. You must now restart the program.', {cause: 'death'});
    }
}