import { getData, userShort, userType, message, reacts } from './dataStore';
import crypto from 'crypto';

/**
   * <Description: Returns the object in channels array which corresponds with inputed channelId. >
   * @param {number} channelId
   * @returns { channel: { channelId, channelName, isPublic, ownerMembers:
   * [{ uId, email, nameFirst, nameLast, handleStr}],
   * allMembers: [{uId, email, nameFirst, nameLast, handleStr}], messages } }
   */
export function getChannel(channelId: number) {
  const data = getData();
  return data.channels.find(c => c.channelId === channelId);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {number} uId
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getUId(uId: number) {
  const data = getData();
  return data.users.find(u => u.authUserId === uId);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {string} token
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getToken(token: string) {
  const data = getData();
  return data.users.find(a => a.sessions.includes(token) === true);
}

/**
 * <Description: Returns the object in users array which corresponds with inputted uId. >
 * @param {string} token
 * @returns { user: { authUserId, user_handle, email, password, nameFirst, nameLast }}
 */
export function getDm(dmId: number) {
  const data = getData();
  return data.dms.find(d => d.dmId === dmId);
}

export function userConvert(user: userType): userShort {
  return {
    uId: user.authUserId,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    handleStr: user.userHandle
  };
}

export const SECRET = 'dreamBeans';

export function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

/**
 * <Description: Checks if the messageId is in Dms. >
 * @param {number} messageId - MessageId
 * @returns { number }- either -1 if not in Dms or an index if in Dms
 */

export function CheckValidMessageDms(messageId: number) {
  const data = getData();
  let validMessage = -1;
  for (const m in data.dms) {
    // checks if valid message
    if (data.dms[m].messages.find(message => message.messageId === messageId)) {
      validMessage = parseInt(m);
    }
  }
  return validMessage;
}

/**
 * <Description: Checks if the messageId is in Channels. >
 * @param {number} messageId - messageId
 * @returns { number } - either -1 if not in channels or an index if in channel
 */

export function CheckValidMessageChannels(messageId: number) {
  const data = getData();
  let validMessage = -1;
  for (const m in data.channels) {
    // checks if valid message
    if (data.channels[m].messages.find(message => message.messageId === messageId)) {
      validMessage = parseInt(m);
    }
  }
  return validMessage;
}

/**
 * <Description: Checks if the User is the same user or if they are an owner >
 * @param {number} authUserid - An authenticated user
 * @param {number} messageId - messageId
 * @returns { number }
 */

export function CheckMessageUser(authUserId : number, messageId : number) : boolean {
  const data = getData();
  const CheckInChannel = CheckValidMessageChannels(messageId);
  if (CheckInChannel === -1) {
    const checkInDm = CheckValidMessageDms(messageId);
    if (checkInDm === -1) {
      // not in channel or dms
      return false;
    } else {
      // in dms
      const DmMessageIndex = data.dms[checkInDm].messages.findIndex(message => message.messageId === messageId);
      // checks if the user is the same
      if (data.dms[checkInDm].messages[DmMessageIndex].uId === authUserId) {
        return true;
      } else {
        // if not the same, check if user is owner
        if (data.dms[checkInDm].owners.find(member => member.uId === authUserId)) {
          return true;
        } else {
          return false;
        }
      }
    }
  } else {
    // Message is in channel
    const ChannelMessageIndex = data.channels[CheckInChannel].messages.findIndex(message => message.messageId === messageId);
    // Is the same user
    if (data.channels[CheckInChannel].messages[ChannelMessageIndex].uId === authUserId) {
      return true;
    } else {
    // check if user is member
      for (const member of data.channels[CheckInChannel].ownerMembers) {
        if (member.uId === authUserId) {
          return true;
        }
      }
      return false;
    }
  }
}
/**
 * <Description: Adds a reaction to a message with messageId>
 * @param {number} - authUserId - Unqiue id for user
 * @param {number} - messaageId - unique id for channel
 * @param {number} - reactId - unique reaction id
 * @returns {message} - returns message object
 */
export function userReacted (authUserId: number, messageId: number, reactId: number) {
  const data = getData();

  for (const channel of data.channels) {
    const userInChannel = channel.allMembers.find((a: userShort) => a.uId === authUserId);
    const messageInChannel = channel.messages.find((b: message) => b.messageId === messageId);

    if (userInChannel !== undefined && messageInChannel !== undefined) {
      for (const message of channel.messages) {
        if (message.messageId === messageId) {
          const reaction: reacts = message.reacts.find((c: reacts) => c.reactId === reactId);
          const react: reacts = message.reacts.find(c => c.uids.includes(authUserId) === true);
          if (reaction === undefined) {
            message.reacts.push(
              {
                reactId: reactId,
                uids: [],
                isThisUserReacted: false
              }
            );
            return message;
          } else if (react === undefined) {
            return message;
          }
        }
      }
    }
  }

  for (const dm of data.dms) {
    const userInDm = dm.members.find((a: userShort) => a.uId === authUserId);
    const messageInDm = dm.messages.find((b: message) => b.messageId === messageId);

    if (userInDm !== undefined && messageInDm !== undefined) {
      for (const message of dm.messages) {
        if (message.messageId === messageId) {
          const reaction: reacts = message.reacts.find((c: reacts) => c.reactId === reactId);
          const react: reacts = message.reacts.find(c => c.uids.includes(authUserId) === true);
          if (reaction === undefined) {
            message.reacts.push(
              {
                reactId: reactId,
                uids: [],
                isThisUserReacted: false,
              }
            );
            return message;
          } else if (react === undefined) {
            return message;
          }
        }
      }
    }
  }
  return false;
}

/**
 * <Description: Checks if message is already pinned >
 * @param {number} messageId - messageId
 * @returns { Booleon }
 */

export function checkIsPinned(messageId: number) : boolean {
  const data = getData();
  const CheckInChannel = CheckValidMessageChannels(messageId);
  if (CheckInChannel === -1) {
    const checkInDm = CheckValidMessageDms(messageId);
    if (checkInDm === -1) {
      // not in channel or dms
      return false;
    } else {
      // in dms
      const DmMessageIndex = data.dms[checkInDm].messages.findIndex(message => message.messageId === messageId);
      // checks if pinned
      if (data.dms[checkInDm].messages[DmMessageIndex].isPinned === true) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    // Message is in channel
    const ChannelMessageIndex = data.channels[CheckInChannel].messages.findIndex(message => message.messageId === messageId);
    // checks if pinned
    if (data.channels[CheckInChannel].messages[ChannelMessageIndex].isPinned === true) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * <Description: Checks if message is already unpinned >
 * @param {number} messageId - messageId
 * @returns { Booleon }
 */

 export function checkIsUnpinned(messageId: number) : boolean {
  const data = getData();
  const CheckInChannel = CheckValidMessageChannels(messageId);
  if (CheckInChannel === -1) {
    const checkInDm = CheckValidMessageDms(messageId);
    if (checkInDm === -1) {
      // not in channel or dms
      return false;
    } else {
      // in dms
      const DmMessageIndex = data.dms[checkInDm].messages.findIndex(message => message.messageId === messageId);
      // checks if pinned
      if (data.dms[checkInDm].messages[DmMessageIndex].isPinned === false) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    // Message is in channel
    const ChannelMessageIndex = data.channels[CheckInChannel].messages.findIndex(message => message.messageId === messageId);
    // checks if pinned
    if (data.channels[CheckInChannel].messages[ChannelMessageIndex].isPinned === false) {
      return false;
    } else {
      return true;
    }
  }
}

/**
 * <Description: Checks if user has reacted to message>
 * @param {number} authUserId - unique identifier for user
 * @param {number} messageId - unique identifier for message
 * @param {number} reactId - unique identifier for reaction
 *
 * @returns {boolean} returns true if user has reacted, false otherwise
 */

export function isUserReacted(authUserId: number, messageId: number, reactId: number) {
  const data = getData();

  for (const channel of data.channels) {
    const userInChannel = channel.allMembers.find((a: userShort) => a.uId === authUserId);
    const messageInChannel = channel.messages.find((b: message) => b.messageId === messageId);

    if (userInChannel !== undefined && messageInChannel !== undefined) {
      for (const message of channel.messages) {
        if (message.messageId === messageId) {
          const reaction: reacts = message.reacts.find((c: reacts) => c.reactId === reactId);
          const react: reacts = message.reacts.find(c => c.uids.includes(authUserId) === true);
          if (reaction !== undefined && react !== undefined) {
            return true;
          }
        }
      }
    }
  }

  for (const dm of data.dms) {
    const userInDm = dm.members.find((a: userShort) => a.uId === authUserId);
    const messageInDm = dm.messages.find((b: message) => b.messageId === messageId);

    if (userInDm !== undefined && messageInDm !== undefined) {
      for (const message of dm.messages) {
        if (message.messageId === messageId) {
          const reaction: reacts = message.reacts.find((c: reacts) => c.reactId === reactId);
          const react: reacts = message.reacts.find(c => c.uids.includes(authUserId) === true);
          if (reaction !== undefined && react !== undefined) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/**
 * @param {number} messageId - unique identifier for a message
 *
 * @returns {message} returns message object that mathces the messageId
 */

export function messageFinder (messageId: number) {
  const data = getData();
  let messageFound: message;

  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        messageFound = message;
        return messageFound;
      }
    }
  }

  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        messageFound = message;
        return messageFound;
      }
    }
  }

  return false;
}
