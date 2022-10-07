import { getData, setData } from './dataStore.js';
import { authRegisterV1 } from './auth.js';
import { channelsCreateV1 } from './channels.js';
import { getChannel, getAuthUserId, getUId } from './other.js';

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
        if (check_authUserId === true && check_uId === true && uId === authUserIdfinder.authUserId) {
            return {
                user : {
                    uId: authUserIdfinder.authUserId,
                    email: authUserIdfinder.email,
                    nameFirst: authUserIdfinder.nameFirst,
                    nameLast: authUserIdfinder.nameLast,
                    handleStr: authUserIdfinder.user_handle,
                }

            };
        } 
    };

    if (check_authUserId === false || check_uId === false) {
        return {error: 'error'};
    }

};
