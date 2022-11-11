import HTTPError from 'http-errors';
import { messagesReact } from './dataStore';
import { getData, setData } from './dataStore';
import { getToken, getHashOf, SECRET } from './helperFunctions';

export function searchV1(token: string, queryStr: string): { messages: messagesReact[] } {

  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  }

  if (queryStr.length < 1 || queryStr.length > 1000) {
    throw HTTPError(400, 'Error: Invalid query string');
  }
  // Temporary array to push the messages into
  let temp = []
  
  // loop through channels
  for (const channel of data.channels){
    const userInChannel = channel.allMembers.find((a: userShort) => a.uId === user.authUserId)
    if (userInChannel === undefined) {
      // If user is not a member of the channel then continue
      continue;
    }
    for (const messages of channel.messages){
      if(messages.message.includes(queryStr)){
        temp.push(messages)
      }
    }
  }

  // loop through dms
  for (const dm of data.dms){
    const userInDm = dm.members.find((a: userShort) => a.uId === user.authUserId)
    if (userInDm === undefined) {
      // If user is not a member of the dm then continue
      continue;
    }
    for (const messages of dm.messages){
      if(messages.message.includes(queryStr)){
        temp.push(messages)
      }
    }
  }

  return {
    messages: temp
  }

}
