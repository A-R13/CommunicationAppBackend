import { clearV1 } from './other.js';
import { authRegisterV1, authLoginV1 } from './auth.js';
import { getData, setData } from './dataStore.js';


afterEach(() => {
    clearV1();
});

describe ('Testing authLogin function', () => {

    // Testing login details are valid (registered)
    test('Testing successful login', () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang')
        const login = authLoginV1('example@gmail.com', 'ABCD1234');
        expect(login).toStrictEqual({authUserId: expect.any(Number)});
    });

    // Email and password are valid/registered, but don't match (for different users)
    test("Testing failed login (registered email and password don't match)", () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
        const user2 = authRegisterV1('example2@gmail.com', 'WXYZ5678', 'Aditya', 'Rana12');
        const login = authLoginV1('example@gmail.com', 'WXYZ5678');
        expect(login).toStrictEqual({error: expect.any(String)});
    })

    // Email (right) / Password (does not exist)
    test("Testing failed login (password does not exist)", () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang'); 
        const login = authLoginV1('example@gmail.com', 'QWERTY');
        expect(login).toStrictEqual({error: expect.any(String)});
    });

    // Email (right) / Password (no input)
    test("Testing failed login (password is empty input)", () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
        const login = authLoginV1('example@gmail.com', '');
        expect(login).toStrictEqual({error: expect.any(String)});
    });
    // Email (does not exist) / Password (null)
    test("Testing failed login (email does not exist)", () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
        const login = authLoginV1('csesoc@gmail.com', 'ABCD1234');
        expect(login).toStrictEqual({error: expect.any(String)});
    });
    // Email (no input) / Password (null)
    test("Testing failed login (email is empty input)", () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
        const login = authLoginV1('', 'ABCD1234');
        expect(login).toStrictEqual({error: expect.any(String)});
    });
});