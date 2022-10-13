import { getData, setData } from './dataStore';
import { userProfileV1 } from './users';
import { clearV1, getAuthUserId, getChannel, getUId } from './other';
import { authRegisterV1 } from './auth';

describe("Testing for userProfileV1", () => {
    
    let user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
    let user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    let user3 = authRegisterV1('example3@gmail.com', 'ABCD1234', 'geoff', 'Doe');
    let user4 = authRegisterV1('example4@gmail.com', 'ABCD1234', 'brian', 'Doe');


    test("Base case", () => {

        /** input a data point from getData*/
        expect(userProfileV1(user1.authUserId, user1.authUserId)).toStrictEqual(
            {
                user: {
                  uId: 0,
                  email: 'example1@gmail.com',
                  nameFirst: 'nicole',
                  nameLast: 'Doe',
                  handleStr: 'nicoledoe'
                }
              }
        );
    });

    test("Testing a larger data base which runs", () => {

        expect(userProfileV1(user3.authUserId, user2.authUserId)).toStrictEqual(
            {
                user: {
                  uId: 1,
                  email: 'example2@gmail.com',
                  nameFirst: 'Bob',
                  nameLast: 'Doe',
                  handleStr: 'bobdoe',
                }
              }
        );
    });

    test("uId doesnt refer to valid  user", () => {

        expect(userProfileV1(user1.authUserId, 4)).toStrictEqual({error: 'error'});
    });


    test("authUserId is invalid test", () => {


        expect(userProfileV1(5, user1.authUserId)).toStrictEqual({error: 'error'});
    });
    

    test("uID isnt valid", () => {

        expect(userProfileV1(user2.authUserId, 5)).toStrictEqual({error: 'error'});

    });

    test("AuthuserId is invalid", () => {

        expect(userProfileV1(5, user2.authUserId)).toStrictEqual({error: 'error'});

    });

});