import { getData } from './dataStore';
import { getToken } from './other';

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
