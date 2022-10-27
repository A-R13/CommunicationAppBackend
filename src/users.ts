import { getData } from './dataStore';
import { getToken } from './other';

/**
 * <Description: Returns a users profile for a valid uId that is given to check>
 * @param {number} channelId - unique ID for a channel
 * @param {number} authUserId - unique ID for a user
 * @returns {user}
 */

export function userProfileV2 (token : string, uId : number) {
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
