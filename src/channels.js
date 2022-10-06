import { getData, setData } from './dataStore.js';
import { authRegisterV1 } from './auth.js';


/**
  * The channelsCreate function, as the name says creates a new channel based on the input arugments and adds it to the channels array 
  * in the dataStore, it returns the channelId if the creation was successful.
  * 
  * @param {number} authUserId - The UserId of the user creating the channel, they become an owner and part of the allMembers array
  * @param {string} name - The name of the channel
  * @param {boolean} isPublic - Whether the channel is public or private
  * 
  * ...
  * 
  * @returns {{ channelId: channelID }} - Upon successful creation, the created channel's channelId is returned.
  * @returns {{ error: string }} - Upon unsuccesful creation, a string specificing the error is returned. 
*/


export function channelsCreateV1 (authUserId, name, isPublic) {
    const data = getData();
    const user = data.users.find(a => a.authUserId === authUserId);
  
    if (user === undefined) {
      return { error: `User with authUserId '${authUserId}' does not exist!` };
    }
  
    if (name.length >= 1 && name.length <= 20) {
      
      
      // const channelID = Math.floor(Math.random() * 10000); a random number generator
      let channelID = data.channels.length;
        // increment counter until a new unique channel number is created
      
      const channel = {
        channelId: channelID,
        channelName: name,
        isPublic: isPublic,
        ownerMembers: [
          {
            authUserId: authUserId,
            User_Handle: user.user_handle,
          },
        ],
        allMembers: [
          {
            authUserId: authUserId,
            User_Handle: user.user_handle,
          },
        ],
        messages: [],
      }
      /*
      correct return type for members
      {
        uId: authUserId,
        email: user.email,
        nameFirst: user.nameFirst,
        nameLast: user.nameLast,
        handleStr: user.user_name,
      }
      */

      data.channels.push(channel);

      setData(data);
    
      return { channelId: channelID }

  } else {
    return { error: `Channel name does not meet the required standards standard` };
  }
}


export function channelsListV1 (authUserId) {
    return {
        channels: [
            {
              channelId: 1,
              name: 'My Channel',
            }
          ],
    };
}


export function channelsListAllV1(authUserId) {
    return {
        channels: [
            {
            channelId: 1,
            name: 'My Channel',
            }
        ],
    };
}

