import validator from "validator";
import { getData, setData } from "./dataStore.js";
import { clearV1 } from './other.js';

export function authRegisterV1(email, password, nameFirst, nameLast) {
    let data = getData();
    // checks whether email, password, first name and last name are valid
    if (!validator.isEmail(email) || password.length < 6 || password.length > 32 || nameFirst.length < 1 || 
        nameFirst.length > 50 || nameLast.length < 1 || nameLast.length > 50) {
            return {
                error: 'Invalid Details.'
            }
    }
    // checks whether email is already in use by another user
    if (data.users.find(users => users.email === email)){
        return{
            error: 'Email in Use.'
        }
    }

    // create user handle 
    let user_handle = (nameFirst.toLowerCase() + nameLast.toLowerCase()).replace(/[^a-z0-9]/gi, '');
    
    if (user_handle.length > 20){
        user_handle = user_handle.substring(0, 20);
    }
    
    // Check if user handle is taken
    if (data.users.find(users => users.user_handle === user_handle)){
        let counter = 0;
        // increment counter until a new unique handle is created
        while (data.users.find(users => users.user_handle === user_handle + counter)){
            counter ++;
        }
        user_handle = user_handle + counter;
    }
    let id = 0;
        // increment counter until a new unique handle is created
        while (data.users.find(users => users.authUserId === id)){
            id ++;
        }

    // Assign, push and set the data 
    data.users.push(
        {
            authUserId: id,
            user_handle: user_handle,
            email: email,
            password: password,
            nameFirst: nameFirst,
            nameLast: nameLast,
        }
    );

    setData(data);
    return { 

        authUserId: id
    }

}

/**
 * <Description: Given a registered user's email and password, returns their authUserId value.>
 * @param {string} email
 * @param {string} password 
 * @returns {number} authUserId - unique Id of the user
 */
export function authLoginV1(email, password) {

    const data = getData();
    const array = data.users;
    for (num in array) {
        if (array[num].email === email) {
            if (array[num].password === password) {
                return { authUserId: array[num].authUserId}; 
            } else {
                return { error: 'error' };
            }
        }
    }
    return { error: 'error' };

}

