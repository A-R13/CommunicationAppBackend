import request from 'sync-request';
import config from './config.json';



import { userProfileV2 } from './users';
import { clearV1, getAuthUserId, getChannel, getUId, requestHelper, requestClear } from './other';
import { authRegisterV2 } from './auth';

import { requestAuthRegister } from './auth.test';

export function requestUserProfile (token: string, uId: number) {
    return requestHelper('GET', '/user/profile/v2', { token, uId, });
}






describe("Testing for userProfileV2", () => {
    
    let user1;
    let user2;
    let user3;
    let user4;

    beforeEach(() => {
        requestClear();
        user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
        user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
        user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'geoff', 'Doe');
        user4 = requestAuthRegister('example4@gmail.com', 'ABCD1234', 'brian', 'Doe');

    })


    test("Base case", () => {

        /** input a data point from getData*/
        expect(requestUserProfile(user1.token, user1.authUserId)).toStrictEqual(
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

        expect(requestUserProfile(user3.token, user2.authUserId)).toStrictEqual(
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

        expect(requestUserProfile(user1.token, 4)).toStrictEqual({error: 'error'});
    });


    test("authUserId is invalid test", () => {


        expect(requestUserProfile("randomstring", user1.authUserId)).toStrictEqual({error: 'error'});
    });
    

    test("uID isnt valid", () => {

        expect(requestUserProfile(user2.token, 5)).toStrictEqual({error: 'error'});

    });

    test("AuthuserId is invalid", () => {

        expect(requestUserProfile("Randomstring", user2.authuserId)).toStrictEqual({error: 'error'});

    });

});