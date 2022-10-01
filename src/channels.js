import { getData, setData } from './dataStore.js';


export function channelsCreateV1 (authUserId, name, isPublic) {

    const data = getData();
    const user = data.users.find(a => a.authUserId === authUserId);
    const channels_array = [];
  
    if (user === undefined) {
      return { error: `User with authUserId '${authUserId}' does not exist!` };
    }
  
    if (name.length >= 1 && name.length <= 20) {
      const channelID = Math.floor(Math.random() * 10000);
      const channel = {
        channelId: channelID,
        channelName: name,
        isPublic: isPublic,
        ownerMembers: [
          {
            authUserId: user.authUserId,
            UserId: user.uID,
            Firstname: user.nameFirst,
            Lastname: user.nameLast,
          },
        ],
        allMembers: [
          {
            authUserId: user.authUserId,
            UserId: user.uID,
            Firstname: user.nameFirst,
            Lastname: user.nameLast,
          },
        ],
        messages: [],
      }

        channels_array.push(channel);

        data.channels = channels_array;

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
