import { getData, setData } from './dataStore.js';
import { authRegisterV1 } from './auth.js';

export function userProfileV1 (authUserId, uId ) {
    let data = getData();
    let check_authUserId = false;
    let check_uId = false;

    if (data.users.find(users => users.authUserId === authUserId)){
        check_authUserId = true;
    }

    if (data.users.find(users => users.authUserId === uId)){
        check_uId = true;
    }


    for (let authUserIdfinder of data.users) {
        if (check_authUserId === true && check_uId === true && authUserId === authUserIdfinder.authUserId && uId === authUserIdfinder.authUserId) {
            return {
                authUserId: authUserIdfinder.authUserId,
                user_handle: authUserIdfinder.user_handle,
                email: authUserIdfinder.email,
                nameFirst: authUserIdfinder.nameFirst,
                nameLast: authUserIdfinder.nameLast
            };
        } 
    };

    if (check_authUserId === false || check_uId === false) {
        return {error: 'error'};
    }

};

/*
const user1 = authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok").authUserId;
let data = getData();
console.log(user1);
console.log(data);

console.log(userProfileV1(user1,user1));
*/