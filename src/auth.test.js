import { clearV1 } from './other.js';
import { authRegisterV1, authLoginV1 } from './auth.js';
import { getData, setData } from './dataStore.js';


describe ('Testing authRegister function', () => {
    afterEach(() => {
        clearV1();
    });

    test('Testing successful registration', () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana'); 
        expect(user).toStrictEqual({authUserId: expect.any(Number)});
    });
    
    test('Testing successful registration (Removing Non alpha-Numeric)', () => {    
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya12$#', 'Rana31');
        expect(user).toStrictEqual({authUserId: expect.any(Number)});
    });
    test('Testing successful registration (Multiple Users, Unique ID)', () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        const user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        expect(user).toStrictEqual({authUserId: expect.any(Number)});
        expect(user2).toStrictEqual({authUserId: expect.any(Number)});
        expect(user2).not.toBe(user);
    });

    test('Testing failed registration (password being too short)', () => {
        const user = authRegisterV1('example@gmail.com', 'ABC12', 'Aditya', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test('Testing failed registration Invalid email', () => {
        const user = authRegisterV1('examplegmail.comm', 'ABC12', 'Aditya', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test('Testing failed registration (email already used by another user)', () => {
        const user = authRegisterV1('example2@gmail.com', 'ABCD12', 'Aditya', 'Rana');
        const user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
        expect(user2).toStrictEqual({error: expect.any(String)});
    });

    test('Testing Failed registration (no first name)', () => {
        const user = authRegisterV1('example@gmail.com', 'ABC123', '', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test('Testing failed registration (no surname)', () => {
        const user = authRegisterV1('example@gmail.com', 'ABC123', 'Aditya', '');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test ('Testing failed registration (name is too long)', () => {
        const user = authRegisterV1('example@gmail.com', 'ABC123', 'Adityasdqwasdasdqed12341dsacdacasdadw13ascqavrsdfsa', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });
    
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