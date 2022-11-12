import HTTPError from 'http-errors';

import { getData, setData } from './dataStore';
import { getToken, getHashOf, SECRET, getUId } from './helperFunctions';

export function adminUserRemoveV1(token: string, uId: number) {
    const targetUser = getUId(uId);

    const tokenHashed = getHashOf(token + SECRET);
    const tokenUser = getToken(tokenHashed);
  
    if (tokenUser === undefined) {
        throw HTTPError(403, 'Error: Invalid Token');
    } else if (targetUser === undefined) {
      throw HTTPError(400, `Erorr: No user with the specified uId: ${uId}.`);
    }
  
    let userArray = getData().users;
    let i = 0;
    let ownerUid: number;
    userArray.forEach(user => { 
      if (user.permissions === 1) {
        ownerUid = user.authUserId;
        i++;
      } 
    });
  
    if (i === 1 && ownerUid === uId) {
      throw HTTPError(400, `Erorr: The target user with uId: ${uId} is the only global owner, so they cannot be removed.`);
    } else if (tokenUser.permissions === 2) {
      throw HTTPError(403, `Erorr: The authorising user is not a global owner, so they cannot perform this action.`);
    }

    targetUser.email = '';
    targetUser.isRemoved = true;
    targetUser.nameFirst = 'Removed';
    targetUser.nameLast = 'user';
    targetUser.permissions = null;
    targetUser.sessions = [];
    targetUser.userHandle = '';

    return { }
}