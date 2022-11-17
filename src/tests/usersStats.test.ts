import { newChannel, newDm, newUser } from "../dataStore";
import { requestAuthRegister, requestClear, requestDmCreate, requestChannelsCreate, requestUsersStats} from "../wrapperFunctions";

requestClear();

let user0: newUser;
let user1: newUser;

let channel0: newChannel;
let dm0: newDm;

beforeEach(() => {
    requestClear;

    user0 = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    channel0 = requestChannelsCreate(user0.token, 'Channel1', false);

    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
})

afterEach(() => {
    requestClear();
  });
  
describe('Intial Testing', () => {
    test('error returns', () => {

        // invalid user
        expect(requestUsersStats('abcde')).toStrictEqual(403);
    });

    test('Correct Return', () => {
        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
                channelsExist: [
                    {numChannelsExist: 0, timeStamp: expect.any(Number)},
                    {numChannelsExist: 1, timeStamp: expect.any(Number)}
                ], 
                dmsExist: [{numDmsExist: 0, timeStamp: expect.any(Number)}], 
                messagesExist: [{numMessagesExist: 0, timeStamp: expect.any(Number)}], 
                utilizationRate: 0
            }
        })
    })
});

describe('Intial Testing 2 ', () => {

    

    test('Correct Return', () => {
        requestChannelsCreate(user0.token, 'Channel 2', true);

        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
                channelsExist: [
                    {numChannelsExist: 0, timeStamp: expect.any(Number)},
                    {numChannelsExist: 1, timeStamp: expect.any(Number)},
                    {numChannelsExist: 2, timeStamp: expect.any(Number)}
                ], 
                dmsExist: [{numDmsExist: 0, timeStamp: expect.any(Number)}], 
                messagesExist: [{numMessagesExist: 0, timeStamp: expect.any(Number)}], 
                utilizationRate: 0
            }
        })
    })
});