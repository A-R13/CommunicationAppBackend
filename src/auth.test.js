import { clearV1 } from './other';
import { authRegisterV1 } from './auth.js';
import { getData, setData } from './dataStore';

describe ('Testing authRegister function', () => {

    test('Testing successful registration', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
        expect(user).toEqual(user.authUserId);
    });

    test('Testing successful registration (Numbers in name)', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        expect(user).toEqual(user.authUserId);
    });

    test('Testing failed registration (password being too short)', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABC12', 'Aditya', 'Rana');
        expect(user).toStrictEqual({error: 'error'});
    });

    test('Testing failed registration Invalid email', () => {
        clearV1();
        const user = authRegisterV1('examplegmail.comm', 'ABC12', 'Aditya', 'Rana');
        expect(user).toStrictEqual({error: 'error'});
    });

    test('Testing failed registration (email already used by another user)', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABCD12', 'Aditya', 'Rana');
        const user2 = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
        expect(user2).toStrictEqual({error: 'error'});
    });

    test('Testing Failed registration (no first name)', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABC123', '', 'Rana');
        expect(user).toStrictEqual({error: 'error'});
    });

    test('Testing failed registration (no surname)', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABC123', 'Aditya', '');
        expect(user).toStrictEqual({error: 'error'});
    });

    test ('Testing failed registration (name is too long)', () => {
        clearV1();
        const user = authRegisterV1('example@gmail.com', 'ABC123', 'Adityasdqwasdasdqed12341dsacdacasdadw13ascqavrsdfsa', 'Rana');
        expect(user).toStrictEqual({error: 'error'});
    });

});