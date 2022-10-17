import request from 'sync-request';
import config from './config.json';

import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { channelDetailsV2 } from './channel';
import { authRegisterV2 } from './auth';

import { requestAuthRegister } from './auth.test';
import { requestHelper, requestClear, getAuthUserId, getChannel, getUId } from './other';


export function requestChannelsCreate (token: string, name: string, isPublic: boolean) {
    return requestHelper('POST', '/channels/create/v2', { token, name, isPublic });
}


requestClear();
let user = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');

describe('channelsCreate tests', () => {

    beforeEach(() => {
        requestClear();
        user = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
    })

    afterEach(() => {
        requestClear();
    })

    test('Error Returns', () => {
        expect(requestChannelsCreate(user.token, '', true)).toStrictEqual({ error: expect.any(String) });
        expect(requestChannelsCreate(user.token, 'Thisisaverylongchannelname', true)).toStrictEqual({ error: expect.any(String) });
        expect(requestChannelsCreate('abc', 'Channel1', true)).toStrictEqual({ error: expect.any(String) });
    })

    test('Correct Return', () => {
        // const target_user = getAuthUserId(user.authUserId);
        const channel_created = requestChannelsCreate(user.token, 'Channel1', true);

        expect(channel_created).toStrictEqual({ channelId: expect.any(Number) });

        /*
        expect(channelDetailsV1(userid, channel_created.channelId)).toStrictEqual( {
            name: 'Channel1',
            isPublic: true,
            ownerMembers: [
                {
                  uId: target_user.authUserId,
                  email: target_user.email,
                  nameFirst: target_user.nameFirst,
                  nameLast: target_user.nameLast,
                  handleStr: target_user.user_handle,
                },
              ],
              allMembers: [
                {
                  uId: target_user.authUserId,
                  email: target_user.email,
                  nameFirst: target_user.nameFirst,
                  nameLast: target_user.nameLast,
                  handleStr: target_user.user_handle,
                },
              ]
            } )
            */
    })


})


describe('ChannelsListAll tests', () => {
    let uid;
    // User needs to be created in order test this function
    beforeEach(() =>{
        clearV1();
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
        clearV1();
        user = authRegisterV1('example1@gmail.com', 'Abcd1234', 'Luke', 'Smith').authUserId
    })

    afterEach (() => {
        clearV1();

    })

    test ('Testing error return', () => {
        expect(channelsListV1('abcd')).toStrictEqual( {error: expect.any(String)} );
    })

    test ('testing user in multiple channels', () => {
        const channel = channelsCreateV1(user, 'Channel', true);
        const channel1 = channelsCreateV1(user, 'Channel1', true);
        const channel2 = channelsCreateV1(user, 'Channel2', true);

        expect(channelsListV1(user)).toStrictEqual( {
            channels: [
                {
                    channelId: channel.channelId,
                    name: 'Channel',
                },
                {
                    channelId: channel1.channelId,
                    name: 'Channel1',
                },
                {
                    channelId: channel2.channelId,
                    name: 'Channel2',
                },

            ]
        })
    })

    test ('testing channel owner in channel', () => {
        const channel3 = channelsCreateV1(user, 'Channel3', true);

        expect(channelsListV1(user)).toStrictEqual ({
            channels: [
                {
                    channelId: channel3.channelId,
                    name: 'Channel3',
                }
            ]
        })

    })

    test ('Testing if no channel is creating', () => {
        expect(channelsListV1(user)).toStrictEqual({
            channels: []
        })

    })

})
