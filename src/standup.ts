import HTTPError from 'http-errors';

import { getData, userShort } from './dataStore';
import { SECRET, getHashOf, getToken, getChannel } from './helperFunctions';

export function standupStartV1(token: string, channelId: number, length: number): { timeFinish: number } {
  const channel = getChannel(channelId);

  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  } else if (channel === undefined) {
    throw HTTPError(400, `Error: Channel with channelId '${channelId}' does not exist!`);
  } else if (length < 0) {
    throw HTTPError(400, 'Error: Length cannot be negative!');
  }

  if (channel.standup.status === true) {
    if (Math.floor(Date.now() / 1000) > channel.standup.timeFinish) {
      channel.standup.status = false;
      channel.standup.timeFinish = null;
      channel.standup.starter = null;
    } else {
      throw HTTPError(400, 'Error: There is an active standup in this channel!');
    }
  } 

  const userInChannel = channel.allMembers.find((a: userShort) => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channelId}'!`);
  }

  const timeFinish = Math.floor(Date.now() / 1000) + length;

  // Add an object to the channel
  // standup : { status: active, timeFinish: number }

  channel.standup.status = true;
  channel.standup.timeFinish = timeFinish;
  channel.standup.starter = user.authUserId;

  return { timeFinish: timeFinish };
}

export function standupSendV1(token: string, channelId: number, message: string) {



}