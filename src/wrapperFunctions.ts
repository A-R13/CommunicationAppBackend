import { port, url } from './config.json';

import request, { HttpVerb } from 'sync-request';
const SERVER_URL = `${url}:${port}`;

export function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json });
  return JSON.parse(res.getBody('utf-8'));
}

export function requestClear() {
  return requestHelper('DELETE', '/clear/v1', {});
}

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}

export function requestAuthLogin(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v2', { email, password });
}

export function requestAuthLogout(token: string) {
  return requestHelper('POST', '/auth/logout/v1', { token });
}

export function requestChannelsCreate (token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v2', { token, name, isPublic });
}

export function requestChannelsListAll (token: string) {
  return requestHelper('GET', '/channels/listall/v2', { token });
}

export function requestChannelsList (token: string) {
  return requestHelper('GET', '/channels/list/v2', { token });
}

export function requestchannelDetails(token : string, channelId : number) {
  return requestHelper('GET', '/channel/details/v2', { token, channelId });
}

export function requestChannelMessages(token : string, channelId : number, start: number) {
  return requestHelper('GET', '/channel/messages/v2', { token, channelId, start });
}

export function requestChannelJoin(token : string, channelId: number) {
  return requestHelper('POST', '/channel/join/v2', { token, channelId });
}

export function requestChannelInvite(token : string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v2', { token, channelId, uId });
}

export function requestChannelLeave(token : string, channelId: number) {
  return requestHelper('POST', '/channel/leave/v1', { token, channelId });
}

export function requestUserProfile (token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v2', { token, uId });
}

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}

export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message });
}

export function requestDmRemove(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v1', { token, dmId });
}

export function requestDmMessages(token : string, dmId : number, start: number) {
  return requestHelper('GET', '/dm/messages/v1', { token, dmId, start });
}

export function requestDmDetails(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v1', { token, dmId });
}

export function requestDmList(token: string) {
  return requestHelper('GET', '/dm/list/v1', { token });
}

export function requestUserSetName(token: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/user/profile/setname/v1', { token, nameFirst, nameLast });
}

export function requestMessageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v1', { token, messageId, message });
}

export function requestUsersAll(token: string) {
  return requestHelper('GET', '/users/all/v1', { token });
}

export function requestAddOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/addowner/v1', { token, channelId, uId });
}

export function requestMessageSendDm(token: string, dmId: number, message: string) {
  return requestHelper('POST', '/message/senddm/v1', { token, dmId, message });
}

export function requestDmLeave(token: string, dmId: number) {
  return requestHelper('POST', '/dm/leave/v1', { token, dmId });
}

export function requestUserSetHandle(token: string, handleStr: string) {
  return requestHelper('PUT', '/user/profile/sethandle/v1', { token, handleStr });
}

export function requestUserSetEmail(token: string, email: string) {
  return requestHelper('PUT', '/user/profile/setemail/v1', { token, email });
}
