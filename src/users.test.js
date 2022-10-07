import { getData, setData } from './dataStore';
import { userProfileV1 } from './users';
import { clearV1, getAuthUserId, getChannel, getUId } from './other';
import { authRegisterV1 } from './auth';

describe("Testing for userProfileV1", () => {
    test("Base case", () => {

        const user1 = authRegisterV1("geoffrey1@email.com", "abcd1234", "Geoff1", "Mok1");


        /** input a data point from getData*/
        expect(userProfileV1(user1.authUserId, user1.authUserId)).toStrictEqual(
            {
                user: {
                  uId: 0,
                  email: 'geoffrey1@email.com',
                  nameFirst: 'Geoff1',
                  nameLast: 'Mok1',
                  handleStr: 'geoff1mok1'
                }
              }
        );
    });

    clearV1();

    test("uId doesnt refer to valid  user", () => {

        const user1 = authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");

        expect(userProfileV1(user1.authUserId, 2)).toStrictEqual({error: 'error'});
    });

    clearV1();


    test("authUserId is invalid test", () => {

        const user1 = authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");

        expect(userProfileV1(2, user1.authUserId)).toStrictEqual({error: 'error'});
    });
    
    test("Testing a larger data base which runs", () => {
        const user1 = authRegisterV1("geoffrey1@email.com", "abcd1234", "Geoff1", "Mok1");
        const user2 = authRegisterV1("geoffrey2@email.com", "abcd1234", "Geoff2", "Mok2");
        const user3 = authRegisterV1("geoffrey3@email.com", "abcd1234", "Geoff3", "Mok3");
        const user4 = authRegisterV1("geoffrey4@email.com", "abcd1234", "Geoff4", "Mok4");

        expect(userProfileV1(user3.authUserId, user2.authUserId)).toStrictEqual(
            {
                user: {
                  uId: user2.authUserId,
                  email: 'geoffrey2@email.com',
                  nameFirst: 'Geoff2',
                  nameLast: 'Mok2',
                  handleStr: 'geoff2mok2'
                }
              }
        );

    });

    test("uID isnt valid", () => {

        const user1 = authRegisterV1("geoffrey1@email.com", "abcd1234", "Geoff1", "Mok1");
        const user2 = authRegisterV1("geoffrey2@email.com", "abcd1234", "Geoff2", "Mok2");
        const user3 = authRegisterV1("geoffrey3@email.com", "abcd1234", "Geoff3", "Mok3");
        const user4 = authRegisterV1("geoffrey4@email.com", "abcd1234", "Geoff4", "Mok4");

        expect(userProfileV1(user2.authUserId, 5)).toStrictEqual({error: 'error'});

    });

    test("AuthuserId is invalid", () => {
        const user1 = authRegisterV1("geoffrey1@email.com", "abcd1234", "Geoff1", "Mok1");
        const user2 = authRegisterV1("geoffrey2@email.com", "abcd1234", "Geoff2", "Mok2");
        const user3 = authRegisterV1("geoffrey3@email.com", "abcd1234", "Geoff3", "Mok3");
        const user4 = authRegisterV1("geoffrey4@email.com", "abcd1234", "Geoff4", "Mok4");

        expect(userProfileV1(5, user2.authUserId)).toStrictEqual({error: 'error'});

    });

});