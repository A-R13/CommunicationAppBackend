import HTTPError from 'http-errors';

import { getData, setData, userType, userShort, message, dmType, notification } from './dataStore';

import {
  getUId, getToken, getChannel, getDm, checkIsPinned, checkIsUnpinned, userReacted, isUserReacted, messageFinder,
  userConvert, CheckValidMessageDms, CheckValidMessageChannels, CheckMessageUser, getHashOf, SECRET, userMemberDM, userMemberChannel
} from './helperFunctions';

export function notificationsGet(token: string): notification[] {

    const tokenHashed = getHashOf(token + SECRET);
    const user: userType = getToken(tokenHashed);

    if (user === undefined) {
        throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
    }

    const handle = user.userHandle;

    return 
}