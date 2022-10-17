import validator from "validator";
import { getData, setData } from './dataStore';
import { clearV1, getChannel, getAuthUserId, getUId } from './other';

/**
 * <Description: Given a valid email, password, first name and last name, this function will create a user account and return a unique id .>
 * @param {string} email - valid email id for user 
 * @param {string} password - valid password for user
 * @param {string} first name - valid first name for user
 * @param {string} last name  - valid last name for user
 * @returns {number} authUserId - unique Id of the user
 */

export function authRegisterV2(email: string, password: string, nameFirst: string, nameLast: string): any {
    let data = getData();
    // checks whether email, password, first name and last name are valid
    if (!validator.isEmail(email) || password.length < 6 || nameFirst.length < 1 || 
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

authRegisterV2('ad@gmail.com', 'asdasdad', 'asdad', 'asdads');

/**
 * <Description: Given a registered user's email and password, returns their authUserId value.>
 * @param {string} email
 * @param {string} password 
 * @returns {number} authUserId - unique Id of the user
 */
export function authLoginV2(email, password) {

    const data = getData();
    const array = data.users;
    for (const num in array) {
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
