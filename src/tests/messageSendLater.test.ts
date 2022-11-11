import { newUser, newChannel } from '../dataStore';

import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestChannelMessages, requestMessageSendLater
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
});

describe('messageSendLater tests', () => {
    let user0: newUser;
    let user1: newUser;
    let channel0: newChannel;
  
    beforeEach(() => {
      requestClear();
      user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 0
      user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 1
      channel0 = requestChannelsCreate(user0.token, 'Channel1', true);

    /*eslint-disable */     // Lint returns "error  Multiline support is limited to browsers supporting ES5 only"
      const bigMessage: string = 'gsDYqv5lnOVTHwiqmzVRWqc6Acxu4t9JAyFW8aVKfGRS4urnbM2xy70bfznynOxgCUVdwqckCtMOq31IoiV\
      IZznF3m7lU5bGXdPoJrukmxajudHvSdVwpn1uL1vQBZXUe1yB56aLVKfVA1PzQPU1BNAzCrePCAAPHSE6lXCENn5yISjabwFbXi0A84hCfJqFAJ\
      wSZCD74oWhtdykrfqLT3qQhPil8s7WUslBErHLaYyzFcuWyAIHxXPTHDYA9hK24F1Fez6r7tx2Nw5n5jZb6tOqOJIWMUPVV6280uZqYeomn07Rp\
      9koabGH1dqLFpj6Xlh5if9Grmy3q78BUvnffRtzsz9ifJt8CW0DQWFpwuW4uU514FNPF0kmSMVWpJSGV5BCt0uCgf4mIowtGlEV8Joe8WjjTaDG\
      Lo9ssUI0zLaeiTaU5iIMWc1ky1ihtylnhy6XJYzHdmRdib0EVTBSGmjvZYHa85iSYzO5oD0lPCzwkz8hjURz51omlmPhGoWtgsJAebVag11FAAz\
      yTH0hX0VjPygBd2WNV4fnMz1BxwFb58vo6E1OXjQbabo1HA4sbfbZpHyzMtJUowdaelZLE0SUVHZigKMA8CaYT4vuvP5BakTdytYq3L2RhzyerP\
      SpZRYxcsRLo78IhDVzzm7SVVwZ1kUOcS5vyGnB1NtCylieNSGqWCN1YBtXmSNOoH8JS2eaYy4PYgGivOGrL05hQxrmPaWrnKT8tP0b1wHZGABAK\
      x1H6z0ldvBtluEdxMVMQ2jzOEPtcoFRDhWQrc9cn4IepW1tfxPlbv5dyK8ZUlPDlBzEUnxgagwEGoQA9SmVSeY0wXzrkoxxzkO7PwNfqHCiz7be\
      5LuopMDND8mwakQqa6oSvMd8JlCdECf67t3pIIQ0eGYYtYH4WzEGtv6l6US1yuY9GBuDO0mWgjCZO3Z9SNyByNY8mvCBsTKj1ntaHNoz4cJN7nh\
      ZtKu5Kd7iJ3LVOuYGNN71QVjaxnE4Q';
      /* eslint-enable */
    });

    // success case
    test(('successfully sent message later'), () => {
        expect(requestMessageSendLater(user0.token, channel0.channelId, 'Test Message', 0600)).toStrictEqual({ messageId: expect.any(Number) });

        const msg1 = requestMessageSendLater(user0.token, channel0.channelId, 'Test Message 1', 0600);
        const msg1Full = {
            message: 'Test Message 1',
            messageId: msg1.messageId,
            uId: user0.authUserId,
            timeSent: 0600
        };
        expect(requestChannelMessages(user0.token, channel0.channelId, 0).messages).toContainEqual(msg1Full);
    });

    // channelId does not refer to a valid channel
    test(('invalid channel'), () => {
        expect(requestMessageSendLater(user.token, 1000, 'Test Message', 0600)).toStrictEqual(400);
    });

    // length of the message is less than 1
    test(('message length < 1'), () => {
        expect(requestMessageSendLater(user.token, 1000, '', 0600)).toStrictEqual(400);
    });

    // length of the message is over 1000 characters
    test(('message length > 1000'), () => {
        expect(requestMessageSendLater(user.token, 1000, bigMessage, 0600)).toStrictEqual(400);
    });

    // timeSent is a time in the past ?????

    // channelId is valid and the authorised user is not a member of the channel they are trying to post to
    test(('authorised user is not a member of the channel'), () => {
        expect(requestMessageSendLater(user1.token, channel0.channelId, 'Test Message 1', 0600)).toStrictEqual(403);
    });

    // token is invalid

});