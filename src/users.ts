import { getData, setData } from './dataStore';
import { authRegisterV2 } from './auth';
import { channelsCreateV2 } from './channels';
import { getChannel, getAuthUserId, getUId, getToken } from './other';

/**
 * <Description: Returns a users profile for a valid uId that is given to check>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {user}
 */


export function userProfileV2 (token : string, uId : number ) : any {
    let data = getData();
    let check_token = false;
    let check_uId = false;

    const userToken = getToken(token)

    if (userToken !== undefined) {
        check_token = true;
    }

    if (data.users.find(users => users.authUserId === uId)){
        check_uId = true;
    }

    for (let tokenFinder of data.users) {
        if (check_token === true && check_uId === true && uId === tokenFinder.authUserId) {
            return {
                user : {
                    uId: tokenFinder.authUserId,
                    email: tokenFinder.email,
                    nameFirst: tokenFinder.nameFirst,
                    nameLast: tokenFinder.nameLast,
                    handleStr: tokenFinder.user_handle,
                }

            };
        } 
    };

    if (check_token === false || check_uId === false) {

        return {error: 'error'};
    }

    

};

let data = getData();
authRegisterV2('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
authRegisterV2('exampl2e@gmail.com', 'ABCD1234', 'Geoff', 'Mok');

console.log(userProfileV2(data.users[0].sessions[0], 1));