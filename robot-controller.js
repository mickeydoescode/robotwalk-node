module.exports = class RobotController {
    constructor(radius) {
        if (!Number.isInteger(radius) || radius < 0) {
            throw new Error('Grid radius must consist of a positive integer, for example 5');
        }
        
        // In this case, the room is a circle in which 0 0 is in the centre and we go from there and 0 angle is at 12 o clock
        this.maxRadius = radius;
        
        // It would be possible to modify the function to use directions such as "NW", "SE" etc by setting this to 45 instead of 90 and
        // adding the remaining angles if 45, 135, 225 and 315 to angleToDirection and directionToAngle support functions.
        this.angleStep = 90;

        this.directions = ['N', 'E', 'Ö', 'S', 'W', 'V'];
    }

    setStartPosition(startX = 0, startY = 0, startOrientation = 'N') {
        // Sanity check
        if (!Number.isInteger(startX) || !Number.isInteger(startY) || startX < 0 || startY < 0 || startX ** 2 + startY ** 2 > this.radius ** 2) {
            throw new Error('Starting position must be two positive integers within the room radius of ' + this.maxRadius);
        }

        if (!this.directions.includes(startOrientation)) {
            throw new Error('Starting direction must be a direction such as "N E S W" or "N Ö S V".');
        }

        this.x = startX;
        this.y = startY;
        this.orientation = this.directionToAngle(startOrientation);

        return this.getPosition();
    }

    navigate(instructions) {
        // Split the instruction into characters
        const commands = instructions.split('');

        for (let command of commands) {
            switch (command) {
                case 'V':
                case 'L':
                    this.turn(-this.angleStep);
                    break;
                case 'H':
                case 'R':
                    this.turn(this.angleStep);
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

    turn(angle) {
        // Update the orientation angle. Use trickery and modulus to normalize the angle
        this.orientation = (this.orientation + angle + 360) % 360;
    }

    moveForward() {
        // Move the robot forwards, depending on orientation
        // Also make sure that the little fellow doesn't wander off into the void, in that case it's game over

        // Convert the angle to radians in order to use trigonometric functions
        const angleInRadians = this.orientation * (Math.PI / 180);
        
        // Calculate delta
        const dx = Math.cos(angleInRadians);
        const dy = Math.sin(angleInRadians);

        // Add to existing coordinates
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Check to see that the new coordinates are within the radius of the room. If not then game over
        if ((newX ** 2 + newY ** 2) > this.maxRadius ** 2) {
            this.gameOver();
        } else {
            this.x = Math.round(newX);
            this.y = Math.round(newY);
        }
    }

    // Returns a direction instead of degrees
    angleToDirection() {
        switch (this.orientation) {
            case 0:
                return 'N';
            case 90:
                return 'E';
            case 180:
                return 'S';
            case 270:
                return 'W';
        }
    }

    // Returns an angle instead of direction
    directionToAngle(direction) {
        switch (direction) {
            case 'N':
                return 0;
            case 'Ö':
            case 'E':
                return 90;
            case 'S':
                return 180;
            case 'V':
            case 'W':
                return 270;
        }
    }

    getPosition() {
        return {x: this.x, y: this.y, orientation: this.angleToDirection(this.orientation)};
    }

    gameOver() {
        // Don't only throw a witty error, but also throw a cause which then will be used to exit the program entirely.
        throw new Error('Robot walked off the edge of the grid and sadly passed away. You must now restart the program.', {cause: 'death'});
    }
}