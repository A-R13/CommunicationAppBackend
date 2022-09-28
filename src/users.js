import { getData } from './dataStore.js';

export function userProfileV1 (authUserId, uId ) {

    let data = getData();

    /**Need to do errors */

    let counter = 0;

    for (let authUserIdfinder of data.users) {

        if (authUserId === authUserIdfinder.id && uId === authUserIdfinder.id) {
            return authUserIdfinder;
        } else {
            counter++;
        }
    };

    if (counter == data.users.length) {
        return {error: 'error'};
    }

};
