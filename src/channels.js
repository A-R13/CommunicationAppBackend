import { getData, setData } from './dataStore.js';
import { authRegisterV1 } from './auth.js';
import { getChannel, getAuthUserId, getUId } from './other.js';


/**
 * <description: Creates a new channel with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {number} authUserId - unique ID of the user
 * @param {string} name - Name of the channel to be created
 * @param {boolean} isPublic - To determine whether the channel will be public (true) or private (false)
 * 
 * @returns { {channelId: number} } - The channelId of the newly created channel
 */

export function channelsCreateV1 (authUserId, name, isPublic) {
    const data = getData();
    const user = getAuthUserId(authUserId);
  
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

      data.channels.push(channel);

      setData(data);
    
      return { channelId: channelID }

  } else {
    return { error: `Channel name does not meet the required standards standard` };
  }
}

/**
 * <description: function provides a list of all channels the authorised user is part of>
 * @param {number} authUserId - unique ID of the user
 * @returns {Array of objects} - Consists of channelId and channel names that will be listed
 */

export function channelsListV1 (authUserId) {

  const data = getData(); 
  const user = data.users.find(a => a.authUserId === authUserId);

  if (user === undefined) {
    return { error: `${authUserId} is invalid`};
  }

  const list_channels = []; 

  for (let channel of data.channels) {
    if (channel.isPublic === true) {
      list_channels.push(
        {
          channelId: channel.channelId,
          name: channel.channelName,
        }
      )
    }
  }
  return {
      channels: list_channels,
  };

}


/**
 * <Function Description: Takes in a valid authUserId and lists all the created channels (both Public and Private channels)>
 * 
 * @param {number} authUserId - It is the id of the user
 * 
 * @returns {Array<Objects>} channels - Lists all of the created channels with their ChannelId and name as keys in the object.
 */

export function channelsListAllV1(authUserId) {
  const data = getData();
  //Helper function 
  const user = getAuthUserId(authUserId);
  
  if (user === undefined) {
    return { error: `Invalid Auth user Id` };
  }

  // temporary array for channels
  const temp_channels = [];

  for (const channel of data.channels){
    temp_channels.push(
      {
        channelId: channel.channelId,
        name:channel.channelName,
      }
    )
  }
  return {
    channels: temp_channels,
  };
}