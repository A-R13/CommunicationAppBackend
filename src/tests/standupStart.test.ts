import { newUser, newChannel } from '../dataStore';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestStandupStart
} from '../wrapperFunctions';

requestClear();

let user1: newUser;
let channel1: newChannel;

beforeEach(() => {
  requestClear();

  user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
  channel1 = requestChannelsCreate(user1.token, 'Channel1', false);
});

afterEach(() => {
  requestClear();
});

describe('Error Testing', () => {
  test('error returns', () => {
    // invalid channel
    expect(requestStandupStart(user1.token, 99, 10)).toStrictEqual(400);

    // user is already in channel
    expect(requestStandupStart(user1.token, channel1.channelId, -2)).toStrictEqual(400);

    // A standup is already running
    requestStandupStart(user1.token, channel1.channelId, 10);
    expect(requestStandupStart(user1.token, channel1.channelId, 3)).toStrictEqual(400);

    // invalid user
    expect(requestStandupStart('abcde', channel1.channelId, 3)).toStrictEqual(403);
  });
});

describe('Correct Return', () => {
  test('Correct return', () => {
    expect(requestStandupStart(user1.token, channel1.channelId, 10)).toStrictEqual({ timeFinish: expect.any(Number) });
  });
});
