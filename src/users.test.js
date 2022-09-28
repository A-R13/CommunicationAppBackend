import { getData, setData } from './dataStore';
import { clearV1 } from './other';
import { userProfileV1 } from './users';

describe("Testing for userProfileV1", () => {
    test("Base case", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'name' : 'user1',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        const pushed_data = getData();
        /** input a data point from getData*/
        expect(userProfileV1(1,1)).toStrictEqual(
            {   'id': 1,
                'name' : 'user1',
            },
        );
    });

    clearV1();

    test("uId doesnt refer to valid  user", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'name' : 'user1',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        const pushed_data = getData();
        expect(userProfileV1(1, 2)).toStrictEqual({error: 'error'});
    });

    clearV1();

    test("authUserId is invalid test", () => {
        expect(userProfileV1(2,1)).toStrictEqual({error: 'error'});
    });

    clearV1();
    

    test("Testing a larger data base which runs", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'name' : 'user1',
                },
                {   'id': 2,
                    'name' : 'user2',
                },
                {   'id': 3,
                    'name' : 'user3',
                },
                {   'id': 4,
                    'name' : 'user4',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        const pushed_data = getData();
        expect(userProfileV1(2,2)).toStrictEqual(
            {   'id': 1,
                'name' : 'user1',
            },
        );

    });

    test("Testing a larger data base which fails", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'name' : 'user1',
                },
                {   'id': 2,
                    'name' : 'user2',
                },
                {   'id': 3,
                    'name' : 'user3',
                },
                {   'id': 4,
                    'name' : 'user4',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        const pushed_data = getData();
        expect(userProfileV1(1, 2)).toStrictEqual({error: 'error'});

    });


});