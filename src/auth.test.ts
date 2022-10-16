import request, { HttpVerb } from 'sync-request';
import config from './config.json';
import { requestHelper } from './other';

const OK = 200;
const port = config.port;
const url = config.url;


// Function Wrappers using above function NOT WORKING RN
function requestClear() {
    return requestHelper('DELETE', '/clear/v1', {});
  }

function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
    return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}


requestClear(); // Need to call it here before calling it in the beforeEach for some reason.

describe ('Testing authRegister function', () => {
    
    beforeEach(() => {
        requestClear();
    });
    
    test('Testing successful registration', () => {
        const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana'); 
        expect(user).toStrictEqual({authUserId: expect.any(Number)});
    });
   
    test('Testing successful registration (Removing Non alpha-Numeric)', () => {    
        const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya12$#', 'Rana31');
        expect(user).toStrictEqual({authUserId: expect.any(Number)});
    });
    test('Testing successful registration (Multiple Users, Unique ID)', () => {
        const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        const user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        expect(user).toStrictEqual({authUserId: expect.any(Number)});
        expect(user2).toStrictEqual({authUserId: expect.any(Number)});
        expect(user2).not.toBe(user);
    });

    test('Testing failed registration (password being too short)', () => {
        const user = requestAuthRegister('example@gmail.com', 'ABC12', 'Aditya', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test('Testing failed registration Invalid email', () => {
        const user = requestAuthRegister('examplegmail.comm', 'ABC12', 'Aditya', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test('Testing failed registration (email already used by another user)', () => {
        const user = requestAuthRegister('example2@gmail.com', 'ABCD12', 'Aditya', 'Rana');
        const user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
        expect(user2).toStrictEqual({error: expect.any(String)});
    });

    test('Testing Failed registration (no first name)', () => {
        const user = requestAuthRegister('example@gmail.com', 'ABC123', '', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test('Testing failed registration (no surname)', () => {
        const user = requestAuthRegister('example@gmail.com', 'ABC123', 'Aditya', '');
        expect(user).toStrictEqual({error: expect.any(String)});
    });

    test ('Testing failed registration (name is too long)', () => {
        const user = requestAuthRegister('example@gmail.com', 'ABC123', 'Adityasdqwasdasdqed12341dsacdacasdadw13ascqavrsdfsa', 'Rana');
        expect(user).toStrictEqual({error: expect.any(String)});
    });
});

/*
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

    // Email (does not exist) / Password (null)
    test("Testing failed login (email does not exist)", () => {
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
        const login = authLoginV1('csesoc@gmail.com', 'ABCD1234');
        expect(login).toStrictEqual({error: expect.any(String)});
    });

});
*/