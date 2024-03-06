const robotController = require('./robot-controller.js');

describe('robotController', () => {
    describe('constructor', () => {
        test('Should throw error for invalid grid size', () => {
            expect(() => new RobotController(-1, 5).toThrow());
        });

        test('Should throw error for invalid grid size when using non-numericals', () => {
            expect(() => new RobotController('Q', 3).toThrow());
        });

        test('Should create an instance of the RobotController to continue working with', () => {
            expect(() => new RobotController(5, 5).not.toThrow());
        });
    });

    describe('setStartPosition', () => {
        let robot;

        beforeEach(() => {
            robot = new robotController(5, 5);
        });

        test('Should set start position correctly', () => {
            expect(robot.setStartPosition(1, 1, 'N')).toEqual({x: 1, y: 1, orientation: 'N'});
        });

        test('Should throw error for invalid starting position', () => {
            expect(() => robot.setStartPosition(-1, 5, 'N')).toThrow();
        });

        test('Should throw error for invalid orientation', () => {
            expect(() => robot.setStartPosition(0, 0, 'A')).toThrow('Starting direction must be a direction such as "N E S W".');
        });
    });

    describe('navigate', () => {
        let robot;

        beforeEach(() => {
            robot = new robotController(5, 5);
            robot.setStartPosition(1, 2, 'N');
        });

        test('Should navigate correctly with valid instructions', () => {
            expect(robot.navigate('LLFFRF')).toEqual({x: 0, y: 0, orientation: 'W'});
        });

        test('Should throw error from invalid instruction character', () => {
            expect(() => robot.navigate('LFRRFP')).toThrow();
        });

        test('Should throw error and terminate for walking off the grid', () => {
            expect(() => robot.navigate('FFFFFFFFFF')).toThrow('Robot walked off the edge of the grid and sadly passed away. You must now restart the program.');
        });
    });
});