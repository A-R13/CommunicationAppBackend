import { getData, setData } from './dataStore.js';

export function userProfileV1 (authUserId, uId ) {
    let data = getData();
    let check_authUserId = false;
    let check_uId = false;

    if (data.users.find(users => users.uid === authUserId)){
        check_authUserId = true;
    }

    if (data.users.find(users => users.uid === uId)){
        check_uId = true;
    }


    for (let authUserIdfinder of data.users) {
        if (check_authUserId === true && check_uId === true && authUserId === authUserIdfinder.uid && uId == authUserIdfinder.uid) {
            return {
                uid: authUserIdfinder.uid,
                email: authUserIdfinder.email,
                nameFirst: authUserIdfinder.nameFirst,
                nameLast: authUserIdfinder.nameLast,
                user_handle: authUserIdfinder.user_handle,
            };
        } 
    };

    if (check_authUserId === false || check_uId === false || authUserId != uId) {
        return {error: 'error'};
    }

};
