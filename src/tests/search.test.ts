import {
  requestClear, requestAuthRegister, requestDmCreate, requestChannelsCreate, requestSearch, requestMessageSend, 
  requestMessageSendDm, requestChannelJoin
} from '../wrapperFunctions';
// Function Wrappers using above function

requestClear(); // Need to call it here before calling it in the beforeEach for some reason.

beforeEach(() => {
  requestClear();
  user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
  user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
  dm = requestDmCreate(user0.token, [user1.authUserId]);
  channel = requestChannelsCreate(user0.token, 'Channel1', true);
  requestChannelJoin(user1.token, channel.channelId);
  requestMessageSend(user0.token, channel.channelId, 'Test Message Channel')
  requestMessageSendDm(user0.token, dm.dmId, 'Test Message Dm')

});

describe('Testing Search function', () => {
  test('Error return (Empty query)', () => {
    expect(requestSearch(user0.token, '')).toStrictEqual(400);
  })

  test('Error return (Query is too long)', () => {
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
    expect(requestSearch(user0.token, bigMessage)).toStrictEqual(400);
  })

  test('Successful return in channel', () => {
    // Search is called by user who sent the message in the channel
    requestSearch(user0.token, 'Test Message Cha').toStrictEqual({
      messages: [
        { 
          messageId: expect.any(number), 
          uId: expect.any(number), 
          message: 'Test Message Channel',
          timeSent: expect.any(number),
          reacts:  expect.any(Array),
          isPinned: expect.any(Boolean)
        }
      ]
    })
  })

  test('Successful return in channel', () => {
    // search is called by another member in the channel
    requestSearch(user1.token, 'Test Message Cha').toStrictEqual({
      messages: [
        { 
          messageId: expect.any(number), 
          uId: expect.any(number), 
          message: 'Test Message Channel',
          timeSent: expect.any(number),
          reacts:  expect.any(Array),
          isPinned: expect.any(Boolean)
        }
      ]
    })
  })

  test('Successful return in Dm', () => {
    // search is called by user who sent the message in the Dm
    requestSearch(user0.token, 'Test Message Dm').toStrictEqual({
      messages: [
        { 
          messageId: expect.any(number), 
          uId: expect.any(number), 
          message: 'Test Message Dm',
          timeSent: expect.any(number),
          reacts:  expect.any(Array),
          isPinned: expect.any(Boolean)
        }
      ]
    })
  })

  test('Successful return in Dm', () => {
    // search is called by another member of the Dm  
    requestSearch(user0.token, 'Test Message Dm').toStrictEqual({
      messages: [
        { 
          messageId: expect.any(number), 
          uId: expect.any(number), 
          message: 'Test Message Dm',
          timeSent: expect.any(number),
          reacts:  expect.any(Array),
          isPinned: expect.any(Boolean)
        }
      ]
    })
  })

  test('Successful return (Multiple Messages Match)', () => {
    requestMessageSend(user0.token, channel.channelId, 'Test Message Channel2')
    requestSearch(user0.token, 'Test Message Cha').toStrictEqual({
      messages: [
        { 
          messageId: expect.any(number), 
          uId: expect.any(number), 
          message: 'Test Message Channel',
          timeSent: expect.any(number),
          reacts:  expect.any(Array),
          isPinned: expect.any(Boolean)
        },

        { 
          messageId: expect.any(number), 
          uId: expect.any(number), 
          message: 'Test Message Channel2',
          timeSent: expect.any(number),
          reacts:  expect.any(Array),
          isPinned: expect.any(Boolean)
        }
      ]
    })
  })

  test('Successful return (No messages Match)', () => {
    requestMessageSend(user0.token, channel.channelId, 'Test Message Channel2')
    requestSearch(user0.token, 'No match').toStrictEqual({
      messages: []
    })
  })

})