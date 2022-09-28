import { clearV1 } from './other.js';
import { authRegisterV1 } from './auth.js';
import { getData, setData } from './dataStore.js';

describe ('Testing authRegister function', () => {

    test('Testing successful registration', () => {
        //const data = getData();
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
        const data = getData();
        expect(user.authUserId).toEqual(data.users[user.authUserId]);  
        clearV1();     
    });

    test('Testing successful registration (Numbers in name)', () => {
        //const data = getData();
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        const data = getData();
        
        expect(user.authUserId).toEqual(data.users[user.authUserId]);
        clearV1();
        
    });
    test('Testing successful registration (Numbers in name)', () => {
        //const data = getData();
        const user = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        const user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        const user3 = authRegisterV1('example3@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
        const data = getData();
        expect(user.authUserId).toEqual(data.users[user.authUserId]);
        expect(user2.authUserId).toEqual(data.users[user2.authUserId]);        
        expect(user3.authUserId).toEqual(data.users[user3.authUserId]);
        clearV1();
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