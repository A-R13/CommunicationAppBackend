import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels.js';
import { channelDetailsV1 } from './channel.js';
import { authRegisterV1 } from './auth.js';
import { clearV1 , getAuthUserId, getChannel, getUId } from './other.js';
import { getData, setData } from './dataStore.js';

describe('channelsCreate tests', () => {

    let userid;

    beforeEach(() => {
        userid = authRegisterV1('example1@gmail.com', 'ABCD1234', 'John', 'Doe').authUserId;
    })

    afterEach(() => {
        clearV1();
    })

    test('Error Returns', () => {
        expect(channelsCreateV1(userid, '', true)).toStrictEqual({ error: expect.any(String) });
        expect(channelsCreateV1(userid, 'Thisisaverylongchannelname', true)).toStrictEqual({ error: expect.any(String) });
        expect(channelsCreateV1('abc', 'Channel1', true)).toStrictEqual({ error: expect.any(String) });
    })
    
    test('Correct Return', () => {
        const user = getAuthUserId(userid);
        const channel_created = channelsCreateV1(userid, 'Channel1', true);

        expect(channel_created).toStrictEqual({ channelId: expect.any(Number) });

        expect(channelDetailsV1(userid, channel_created.channelId)).toStrictEqual( {
            name: 'Channel1', 
            isPublic: true,
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
              ]
            } )
    })


})


describe('ChannelsListAll tests', () => {
    let uid;
    // User needs to be created in order test this function
    beforeEach(() =>{
        uid = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana').authUserId;
    })

    afterEach(() => {
        clearV1();
    });

    test ('Testing successful channelsListAll (Private and Public)', () => {
        const channel1 = channelsCreateV1(uid, 'Channel1', true);
        const channel2 = channelsCreateV1(uid, 'Channel2', false);

        expect(channelsListAllV1(uid)).toStrictEqual({
            channels: [
                {
                    channelId: channel1.channelId,
                    name: 'Channel1',
                },
                {
                    channelId: channel2.channelId,
                    name: 'Channel2',
                }
            ]
        })
    })

    test ('Testing successful channelsListAll (More Channels))', () => {

        const channel1 = channelsCreateV1(uid, 'Channel1', true);
        const channel2 = channelsCreateV1(uid, 'Channel2', false);
        const channel3 = channelsCreateV1(uid, 'Channel3', false);
        const channel4 = channelsCreateV1(uid, 'Channel4', false);

        expect(channelsListAllV1(uid)).toStrictEqual({
            channels: [
                {
                    channelId: channel1.channelId,
                    name: 'Channel1',
                },
                {
                    channelId: channel2.channelId,
                    name: 'Channel2',
                },
                {
                    channelId: channel3.channelId,
                    name: 'Channel3',
                },
                {
                    channelId: channel4.channelId,
                    name: 'Channel4',
                },
            ]
        })
    })
    test ('Testing successful channelsListAll (No channels)', () => {
        expect(channelsListAllV1(uid)).toStrictEqual({
            channels: []
        })

    })

    test ('Testing failed channelsListAll (invalid authUserId)', () => {
        const channel = channelsCreateV1(uid, 'Channel', false);
        expect(channelsListAllV1(uid + 1)).toStrictEqual({error: expect.any(String)});
    })

})


describe('channelsListV1 tests', () => {

    let user; 

    beforeEach (() => {
        user = authRegisterV1('example1@gmail.com', 'Abcd1234', 'Luke', 'Smith').authUserId
    })

    afterEach (() => {
        clearV1(); 

    })

    test ('Testing error return', () => {
        expect(channelsListV1('abcd')).toStrictEqual( {error: expect.any(String)} );
    })

    test ('Check for channels user is authorised in', () => {
        const channel = channelsCreateV1(user, 'Channel', true);

        expect(channelsListV1(channel.channelId)).toStrictEqual( {
            channels: [
                {
                    channelId: channel.channelId,
                    name: 'Channel',
                }
            ]
        })

    })

    test ('Testing if no channel is creating', () => {
        expect(channelsListAllV1(user)).toStrictEqual({
            channels: []
        })

    })
    

})