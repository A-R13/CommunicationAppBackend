import { getData, setData } from './dataStore';
import { userProfileV1 } from './users';

describe("Testing for userProfileV1", () => {
    test("Base case", () => {
        const base_data = {
            'users': [
                {   'uid': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'user_handle' : 'user1last1',
                },
                ],
            'channels': [
                {   'uId': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        /** input a data point from getData*/
        expect(userProfileV1(1,1)).toStrictEqual(
            {   'uid': 1,
                'email' : "user1@ad.unsw.edu.au",
                'nameFirst' : 'user1',
                'nameLast' : 'last1',
                'user_handle' : 'user1last1',
            },
        );
    });

    test("uId doesnt refer to valid  user", () => {
        const base_data = {
            'users': [
                {   'uid': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'user_handle' : 'user1last1',
                },
                ],
            'channels': [
                {   'uId': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        expect(userProfileV1(1, 2)).toStrictEqual({error: 'error'});
    });


    test("authUserId is invalid test", () => {
        const base_data = {
            'users': [
                {   'uid': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'user_handle' : 'user1last1',
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
                {   'uid': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'user_handle' : 'user1last1',
                },
                {   'uid': 2,
                    'email' : "user2@ad.unsw.edu.au",
                    'nameFirst' : 'user2',
                    'nameLast' : 'last2',
                    'user_handle' : 'user2last2',
                },
                {   'uid': 3,
                    'email' : "user3@ad.unsw.edu.au",
                    'nameFirst' : 'user3',
                    'nameLast' : 'last3',
                    'user_handle' : 'user1last3',
                },
                {   'uid': 4,
                    'email' : "user4@ad.unsw.edu.au",
                    'nameFirst' : 'user4',
                    'nameLast' : 'last4',
                    'user_handle' : 'user1last4',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        expect(userProfileV1(2,2)).toStrictEqual(
            {   
            'uid': 2,
            'email' : "user2@ad.unsw.edu.au",
            'nameFirst' : 'user2',
            'nameLast' : 'last2',
            'user_handle' : 'user2last2',
            },
        );

    });

    test("AuthuserId doesnt match uID", () => {
        const base_data = {
            'users': [
                {   'uid': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'user_handle' : 'user1last1',
                },
                {   'uid': 2,
                    'email' : "user2@ad.unsw.edu.au",
                    'nameFirst' : 'user2',
                    'nameLast' : 'last2',
                    'user_handle' : 'user2last2',
                },
                {   'uid': 3,
                    'email' : "user3@ad.unsw.edu.au",
                    'nameFirst' : 'user3',
                    'nameLast' : 'last3',
                    'user_handle' : 'user1last3',
                },
                {   'uid': 4,
                    'email' : "user4@ad.unsw.edu.au",
                    'nameFirst' : 'user4',
                    'nameLast' : 'last4',
                    'user_handle' : 'user1last4',
                },
                ],
            'channels': [
                {   'uId': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        expect(userProfileV1(1, 2)).toStrictEqual({error: 'error'});

    });

    test("AuthuserId is invalid", () => {
        const base_data = {
            'users': [
                {   'uid': 1,
                    'email' : "user1@ad.unsw.edu.au",
                    'nameFirst' : 'user1',
                    'nameLast' : 'last1',
                    'user_handle' : 'user1last1',
                },
                {   'uid': 2,
                    'email' : "user2@ad.unsw.edu.au",
                    'nameFirst' : 'user2',
                    'nameLast' : 'last2',
                    'user_handle' : 'user2last2',
                },
                {   'uid': 3,
                    'email' : "user3@ad.unsw.edu.au",
                    'nameFirst' : 'user3',
                    'nameLast' : 'last3',
                    'user_handle' : 'user1last3',
                },
                {   'uid': 4,
                    'email' : "user4@ad.unsw.edu.au",
                    'nameFirst' : 'user4',
                    'nameLast' : 'last4',
                    'user_handle' : 'user1last4',
                },
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ],
        };

        setData(base_data);
        expect(userProfileV1(5, 1)).toStrictEqual({error: 'error'});

    });

});
