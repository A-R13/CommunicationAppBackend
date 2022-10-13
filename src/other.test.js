import { clearV1, getAuthUserId, getChannel, getUId } from './other';
import { getData, setData } from './dataStore';

const expected_clear_data = {
    'users': [],
    'channels': [],
};

describe('Testing for clear', () => {
    test('Base Test', () => {
        const base_data = {
            'users': [
                {   'id': 1,
                    'name' : 'user1',},
                ],
            'channels': [
                {   'id': 1,
                    'name' : 'channel1',},
                ]
        };

        setData(base_data);
        const pushed_data = getData();
        expect(pushed_data).toMatchObject(base_data);
        clearV1();
        expect(getData()).toMatchObject(expected_clear_data);   
    })

    test('Test with 2 elements', () => {
        const sample_data = {       // Taken from the documentation for itertation 1
            'users': [
                {
                    'id': 1,
                    'name' : 'user1',
                },
                {
                    'id': 2,
                    'name' : 'user2',
                },
            ],
            'channels': [
                {
                    'id': 1,
                    'name' : 'channel1',
                },
                {
                    'id': 2,
                    'name' : 'channel2',
                },
            ],
        };
        
        setData(sample_data);
        const pushed_data = getData();
        expect(pushed_data).toMatchObject(sample_data);
        clearV1();
        expect(getData()).toMatchObject(expected_clear_data);  
    })

    test('Empty Data', () => {
        const empty_data = {
            'users': [],
            'channels': [],
        };

        setData(empty_data);
        const pushed_data = getData();
        expect(pushed_data).toMatchObject(empty_data);
        clearV1();
        expect(getData()).toMatchObject(expected_clear_data);   
    })
})