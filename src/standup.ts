import HTTPError from 'http-errors';

import { userShort } from './dataStore';
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

  return { timeFinish: timeFinish };
}

/**
 * <Description: Checks if a standup in the channel is active>
 *
 * @param {number} channelId - unique ID for a channel
 *
 * @returns {status: boolean} - status of standup
 * @returns {timeFinish: number} - Finishing time of standup
 */

export function standupActiveV1(token: string, channelId: number, length: number): { isActive: boolean, timeFinish: number } {
  const channel = getChannel(channelId);
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  } else if (channel === undefined) {
    throw HTTPError(400, `Error: Channel with channelId '${channelId}' does not exist!`);
  }

  const userInChannel = channel.allMembers.find((a: userShort) => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channelId}'!`);
  }

  if (channel.standup.status === true) {
    if (Math.floor(Date.now() / 1000) > channel.standup.timeFinish) {
      channel.standup.status = false;
      channel.standup.timeFinish = null;

      return {
        isActive: false,
        timeFinish: null
      };
    } else {
      channel.standup.status = true;

      return {
        isActive: true,
        timeFinish: channel.standup.timeFinish
      };
    }
  }
  return {
    isActive: false,
    timeFinish: null
  };
}
