import fs from 'fs';

// Exported types

export interface reacts {
  reactId: number,
  uids: number[],
  isThisUserReacted: boolean
}

export interface userType {
  authUserId: number,
  userHandle: string,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  sessions: string[],
  permissions: number,
  isRemoved: boolean
  timeCreated?: number,
  stats?: any,
  resetCode: string,
  profileImgUrl: string
}

export interface userShort {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
  timeJoined?: number,
  profileImgUrl: string
}

export interface message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
  reacts: reacts[],
  isPinned: boolean
}

export interface channelType {
  channelId: number,
  channelName: string,
  isPublic: boolean,
  ownerMembers: userShort[],
  allMembers: userShort[],
  messages: message[],
  standup: { status: boolean, timeFinish: number, starter: number, messageStore: any },
}

export interface channelShort {
  channelId: number,
  name: string,
}

export interface dmType {
  name: string,
  dmId: number,
  members: userShort[],
  owners: userShort[],
  messages: message[]
  timeJoined?: number,
}

export interface storedData {
  users: userType[],
  channels: channelType[],
  dms: dmType[],
}

export interface newUser {
  token: string,
  authUserId: number
}

export interface newChannel {
  channelId: number
}

export interface newDm {
  dmId: number
}

export interface messagesReacts {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
  reacts: reacts[],
  isPinned: boolean
}

export interface newMessage {
  messageId: number
}

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data: storedData = {
  users: [],
  channels: [],
  dms: [],
};

/* The manner in which users, channels and dms should be stored.
User  =  {
  authUserId: id,
  user_handle: user_handle,
  email: email,
  password: password,
  nameFirst: nameFirst,
  nameLast: nameLast,
}

Channel = {
  channelId: channelID,
  channelName: name,
  isPublic: isPublic,
  ownerMembers: [
    {
      uId: user.authUserId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.user_handle,
    },
  ],
  allMembers: [
    {
      uId: user.authUserId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.user_handle,
    },
  ],
  messages: [],
}

Single Dm = {
  name: string,
  dmId: number,
  members: userShort[],
  owners: userShort[],
  messages: message[]
}

*/

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/**
 * { email: 'daiel.hkuu1@hmailc.om,
 * authUserId:
 * }
 *
 */
/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: storedData) {
  data = newData;
}

const readData = () => {
  if (fs.existsSync('src/dataBase.json')) {
    const dataStr = fs.readFileSync('src/dataBase.json');
    data = JSON.parse(String(dataStr));
  }
};

// NEED TO ADD THIS FUNCTION TO ALL RELEVANT ROUTES, maybe add a wipe route/function see post #1408
const saveData = () => {
  const jsonStr = JSON.stringify(data);
  fs.writeFileSync('src/dataBase.json', jsonStr);
};

const wipeData = () => {
  const cleanData: storedData = { users: [], channels: [], dms: [] };
  setData(cleanData);
  fs.writeFileSync('src/dataBase.json', JSON.stringify(cleanData));

  return {};
};

export { getData, setData, readData, saveData, wipeData };
