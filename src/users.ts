import HTTPError from 'http-errors';
import validator from 'validator';

import { getData } from './dataStore';
import { getToken } from './other';

/**
 * <Description: Returns a users profile for a valid uId that is given to check>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {user}
 */

export function userProfileV3 (token : string, uId : number) {
  const data = getData();
  let checkToken = false;
  let checkUId = false;

  const userToken = getToken(token);

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
  const user = getToken(token);

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

export function userSetNameV1 (token: string, nameFirst: string, nameLast: string) {
  const user = getToken(token);

  // error checking
  if (nameFirst === '' || nameFirst.length > 50) {
    return { error: 'first name is not of the correct length' };
  } else if (nameLast === '' || nameLast.length > 50) {
    return { error: 'last name is not of the correct length' };
  } else if (user === undefined) {
    return { error: 'token is invalid' };
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
export function userSetEmailV1 (token: string, email: string) {
  const data = getData();
  const user = getToken(token);

  if (!validator.isEmail(email)) {
    return { error: 'email is invalid' };
  } else if (user === undefined) {
    return { error: 'token is invalid' };
  } else if (data.users.find(users => users.email === email)) {
    return { error: 'email already exists' };
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
export function userSetHandleV1 (token: string, handleStr: string) {
  const data = getData();
  const user = getToken(token);

  // error checking
  if (handleStr.length < 3 || handleStr.length > 20) {
    return { error: 'handle is the incorrect length' };
  } else if (handleStr.match(/^[0-9A-Za-z]+$/) === null) {
    return { error: 'handle contains non-alphanumeric characters' };
  } else if (data.users.find(users => users.userHandle === handleStr)) {
    return { error: 'handle already exists' };
  } else if (user === undefined) {
    return { error: 'invalid token' };
  }

  user.userHandle = handleStr;

  return {};
}
