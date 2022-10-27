import { getData, setData } from './dataStore';

import {
  userType, userShort, message, dmType, getUId, getToken, getChannel, getDm,
  userConvert, CheckValidMessageDms, CheckValidMessageChannels
} from './other';

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function dmCreateV1 (token: string, uIds: number[]): {dmId: number} | {error: string} {
  const data = getData();

  const user: userType = getToken(token);

  let uIdArray;

  uIdArray = uIds.filter(uIds => getUId(uIds) !== undefined);

  if (JSON.stringify(uIdArray) !== JSON.stringify(uIds)) {
    return { error: 'A uId in the input is not valid' };
  }

  const uIdset = Array.from(new Set(uIdArray));

  if (uIdset.length !== uIds.length) {
    return { error: "There are duplicate uId's in the input uIds" };
  }

  if (user === undefined) {
    return { error: `User with token '${token}' does not exist!` };
  }

  const length = data.dms.length;

  uIdArray = uIdArray.map(uId => getUId(uId));

  uIdArray.unshift(user);

  const ownersArray: userShort[] = [];

  const convertedUser: userShort = userConvert(user);

  ownersArray.push(convertedUser);

  const nameArray = uIdArray.map(user => user.userHandle).sort();
  const nameString = nameArray.join(', ');

  const membersArray = uIdArray.map(user => userConvert(user));

  const dm: dmType = {
    name: nameString,
    dmId: length,
    members: membersArray,
    owners: ownersArray,
    messages: [],
  };

  data.dms.push(dm);

  setData(data);

  return { dmId: length };
}

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function messageSendV1 (token: string, channelId: number, message: string): {messageId: number} | {error: string} {
  let channel = getChannel(channelId);
  const user = getToken(token);

  if (channel === undefined) {
    // If channel is undefined
    return { error: `Channel with channelId '${channel}' does not exist!` };
  } else if (message.length < 1 || message.length > 1000) {
    return { error: 'The message is either too short (< 1) or too long (> 1000).' };
  } else if (user === undefined) {
    // If user doesn't exist at all, return an error
    return { error: `User with token '${token}' does not exist!` };
  }

  const userInChannel = channel.allMembers.find(a => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: `User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channel}'!` };
  }

  const messageid = Math.floor(Math.random() * 10000);

  const msgg = {
    messageId: messageid,
    uId: user.authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
  };

  const data = getData();
  channel = data.channels.find(c => c === channel);
  channel.messages.unshift(msgg);

  setData(data);

  return { messageId: messageid };
}

/**
 * <Description: Edits a message on a given channel or Dm>
 * @param {string} token - Unique token of the 'authorising' user
 * @param {number} messageId - Unique ID for a message
 * @returns {}
 */

export function messageEditV1(token: string, messageId: number, message: string): Record<string, never> | {error: string} {
  const data = getData();
  const userToken = getToken(token);
  let sameUser = false;
  let Isowner = false;

  // checks if token is valid
  if (userToken === undefined || message.length > 1000) {
    return { error: 'error' };
  }

  // check if valid messages

  const channelIndex = CheckValidMessageChannels(messageId);
  const DmIndex = CheckValidMessageDms(messageId);
  let dmMessageIndex = 0;
  let channelMessageIndex = 0;

  if (DmIndex === -1 && channelIndex === -1) {
    return { error: 'error' };
  } else if (DmIndex === -1 && channelIndex !== -1) {
    // channel exists.
    channelMessageIndex = data.channels[channelIndex].messages.findIndex(message => message.messageId === messageId);
    // check if owner
    if (data.channels[channelIndex].ownerMembers.find(member => member.uId === userToken.authUserId)) {
      Isowner = true;
    }
    // check if same user
    if (data.channels[channelIndex].messages[channelMessageIndex].uId === userToken.authUserId) {
      sameUser = true;
    }
  } else {
    // Dm exists
    dmMessageIndex = data.dms[DmIndex].messages.findIndex(message => message.messageId === messageId);
    // check if owner, DEnnis might need to add some more functionality. ADd this code when done.
    if (data.dms[DmIndex].owners.find(member => member.uId === userToken.authUserId)) {
      Isowner = true;
    }
    // check if same user
    if (data.dms[DmIndex].messages[dmMessageIndex].uId === userToken.authUserId) {
      sameUser = true;
    }
  }

  if (sameUser === true || (sameUser === false && Isowner === true)) {
    // if message is empty, delete message
    if (message === '' && channelIndex === -1) {
      data.dms[DmIndex].messages.splice(dmMessageIndex, 1);
    } else if (message === '' && DmIndex === -1) {
      data.channels[channelIndex].messages.splice(channelMessageIndex, 1);
    } else if (DmIndex === -1) {
      data.channels[channelIndex].messages[channelMessageIndex].message = message;
    } else if (channelIndex === -1) {
      data.dms[DmIndex].messages[dmMessageIndex].message = message;
    }
  }

  if ((sameUser === false && Isowner === false)) {
    return {
      error: 'error'
    };
  } else {
    setData(data);
    return {};
  }
}

/**
 * <description:  Removes a dm when given a dmId >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number} dmId - an Id used to identify a dm channel
 *
 * @returns {} - nothing
 */

export function dmRemoveV1(token : string, dmId: number) {
  const data = getData();

  const user = getToken(token);
  const dm = getDm(dmId);

  // checks if token is valid
  if (user === undefined) {
    return { error: 'error 1' };
  }
  // dm doesnt exist
  if (dm === undefined) {
    return {
      error: 'error 2'
    };
  }

  const userIdentity = user.authUserId;
  // finds auth user id if token is valid

  const convertedUser: userShort = userConvert(user);
  const owner: userShort = dm.owners.find(member => member.uId === userIdentity);

  // checks if the user is an owner.
  if (JSON.stringify(owner) !== JSON.stringify(convertedUser)) {
    return {
      error: 'error 3'
    };
  }

  // deletes the dm
  for (const i in data.dms) {
    if (data.dms[i].dmId === dmId) {
      data.dms.splice(parseInt(i), 1);
    }
  }

  setData(data);
  return {};
}

/**
 * <Description: Returns the first 50 messages from a specified dm, given a starting index and given that the accessing user is a member of said dm.
 * If there are less than (start + 50) messages the 'end' value will be -1, to show that there are no more messages to show.

 * @param {string} token
 * @param {number} dmId
 * @param {number} start
 * @returns { messages: [{ messageId, uId, message, timeSent }], start: number, end: number}
 */

export function dmMessagesV1 (token: string, dmId: number, start: number): { messages: message[], start: number, end: number} | { error: string} {
  const userToken = getToken(token);
  const dm: dmType = getDm(dmId);

  if (dm === undefined) {
    // If dm is undefined
    return { error: `dm with dmId '${dmId}' does not exist!` };
  } else if (start > dm.messages.length) {
    // If the provided start is greater than the total messages in the dm, an error will be returned
    return { error: `Start '${start}' is greater than the total number of messages in the specified dm` };
  }

  if (userToken === undefined) {
    // If user doesn't exist at all, return an error
    return { error: `User with token '${token}' does not exist!` };
  }

  const userInDm = dm.members.find((a: userShort) => a.uId === userToken.authUserId);
  if (userInDm === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: `User with authUserId '${userToken.authUserId}' is not a member of dm with dmId '${dmId}'!` };
  }

  if ((start + 50) > dm.messages.length) {
    // If the end value is more than the messages in the channel, set end to -1, to indicate no more messages can be loaded
    return {
      messages: dm.messages.slice(start, dm.messages.length),
      start: start,
      end: -1,
    };
  } else {
    return {
      // If the end value is less than the messages in the channel, set end to (start + 50) to indicate there are still more messages to be loaded
      messages: dm.messages.slice(start, (start + 50)),
      start: start,
      end: (start + 50),
    };
  }
}
/**
 * <Description: Given a valid DmId by a member thats within the dm, this function will return the name and members of that Dm.

 * @param {string} token
 * @param {number} dmId
 *
 * @returns { name: string, members: [users]}
 */

export function dmDetailsV1 (token: string, dmId: number): {name: string, members: userShort[], owners: userShort[]} | { error: string} {
  // check if token and dmId are valid
  const checkToken = getToken(token);
  const checkDM: dmType = getDm(dmId);

  if (checkToken === undefined) {
    return { error: 'Invalid Token.' };
  }
  if (checkDM === undefined) {
    return { error: 'Invalid DmId' };
  }
  // check if user is a member of the Dm
  const userInDm = checkDM.members.find((a: userShort) => a.uId === checkToken.authUserId);
  if (userInDm === undefined) {
    // If user is not a member of the target channel, return an error
    return { error: 'User is not a member of this dm' };
  }

  return {
    name: checkDM.name,
    members: checkDM.members,
    owners: checkDM.owners,
  };
}

/**
 * <description: The function provides a list of all the dms the authorised user is part of>

 * @param {string} token
 *
 * @returns { dms: dmType[] } dms
 */

export function dmListV1 (token: string): { dms: { dmId: number, name: string }[] } | { error: string } {
  const user = getToken(token);
  const data = getData();
  const dmArray = data.dms;

  if (user === undefined) {
    return { error: `User with token '${token}' does not exist!` };
  }

  let dmList: { dmId: number, name: string }[] = [];

  const listArray = dmArray.filter((a: dmType) => a.members.some(element => element.uId === user.authUserId));
  //  Iterates through dms, and pushes onto listArray whenever the dm.members has a user with specified user.authUserId

  dmList = listArray.map(dm => { return { dmId: dm.dmId, name: dm.name }; });

  return { dms: dmList };
}

export function dmLeaveV1 (token: string, dmId: number) {
  const data = getData();
  const userToken = getToken(token);
  const checkInDm: dmType = getDm(dmId);
  //invalid token
  if(userToken === undefined) {
    return { error: `Inputted token '${token}' is invalid`};
  }
  //invalid dmID
  if (checkInDm === undefined) {
    return { error: 'Dm ID not found' };
  }
  let userId;
  for (const user in data.users) {
    if (data.users[user].sessions.includes(token) === true) {
      userId = data.users[users].authUserId;
    }
  }
  //error if user is not a member of the DM, else remove user from DM
  const userInDm = checkInDm.members.find((a: userShort) => a.uId === userToken.authUserId);
  if (userInDm === undefined) {
    return { error: 'Inputted user is not a member of this DM' };
  } else {
    data.dms[dmId].members = data.dms[dmId].members.filter(m => m.dmId !== userId);
  }

  return {};
}