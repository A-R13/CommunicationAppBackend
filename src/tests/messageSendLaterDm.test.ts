import { waitForDebugger } from 'inspector';
import { newUser, newChannel } from '../dataStore';

import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestChannelMessages, requestMessageSendLater, requestChannelJoin
} from '../wrapperFunctions';

requestClear();

beforeEach(() => {
  requestClear();
});

describe('messageSendLaterDm tests', () => {
    let user0: newUser;
    let user1: newUser;
    let channel0: newChannel;
    let timeSent;
      
    beforeEach(() => {
      requestClear();
      user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 0
      user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 1
      channel0 = requestChannelsCreate(user0.token, 'Channel1', true);
      timeSent = Math.floor(Date.now() / 1000);
    });

    // dmId does not refer to a valid DM
    test(('invalid dmId'), () => {

    });

    // length of the message is less than 1 character
    test(('length of message is less than 1 character'), () => {

    });

    // length of the message is over 1000 characters
    test(('length of message is over 1000 characters'), () => {

    });

    // timeSent is a time in the past
    test(('timeSent is a time in the past'), () => {

    });

    // authorised user is not a member of the DM they are trying to post to
    test(('authorsed user is not a member of the respective DM'), () => {

    });
    // token is invalid 
    test(('invalid token'), () => {

    });

});