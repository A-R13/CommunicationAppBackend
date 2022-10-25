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

export function userSetName (token: string, nameFirst: string, nameLast: string) {
  authUserToken = getToken(token);
  // ERROR CASES
  // length of nameFirst is not between 1-50 characters inclusive

  // length of nameLast is not bewteen 1-50 characters inclusive

  // token is invalid

  // invalid parameters
  if (authUserToken === undefined || nameFirst.length < 1 || nameFirst.length > 50
  || nameLast.length < 1 || nameLast.length > 50) {
    return { error: 'invalid parameters'};
  }

  // SUCCESS CASE - redefine user first name, user last name and push
}
