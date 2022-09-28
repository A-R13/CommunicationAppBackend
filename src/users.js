import { getData } from './dataStore.js';

export function userProfileV1 (authUserId, uId ) {
    let data = getData();
    let counter = 0; // The counter checks if the Id inputted is valid of not

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
