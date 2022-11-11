import { newUser, newChannel, newDm, message } from '../dataStore';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestAdminUserRemove, requestChannelJoin, requestUsersAll, requestUserProfile, requestDmCreate,
  requestMessageSend, requestChannelMessages, requestMessageSendDm, requestDmMessages, requestMessagePin
} from '../wrapperFunctions';

requestClear();

let user1: newUser;
let user2: newUser;
let user3: newUser;

beforeEach(() => {
    requestClear();

    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Jeff', 'Doe');
});

afterEach(() => {
  requestClear();
});


describe('Error Return Tests', () => {

    test('400 Error returns', () => {

        // Invalid uId, user doesn't exist
        expect(requestAdminUserRemove(user1.token, 4)).toStrictEqual(400);

        // User 1 is the only global owner, so an error must be thrown.
        expect(requestAdminUserRemove(user3.token, user1.authUserId)).toStrictEqual(400);

    });

    test('403 Error Returns', () => {
        
        // Invalid token
        expect(requestAdminUserRemove('abcde', user1.authUserId)).toStrictEqual(400);
    });

});


describe('Correct Returns and correct changes', () => {



    test('Example Correct Return', () => {

        expect(requestUsersAll(user1.token).users).toContainEqual( {
            uId: 1,
            email: 'example2@gmail.com',
            nameFirst: 'Bob',
            nameLast: 'Doe',
            handleStr: 'bobdoe',
        });

        expect(requestUserProfile(user1.token, user2.authUserId)).toStrictEqual( {
            uId: 1,
            email: 'example2@gmail.com',
            nameFirst: 'Bob',
            nameLast: 'Doe',
            handleStr: 'bobdoe',
        });

        expect(requestAdminUserRemove(user1.token, user2.authUserId)).toStrictEqual( {} );

        expect(requestUserProfile(user1.token, user2.authUserId)).toStrictEqual( {
            uId: 1,
            email: '',
            nameFirst: 'Removed',
            nameLast: 'user',
            handleStr: '',
        });

        expect(requestUsersAll(user1.token).users).not.toContainEqual( {
            uId: 1,
            email: 'example2@gmail.com',
            nameFirst: 'Bob',
            nameLast: 'Doe',
            handleStr: 'bobdoe',
        });


    });

    let channel1: newChannel = requestChannelsCreate(user1.token, 'Channel1', true);
    requestChannelJoin(user2.token, channel1.channelId);
    requestChannelJoin(user3.token, channel1.channelId);

    
    test('Correct change for channel messages', () => {
        const msg1: message = requestMessageSend(user2.token, channel1.channelId, 'Message from user with uId 1');
        const msg2: message = requestMessageSend(user3.token, channel1.channelId, 'Message from user with uId 2');

        requestMessagePin(user1.token, msg2.messageId);
        // Add a react to the 2nd msg to see if the react sticks.
        expect(requestChannelMessages(user1.token, channel1.channelId, 0).messages).toStrictEqual([
            {
                message:'Message from user with uId 2',
                messageId: msg2.messageId,
                uId: user3.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: true
            },
            {
                message: 'Message from user with uId 1',
                messageId: msg1.messageId,
                uId: user2.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: false
            }
        ]);

        expect(requestAdminUserRemove(user1.token, user3.authUserId)).toStrictEqual( {} );

        expect(requestChannelMessages(user1.token, channel1.channelId, 0).messages).toStrictEqual([
            {
                message:'Removed user',
                messageId: msg2.messageId,
                uId: user3.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: true
            },
            {
                message: 'Message from user with uId 1',
                messageId: msg1.messageId,
                uId: user2.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: false
            }
        ]);
    });
    
    let dm1: newDm = requestDmCreate(user1.token, [1, 2]);

    test('Correct change for dm messages', () => {
        const msg1: message = requestMessageSendDm(user2.token, dm1.dmId, 'Message from user with uId 1');
        const msg2: message = requestMessageSendDm(user3.token, dm1.dmId, 'Message from user with uId 2');

        requestMessagePin(user1.token, msg2.messageId);
        // Add a react to the 2nd msg to see if the react sticks.
        expect(requestDmMessages(user1.token, dm1.dmId, 0).messages).toStrictEqual([
            {
                message:'Message from user with uId 2',
                messageId: msg2.messageId,
                uId: user3.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: true
            },
            {
                message: 'Message from user with uId 1',
                messageId: msg1.messageId,
                uId: user2.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: false
            }
        ]);

        expect(requestAdminUserRemove(user1.token, user3.authUserId)).toStrictEqual( {} );

        expect(requestDmMessages(user1.token, dm1.dmId, 0).messages).toStrictEqual([
            {
                message:'Removed user',
                messageId: msg2.messageId,
                uId: user3.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: true
            },
            {
                message: 'Message from user with uId 1',
                messageId: msg1.messageId,
                uId: user2.authUserId,
                timeSent: expect.any(Number),
                reacts:  expect.any(Array),
                isPinned: false
            }
        ]);
    });

});