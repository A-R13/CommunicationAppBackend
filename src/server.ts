import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2, channelleaveV1 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';

import { dmCreateV1, messageSendV1, dmMessagesV1, dmRemoveV1, dmDetailsV1, dmListV1, messageEditV1 } from './messages';

import { userProfileV2, userSetNameV1, usersAllV1 } from './users';
import { clearV1 } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// for logging errors (print to terminal)
app.use(morgan('dev'));

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

app.post('/auth/login/v2', (req: Request, res: Response, next) => {
  const { email, password } = req.body;

  res.json(authLoginV2(email, password));
});

app.post('/auth/register/v2', (req: Request, res: Response, next) => {
  const { email, password, nameFirst, nameLast } = req.body;

  res.json(authRegisterV2(email, password, nameFirst, nameLast));
});

app.post('/channels/create/v2', (req: Request, res: Response, next) => {
  const { token, name, isPublic } = req.body;

  res.json(channelsCreateV2(token, name, isPublic));
});

app.get('/channels/listall/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(channelsListAllV2(token));
});

app.get('/user/profile/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const uId = req.query.uId as string;

  res.json(userProfileV2(token, parseInt(uId)));
});

app.get('/channel/details/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;

  res.json(channelDetailsV2(token, parseInt(channelId)));
});

app.get('/channel/messages/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;
  const start = req.query.start as string;

  res.json(channelMessagesV2(token, parseInt(channelId), parseInt(start)));
});

app.post('/channel/join/v2', (req: Request, res: Response, next) => {
  const { token, channelId } = req.body;

  res.json(channelJoinV2(token, parseInt(channelId)));
});

app.post('/channel/invite/v2', (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;

  res.json(channelInviteV2(token, parseInt(channelId), parseInt(uId)));
});

app.get('/channels/list/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(channelsListV2(token));
});

app.post('/channel/leave/v1', (req: Request, res: Response, next) => {
  const { token, channelId } = req.body;

  res.json(channelleaveV1(token, channelId));
});

app.post('/dm/create/v1', (req: Request, res: Response, next) => {
  const { token, uIds } = req.body;

  res.json(dmCreateV1(token, uIds));
});

app.post('/message/send/v1', (req: Request, res: Response, next) => {
  const { token, channelId, message } = req.body;

  res.json(messageSendV1(token, channelId, message));
});

app.put('/message/edit/v1', (req: Request, res: Response, next) => {
  const { token, messageId, message } = req.body;

  res.json(messageEditV1(token, messageId, message));
});

app.post('/auth/logout/v1', (req: Request, res: Response, next) => {
  const { token } = req.body;

  res.json(authLogoutV1(token));
});

app.delete('/dm/remove/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;

  res.json(dmRemoveV1(token, parseInt(dmId)));
});

app.get('/dm/messages/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const start = req.query.start as string;

  res.json(dmMessagesV1(token, parseInt(dmId), parseInt(start)));
});

app.get('/dm/details/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;

  res.json(dmDetailsV1(token, parseInt(dmId)));
});

app.get('/dm/list/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(dmListV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response, next) => {
  const { token, nameFirst, nameLast } = req.body;

  res.json(userSetNameV1(token, nameFirst, nameLast));
});

app.get('/users/all/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(usersAllV1(token));
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
