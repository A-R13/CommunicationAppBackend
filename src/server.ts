import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { readData, saveData, wipeData } from './dataStore';
import { authRegisterV3, authLoginV3, authLogoutV2 } from './auth';
import { channelDetailsV3, channelJoinV3, channelInviteV3, channelMessagesV3, channelleaveV2, addOwnerV2, removeOwnerV2 } from './channel';
import { channelsCreateV3, channelsListV2, channelsListAllV3 } from './channels';

import { dmCreateV2, messageSendV2, dmMessagesV2, dmRemoveV2, dmDetailsV2, dmListV2, messageEditV2, messageSendDmV2, dmLeaveV2, messageRemoveV2, messagePinV1} from './messages';
import { userProfileV3, usersAllV2, userSetNameV2, userSetEmailV2, userSetHandleV2 } from './users';
import { searchV1 } from './search';
import { standupStartV1 } from './standup';
import { clearV1 } from './other';

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  readData();
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  wipeData();
  res.json(clearV1());
});

app.post('/auth/login/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;
    saveData();
    return res.json(authLoginV3(email, password));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/register/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    saveData();
    return res.json(authRegisterV3(email, password, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.post('/channels/create/v3', (req: Request, res: Response, next) => {
  try {
    const { name, isPublic } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(channelsCreateV3(token, name, isPublic));
  } catch (err) {
    next(err);
  }
});

app.get('/channels/listall/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    return res.json(channelsListAllV3(token));
  } catch (err) {
    next(err);
  }
});

app.get('/user/profile/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const uId = req.query.uId as string;

    return res.json(userProfileV3(token, parseInt(uId)));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/details/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.query.channelId as string;
    return res.json(channelDetailsV3(token, parseInt(channelId)));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/messages/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.query.channelId as string;
    const start = req.query.start as string;

    return res.json(channelMessagesV3(token, parseInt(channelId), parseInt(start)));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/join/v3', (req: Request, res: Response, next) => {
  try {
    const { channelId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(channelJoinV3(token, parseInt(channelId)));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/invite/v3', (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    saveData();
    return res.json(channelInviteV3(token, parseInt(channelId), parseInt(uId)));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/removeowner/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    saveData();
    return res.json(removeOwnerV2(token, parseInt(channelId), parseInt(uId)));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/addowner/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(addOwnerV2(token, parseInt(channelId), parseInt(uId)));
  } catch (err) {
    next(err);
  }
});

app.get('/channels/list/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    res.json(channelsListV2(token));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/leave/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(channelleaveV2(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/create/v2', (req: Request, res: Response, next) => {
  try {
    const { uIds } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(dmCreateV2(token, uIds));
  } catch (err) {
    next(err);
  }
});

app.post('/message/send/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId, message } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(messageSendV2(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.put('/message/edit/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, message } = req.body;
    return res.json(messageEditV2(token, messageId, message));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/logout/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    saveData();

    return res.json(authLogoutV2(token));
  } catch (err) {
    next(err);
  }
});

app.delete('/dm/remove/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.query.dmId as string;
    saveData();

    return res.json(dmRemoveV2(token, parseInt(dmId)));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/messages/v2', (req: Request, res: Response, next) => {
  try {
    const dmId = req.query.dmId as string;
    const start = req.query.start as string;
    const token = req.header('token');

    return res.json(dmMessagesV2(token, parseInt(dmId), parseInt(start)));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/details/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.query.dmId as string;

    res.json(dmDetailsV2(token, parseInt(dmId)));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/list/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    return res.json(dmListV2(token));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setname/v2', (req: Request, res: Response, next) => {
  try {
    const { nameFirst, nameLast } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(userSetNameV2(token, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.get('/users/all/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    return res.json(usersAllV2(token));
  } catch (err) {
    next(err);
  }
});

app.post('/message/senddm/v2', (req: Request, res: Response, next) => {
  try {
    const { dmId, message } = req.body;
    const token = req.header('token');

    res.json(messageSendDmV2(token, parseInt(dmId), message));
    saveData();
  } catch (err) {
    next(err);
  }
});

app.post('/dm/leave/v2', (req: Request, res: Response, next) => {
  try {
    const { dmId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(dmLeaveV2(token, parseInt(dmId)));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response, next) => {
  try {
    const { handleStr } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(userSetHandleV2(token, handleStr));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response, next) => {
  try {
    const { email } = req.body;
    const token = req.header('token');

    saveData();
    res.json(userSetEmailV2(token, email));
  } catch (err) {
    next(err);
  }
});

app.delete('/message/remove/v2', (req: Request, res: Response, next) => {
  try {
    const messageId = req.query.messageId as string;
    const token = req.header('token');

    saveData();
    return res.json(messageRemoveV2(token, parseInt(messageId)));
  } catch (err) {
    next(err);
  }
});

app.post('/message/pin/v1', (req: Request, res: Response, next) => {
  try {
    const { messageId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(messagePinV1(token, parseInt(messageId)));
  } catch (err) {
    next(err);
  }
});

app.get('/search/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const queryStr = req.query.queryStr as string;

    return res.json(searchV1(token, queryStr));
  } catch (err) {
    next(err);
  }
});

app.post('/standup/start/v1', (req: Request, res: Response, next) => {
  try {
    const { channelId, length } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(standupStartV1(token, parseInt(channelId), parseInt(length)));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
