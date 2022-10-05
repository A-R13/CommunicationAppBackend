import { getData, setData } from './dataStore.js';
import { authRegisterV1 } from './auth.js';


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

