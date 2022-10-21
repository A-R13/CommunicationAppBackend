import { getData, setData } from './dataStore';
import { getUId, getToken } from './other';

/**
 * <description: Creates a new dm with the specified name and public/private status, the user who makes the channel is added as a owner and member. >
 * @param {string} token - unique token of the 'authorising' user
 * @param {number[]} uIds - Array of uIds to which the dm is addressed to
 *
 * @returns { {dmId: number} } - The dmId of the newly created dm
 */

export function dmCreateV1 (token: string, uIds: number[]): {dmId: number} | {error: string} {
  const data = getData();

  let uIdArray;

  uIdArray = uIds.filter(uIds => getUId(uIds) !== undefined);

  if (JSON.stringify(uIdArray) !== JSON.stringify(uIds)) {
    return { error: 'A uId in the input is not valid' };
  }

  const uIdset = Array.from(new Set(uIdArray));

  if (uIdset.length !== uIds.length) {
    return { error: "There are duplicate uId's in the input uIds" };
  }

  if (getToken(token) === undefined) {
    return { error: `User with token '${token}' does not exist!` };
  }

  const length = data.dms.length;

  uIdArray = uIdArray.map(uId => getUId(uId));
  uIdArray.unshift(getToken(token));

  const nameArray = uIdArray.map(user => user.userHandle).sort();
  const nameString = nameArray.join(', ');

  const membersArray = uIdArray.map(user => { return { authUserId: user.authUserId, handleStr: user.userHandle }; });

  const dm = {
    name: nameString,
    dmId: length,
    members: membersArray
  };

  data.dms.push(dm);

  setData(data);

  return { dmId: length };
}

// let user0 = authRegisterV2('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe') as {token: string, authUserId: number};    // uid = 0
// let user1 = authRegisterV2('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number};    // uid = 1
// let user2 = authRegisterV2('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number};     // uid = 2
// let user3 = authRegisterV2('example3@gmail.com', 'ABCD1234', 'Steve', 'Doe') as {token: string, authUserId: number};     // uid = 3

// console.log(getUId(0));

// console.log(dmCreateV1(user0.token, [1,2,3]));
// console.log(getData().dms[0].members);
