import { getData, setData } from './dataStore';
import { userProfileV1 } from './users';

describe("Testing for userProfileV1", () => {
    test("Example profile", () => {
        expect(userProfileV1(abcd,abcd)).toStrictEqual( {
            uid: abcd,
            email: "validemail@gmail.com",
            nameFirst: "Jake",
            nameLast: "Renzella",
            handle: "jakerenzella"
        });
    });

});