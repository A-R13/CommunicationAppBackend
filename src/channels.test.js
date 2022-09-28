import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { clearV1 } from './other';
import { getData, setData } from './dataStore';

describe('channelsCreate tests', () => {
    const sample_data = {
        'users': [
            {   'id': 1,
                'email' : "user1@ad.unsw.edu.au",
                'nameFirst' : 'user1',
                'nameLast' : 'last1',
                'handle' : 'user1last1',
            },
            ],
    };

    beforeEach(() => {
        setData(sample_data); 
        let userid = sample_data.id;
    })

    afterEach(() => {
        clearV1();
    })

    test('Error Returns', () => {
        expect(channelsCreateV1(userid, '', true)).toStrictEqual({ error: expect.any(String) });
        expect(channelsCreateV1(userid, 'Thisisaverylongchannelname', true)).toStrictEqual({ error: expect.any(String) });
        expect(channelsCreateV1(abc, 'Channel1', true)).toStrictEqual({ error: expect.any(String) });
    })
    
    test('Correct Return', () => {
        const channel_created = channelsCreateV1(userid, 'Channel1', true);

        expect(course).toStrictEqual({ channelId: expect.any(Number) });
    })


})