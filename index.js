// set server timezone to UTC
process.env.TZ = "utc";

import { createServer } from 'node:http';
import express from 'express';
import psList from 'ps-list';

// loading environment variables
import { config as configEnv } from 'dotenv';
configEnv();
import { getDiskInfo } from './disk-info.js';


const PORT = process.env.PORT || 3000;

const app = express();

app.get('', (_, res) => {
  res.send("Use /system-info to get server details");
});

app.get('/system-info', async (_, res) => {
  const responseObj = { timestamp: new Date() };
  try {
    const processes = (await psList({ all: false })).map(p => { });
    const hdd = await getDiskInfo();
    res.status(200).send({ hello: 'world' });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

createServer(app).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


// Response schema for '/system-info' endpoint
/*
{
  response: {
    code: number,
    error?: string,
    data: {
      timestamp: string,      // DateTime Format (in UTC)
      activeProcesses: [
        {

        }
      ],
      diskInfo: [

      ]
    }
  }
}
*/