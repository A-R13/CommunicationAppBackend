import { getData, setData } from './dataStore';
import { userProfileV1 } from './users';

describe("Testing for userProfileV1", () => {
    test("Example profile", () => {
        expect(userProfileV1(validId, validId)).toStrictEqual( {
            uid: validId,
            email: "validemail@gmail.com",
            nameFirst: "Jake",
            nameLast: "Renzella",
            handle: "jakerenzella"
        });
    });

    test("uId doesnt refer to valid  user", () => {
        expect(userProfileV1(validId, differentValidId)).toStrictEqual({error: 'error'});
    });

    test("authUserId is invalid test", () => {
        expect(userProfileV1(invalidId,validId)).toStrictEqual({error: 'error'});
    });


});