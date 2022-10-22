import { dataa } from './other';

// YOU SHOULD MODIFY THIS OBJECT BELOW
<<<<<<< HEAD:src/dataStore.ts
let data = {
=======
let data: dataa = {
>>>>>>> master:src/dataStore.js
  users: [],
  channels: [],
  dms: [],
};

/* The manner in which users and channels should be stored.
User in data.users =  {
            authUserId: id,
            user_handle: user_handle,
            email: email,
            password: password,
            nameFirst: nameFirst,
            nameLast: nameLast,
        }

Single Channel = {
        channelId: channelID,
        channelName: name,
        isPublic: isPublic,
        ownerMembers: [
          {
            uId: user.authUserId,
            email: user.email,
            nameFirst: user.nameFirst,
            nameLast: user.nameLast,
            handleStr: user.user_handle,
          },
        ],
        allMembers: [
          {
            uId: user.authUserId,
            email: user.email,
            nameFirst: user.nameFirst,
            nameLast: user.nameLast,
            handleStr: user.user_handle,
          },
        ],
        messages: [],
      }

*/

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/**
 * { email: 'daiel.hkuu1@hmailc.om,
 * authUserId:
 * }
 *
 */
/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: dataa) {
  data = newData;
}

export { getData, setData };
