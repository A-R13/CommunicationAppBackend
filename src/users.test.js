import { getData, setData } from './dataStore';
import { userProfileV1 } from './users';

describe("Testing for userProfileV1", () => {
    test("Base case", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'handle' : 'user1last1',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        /** input a data point from getData*/
        expect(userProfileV1(1,1)).toStrictEqual(
            {   'id': 1,
                'email' : "user1@ad.unsw.edu.au",
                'nameFirst' : 'user1',
                'nameLast' : 'last1',
                'handle' : 'user1last1',
            },
        );
    });

    test("uId doesnt refer to valid  user", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'handle' : 'user1last1',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        expect(userProfileV1(1, 2)).toStrictEqual({error: 'error'});
    });


    test("authUserId is invalid test", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'handle' : 'user1last1',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        expect(userProfileV1(2, 1)).toStrictEqual({error: 'error'});
    });
    
    test("Testing a larger data base which runs", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'handle' : 'user1last1',
                },
                {   'id': 2,
                    'email' : "user2@ad.unsw.edu.au",
                    'nameFirst' : 'user2',
                    'nameLast' : 'last2',
                    'handle' : 'user2last2',
                },
                {   'id': 3,
                    'email' : "user3@ad.unsw.edu.au",
                    'nameFirst' : 'user3',
                    'nameLast' : 'last3',
                    'handle' : 'user1last3',
                },
                {   'id': 4,
                    'email' : "user4@ad.unsw.edu.au",
                    'nameFirst' : 'user4',
                    'nameLast' : 'last4',
                    'handle' : 'user1last4',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        expect(userProfileV1(2,2)).toStrictEqual(
            {   'id': 2,
            'email' : "user2@ad.unsw.edu.au",
            'nameFirst' : 'user2',
            'nameLast' : 'last2',
            'handle' : 'user2last2',
            },
        );

    });

    test("Testing a larger data base which fails", () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'handle' : 'user1last1',
                },
                {   'id': 2,
                    'email' : "user2@ad.unsw.edu.au",
                    'nameFirst' : 'user2',
                    'nameLast' : 'last2',
                    'handle' : 'user2last2',
                },
                {   'id': 3,
                    'email' : "user3@ad.unsw.edu.au",
                    'nameFirst' : 'user3',
                    'nameLast' : 'last3',
                    'handle' : 'user1last3',
                },
                {   'id': 4,
                    'email' : "user4@ad.unsw.edu.au",
                    'nameFirst' : 'user4',
                    'nameLast' : 'last4',
                    'handle' : 'user1last4',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        expect(userProfileV1(1, 2)).toStrictEqual({error: 'error'});

    });


});