const robotController = require('./robot-controller.js');

describe('robotController', () => {
    describe('constructor', () => {
        test('Should throw error for invalid grid size', () => {
            expect(() => new robotController(-1).toThrow());
        });

        test('Should throw error for invalid grid size when using non-numericals', () => {
            expect(() => new robotController('Q').toThrow());
        });

        test('Should create an instance of the RobotController to continue working with', () => {
            expect(() => new robotController(10).not.toThrow());
        });
    });

    describe('setStartPosition', () => {
        let robot;

        beforeEach(() => {
            robot = new robotController(10);
        });

        test('Should set start position correctly', () => {
            expect(robot.setStartPosition(1, 2, 'N')).toEqual({x: 1, y: 2, orientation: 'N'});
        });

        test('Should throw error for invalid starting position', () => {
            expect(() => robot.setStartPosition(-11, 5, 'N')).toThrow();
        });

        test('Should throw error for invalid orientation', () => {
            expect(() => robot.setStartPosition(0, 0, 'A')).toThrow();
        });
    });

    describe('navigate', () => {
        let robot;

        beforeEach(() => {
            robot = new robotController(10);
            robot.setStartPosition(0, 0, 'N');
        });

        test('Should navigate correctly with valid instructions', () => {
            expect(robot.navigate('VFFF')).toMatchObject({y: -3, orientation: 'W'});
        });

        test('Should throw error from invalid instruction character', () => {
            expect(() => robot.navigate('LFRRFP')).toThrow();
        });

        test('Should throw error and terminate for walking off the grid', () => {
            expect(() => robot.navigate('FFFFFFFFFFF')).toThrow();
        });

        test('Should throw error and terminate for walking off the grid', () => {
            expect(() => robot.navigate('HFFFFFFFFVFFFFFFF')).toThrow();
        });
    });
});