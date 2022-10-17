import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import { authRegisterV2, authLoginV2 } from './auth';
import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { userProfileV2 } from './users';
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

app.post('/auth/register/v2', (req: Request, res: Response, next) => {
  const { email, password, nameFirst, nameLast } = req.body;

  res.json(authRegisterV2(email, password, nameFirst, nameLast));
})

app.post('/channels/create/v2',(req: Request, res: Response, next) => {
  const { token, name, isPublic } = req.body;

  res.json(channelsCreateV2(token, name, isPublic));
} )

app.get('/user/profile/v2',(req: Request, res: Response, next) => {
  const { token, uId } = req.body;

  res.json(userProfileV2(token, uId));
} )

app.get('/channel/details/v2',(req: Request, res: Response, next) => {
  const { token, channelId } = req.query;

  res.json(channelDetailsV2(token, channelId));
} )


// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
