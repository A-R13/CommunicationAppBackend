import { channel } from 'diagnostics_channel';
import HTTPError from 'http-errors';
import validator from 'validator';

import { getData } from './dataStore';
import { getToken, getHashOf, SECRET } from './helperFunctions';

/**
 * <Description: Returns a users profile for a valid uId that is given to check>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {user}
 */

export function userProfileV3 (token : string, uId : number) {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const userToken = getToken(tokenHashed);

  if (userToken === undefined) {
    throw HTTPError(403, `Erorr: '${token}' is invalid`);
  }

  if (data.users.find(users => users.authUserId === uId) === undefined) {
    throw HTTPError(400, 'Erorr: uID is not correct!');
  }

  for (const tokenFinder of data.users) {
    if (uId === tokenFinder.authUserId) {
      return {
        user: {
          uId: tokenFinder.authUserId,
          email: tokenFinder.email,
          nameFirst: tokenFinder.nameFirst,
          nameLast: tokenFinder.nameLast,
          handleStr: tokenFinder.userHandle,
        }
      };
    }
  }
}

/**
 * <Description: Lists all users and their associated details>
 *
 * @param {string} token - session Id for authorised users
 *
 * @returns {Array of objects}
 */

export function usersAllV2 (token: string) {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: the inputted token '${token}' is invalid`);
  }
  const userArray = data.users;
  // modifies stored users array to only return what's needed
  const detailsArray = userArray.map(user => {
    return {
      uId: user.authUserId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.userHandle
    };
  });

  return {
    users: detailsArray,
  };
}

/**
 * < Description: Update the authorised user's first and last name.>
 * @param {string} token
 * @param {string} nameFirst
 * @param {string} nameLast
 * @returns {{}}
 */

export function userSetNameV2 (token: string, nameFirst: string, nameLast: string) {
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  // error checking
  if (nameFirst === '' || nameFirst.length > 50) {
    throw HTTPError(400, 'Error: First name is not of the correct length');
  } else if (nameLast === '' || nameLast.length > 50) {
    throw HTTPError(400, 'Error: Last name is not of the correct length');
  } else if (user === undefined) {
    throw HTTPError(403, 'Error: Invalid token');
  }

  user.nameFirst = nameFirst;
  user.nameLast = nameLast;

  return {};
}

/**
 * <Description: Update the authorised user's email address.>
 * @param {string} token
 * @param {string} email
 * @returns {{}}
 */
export function userSetEmailV2 (token: string, email: string) {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Error: Invalid email');
  } else if (user === undefined) {
    throw HTTPError(403, 'Error: Invalid token');
  } else if (data.users.find(users => users.email === email)) {
    throw HTTPError(400, 'Error: Email already exists');
  }

  user.email = email;

  return {};
}

/**
 * <Description: Update the authorised user's handle (ie. display name).>
 * @param {string} token
 * @param {string} handleStr
 * @returns {{}}
 */
export function userSetHandleV2 (token: string, handleStr: string) {
  const data = getData();

  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  // error checking
  if (handleStr.length < 3 || handleStr.length > 20) {
    throw HTTPError(400, 'Error: Handle is the incorrect length');
  } else if (handleStr.match(/^[0-9A-Za-z]+$/) === null) {
    throw HTTPError(400, 'Error: Handle contains non-alphanumeric characters');
  } else if (data.users.find(users => users.userHandle === handleStr)) {
    throw HTTPError(400, 'Error: Handle already exists');
  } else if (user === undefined) {
    throw HTTPError(403, 'Error: Invalid token');
  }

  user.userHandle = handleStr;

  return {};
}

export function userStatsV1(token: string) {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const userToken = getToken(tokenHashed);

  let numChannelsJoined = [];
  let numDmsJoined = [];
  let numMsgsSent = [];

  let numChannels = data.channels.length;
  let numDms = data.dms.length;
  let numMsgs = 0;

  let channelTimejoined = 0;
  let latestMessagetime = 0;
  
  if (userToken === undefined) {
    throw HTTPError(403, "Error: token is not valid");
  }

  for (let i in data.channels) {

    let a = data.channels[i].allMembers.filter(a => a.uId === userToken.authUserId);

    for (let j in data.channels[i].messages) {
      if (data.channels[i].messages[j].uId === userToken.authUserId) {
        numMsgsSent.push(data.channels[i].messages[j]);
        if (data.channels[i].messages[j].timeSent > latestMessagetime) {
          latestMessagetime = data.channels[i].messages[j].timeSent;
        }
      }
      numMsgs++;
    }

    if (a.length !== 0) {  
      if (a[0].timeJoined > channelTimejoined) {
        channelTimejoined = a[0].timeJoined;
      }
      numChannelsJoined.push(a);
    } 

  }
  
  for (let i in data.dms) {
    let a = data.dms[i].members.filter(a => a.uId === userToken.authUserId);

    for (let j in data.dms[i].messages) {
      if (data.dms[i].messages[j].uId === userToken.authUserId) {
        numMsgsSent.push(data.dms[i].messages[j]);
        if (data.dms[i].messages[j].timeSent > latestMessagetime) {
          latestMessagetime = data.dms[i].messages[j].timeSent;
        }
      }
      numMsgs++;
    }

    numDmsJoined.push(a);
  }

  let involvementRate = (numChannelsJoined.length + numDmsJoined.length + numMsgsSent.length)/(numChannels + numDms + numMsgs)

  if (involvementRate < 0) {
    involvementRate = 0;
  } else if (involvementRate > 1) {
    involvementRate = 1;
  }

  return {
    channelsJoined: [numChannelsJoined.length, channelTimejoined],
    DmsJoined: [numDmsJoined.length, ],
    messagesSent: [numMsgsSent.length, latestMessagetime],
    involvementRate: involvementRate,
  }


}