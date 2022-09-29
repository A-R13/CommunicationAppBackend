import { clearV1 } from './other.js';
import { authRegisterV1 } from './auth.js';
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
