import {
  requestClear, requestAuthRegister, requestDmCreate, requestChannelsCreate, 
  requestMessageSend, requestMessageSendDm, requestChannelJoin
} from '../wrapperFunctions';

import { newUser, newDm, newChannel, newMessage} from '../dataStore';
requestClear();

afterEach(() => {
  requestClear();
});

describe('Testing react function', () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let dm0: newDm;
  let dm1: newDm;
  let channel0: newChannel;
  let channel1: newChannel;
  let cMessage: newMessage;
  let dmMessage: newMessage; 

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    dm0 = requestDmCreate(user0.token, [user1.authUserId]);
    dm1 = requestDmCreate(user0.token, [user1.authUserId]);
    channel0 = requestChannelsCreate(user0.token, 'Channel0', true);
    channel1 = requestChannelsCreate(user0.token, 'Channel1', true);
    requestChannelJoin(user1.token, channel.channelId);
    cMessage = requestMessageSend(user0.token, channel0.channelId, 'Test Message Channel')
    dmMessage = requestMessageSendDm(user0.token, dm0.dmId, 'Test Message Dm')

  });

  test('Error return (Channel id and dmId invalid)', () => {
    expect(requestMessageShare(channelMessage.messageId, 'Test', 10000, 1000)).toStrictEqual(400);
  });

});