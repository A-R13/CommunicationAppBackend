import { getData } from './dataStore.js';

export function userProfileV1 (authUserId, uId ) {

    let data = getData();

    /**Need to do errors */

    for (let authUserIdfinder of data.users) {

        if (authUserId === authUserIdfinder.id && uId === authUserIdfinder.id) {
            return authUserIdfinder;
        } 
    };

};

userProfileV1(2, 1);
console.log(userProfileV1(2, 1));