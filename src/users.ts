import { getData } from './dataStore';
import { getToken } from './other';
import validator from 'validator';
/**
 * <Description: Returns a users profile for a valid uId that is given to check>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {user}
 */

export function userProfileV2 (token : string, uId : number) : any {
  const data = getData();
  let checkToken = false;
  let checkUId = false;

  const userToken = getToken(token);

  if (userToken !== undefined) {
    checkToken = true;
  }

  if (data.users.find(users => users.authUserId === uId)) {
    checkUId = true;
  }

  for (const tokenFinder of data.users) {
    if (checkToken === true && checkUId === true && uId === tokenFinder.authUserId) {
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

  if (checkToken === false || checkUId === false) {
    return { error: 'error' };
  }
}

export function usersAllV1 (token: string) {
  const data = getData();
  const user = getToken(token);

  if (user === undefined) {
    return { error: `The inputted token '${token}' is invalid` };
  }
  const userArray = data.users;
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

export function userSetEmailV1 (token: string, email: string) {
  const data = getData();
  const user = getToken(token);

  // error checking
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
