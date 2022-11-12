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
  const detailsArray = userArray.map(user => {
    if (user.isRemoved === false) {
      return {
        uId: user.authUserId,
        email: user.email,
        nameFirst: user.nameFirst,
        nameLast: user.nameLast,
        handleStr: user.userHandle
      };
    }
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
