import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import DashboardRouter from './Routes/DashboardRouter.js';
import https from 'https';
import dotenv from 'dotenv';
import connectDb from './Models/db.js';
import { google } from 'googleapis';
import session from 'cookie-session';
import { sendMessageToGemini } from "./geminiApi.js";


// Configure environment variables
dotenv.config();

const app = express();

//database
connectDb();

// Middlewares
app.use(bodyParser.json());

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Explicitly allow this origin
  credentials: true, // Allow cookies or credentials
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Explicitly allow this origin
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});


app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

app.use(
  session({
      name: 'session',
      keys: ['key1', 'key2'],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
// Routes
app.use('/auth', AuthRouter);
app.use('/dashboard', DashboardRouter);
const PORT = process.env.PORT || 8080;

//this is to test your server on localhost8080/ping , if you get pong response means your server is running fine  
app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/dashboard', DashboardRouter);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})


//gemini
app.post("/api/gemini", async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  try {
    const response = await sendMessageToGemini(userMessage);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//msg91
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;


// Send OTP endpoint
app.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  const options = {
    method: 'POST',
    hostname: 'control.msg91.com',
    path: `/api/v5/otp?otp_expiry=600&template_id=&mobile=${phone}&authkey=${MSG91_AUTH_KEY}&realTimeResponse=1`,
    headers: {
      'Content-Type': 'application/JSON',
    },
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const body = Buffer.concat(chunks);
      const responseData = JSON.parse(body.toString());
      if (responseData.type === 'success') {
        res.status(200).json({ success: true, message: 'OTP sent successfully', data: responseData });
      } else {
        res.status(400).json({ success: false, message: responseData.message });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ success: false, message: error.message });
  });

  request.write(JSON.stringify({ mobile: phone, otp_length: 6, sender: 'Trial' }));
  request.end();
});



// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  const options = {
    method: 'POST',
    hostname: 'control.msg91.com',
    path: `/api/v5/otp/verify?otp=${otp}&mobile=${phone}`,
    headers: {
      authkey: MSG91_AUTH_KEY,
      'Content-Type': 'application/JSON',
    },
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const body = Buffer.concat(chunks);
      const responseData = JSON.parse(body.toString());
      if (responseData.type === 'success') {
        res.status(200).json({ success: true, message: 'OTP verified successfully', data: responseData });
      } else {
        res.status(400).json({ success: false, message: responseData.message });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ success: false, message: error.message });
  });

  request.end();
});
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  next();
});


//googlefit
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:8080/auth/callback' // Redirect URI
);
app.get('/auth', (req, res) => {
  const scopes = [
      'https://www.googleapis.com/auth/fitness.activity.read',
      //new datasource
      'https://www.googleapis.com/auth/fitness.blood_glucose.read',
  'https://www.googleapis.com/auth/fitness.blood_pressure.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.body_temperature.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
  'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  ];
  const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
  });
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  try {
      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      req.session.tokens = tokens; // Save tokens in session
    //  res.redirect('http://localhost:3000/googlefit'); // Redirect to front-end dashboard
      res.redirect('http://localhost:3000/userdashboard');
  } catch (error) {
      console.error('Error in /auth/callback:', error.message);
      res.status(500).send('Authentication failed');
  }
});

// app.get('/api/fit-data', async (req, res) => {
//   //console.log('Request received at /api/fit-data');
//   try {
//       if (!req.session.tokens) {
//           return res.status(401).send('Unauthorized');
//       }
//       oauth2Client.setCredentials(req.session.tokens);

//       const fitness = google.fitness('v1');
//       const response = await fitness.users.dataset.aggregate({
//           userId: 'me',
//           auth: oauth2Client,
//           requestBody: {
//               aggregateBy: [
//                   {
//                       dataTypeName: 'com.google.step_count.delta',
//                   },
//                   //additional data source
//                   {
//                     dataTypeName: 'com.google.heart_rate.bpm',
//                   },
//                   {
//                     dataTypeName: 'com.google.blood_glucose',
//                    },
//                   {
//                     dataTypeName: 'com.google.blood_pressure',
//                     },
//                   {
//                     dataTypeName: 'com.google.body.temperature',
//                     },
//                   {
//                     dataTypeName: 'com.google.nutrition',
//                     },
//                   {
//                     dataTypeName: 'com.google.oxygen_saturation',
//                      },
//                   {
//                     dataTypeName: 'com.google.sleep.segment',
//                      },
//                 ],
//                 bucketByTime: { durationMillis: 86400000 }, // Daily buckets
//                 startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
//                 endTimeMillis: Date.now(),
//               },
//             });
        
//             const data = response.data.bucket.map((bucket) => ({
//               startTimeMillis: bucket.startTimeMillis,
//               endTimeMillis: bucket.endTimeMillis,
//               dataset: bucket.dataset.map((dataset) => ({
//                 dataTypeName: dataset.dataTypeName,
//                 points: dataset.point.map((point) => ({
//                   startTimeNanos: point.startTimeNanos,
//                   endTimeNanos: point.endTimeNanos,
//                   values: point.value,
//                 })),
//               })),
//             }));
        
//             if (response.data && response.data.bucket) {
//               res.json({ bucket: data });
//             } else {
//               res.status(500).send('No data returned from Google Fit API');
//             }
//           } catch (error) {
//             console.error('Error fetching Google Fit data:', error.message);
//             res.status(500).send('Failed to fetch data');
//           }
//         });
app.get('/api/fit-data', async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).send('Unauthorized');
    }
    oauth2Client.setCredentials(req.session.tokens);

    const fitness = google.fitness('v1');
    const response = await fitness.users.dataset.aggregate({
      userId: 'me',
      auth: oauth2Client,
      requestBody: {
        aggregateBy: [
          { dataTypeName: 'com.google.step_count.delta' },
          { dataTypeName: 'com.google.blood_glucose' },
          { dataTypeName: 'com.google.blood_pressure' },
          { dataTypeName: 'com.google.heart_rate.bpm' },
          { dataTypeName: 'com.google.weight' },
          { dataTypeName: 'com.google.height' },
          { dataTypeName: 'com.google.sleep.segment' },
          { dataTypeName: 'com.google.body.fat.percentage' },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: Date.now() - 90 * 24 * 60 * 60 * 1000, // Last 90 days
        endTimeMillis: Date.now(),
      },
    });

    const fitnessData = response.data.bucket;
    const formattedData = [];

    fitnessData.map((data) => {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedDate = date.toDateString();

      const formattedEntry = {
        date: formattedDate,
        step_count: 0,
        glucose_level: 0,
        blood_pressure: [],
        heart_rate: 0,
        weight: 0,
        height_in_cms: 0,
        sleep_hours: 0,
        body_fat_in_percent: 0,
      };

      data.dataset.forEach((dataset) => {
        //console.log('Dataset Source ID:', dataset.dataSourceId);
        const point = dataset.point;
        if (point && point.length > 0) {
          const value = point[0].value;
          switch (dataset.dataSourceId) {
            case 'derived:com.google.step_count.delta:com.google.android.gms:aggregated':
              formattedEntry.step_count = value[0]?.intVal || 0;
              break;
            case 'derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated':
              if (value?.length > 0) {
                formattedEntry.glucose_level = value[0]?.fpVal * 10 || 0;
              }
              break;
            case 'derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated':
              if (value?.length > 1) {
                formattedEntry.blood_pressure = [value[0]?.fpVal || 0, value[1]?.fpVal || 0];
              }
              break;
            case 'derived:com.google.heart_rate.summary:com.google.android.gms:aggregated':
              if (value?.length > 0) {
                formattedEntry.heart_rate = value[0]?.fpVal || 0;
              }
              break;
            case 'derived:com.google.weight.summary:com.google.android.gms:aggregated':
              formattedEntry.weight = value[0]?.fpVal || 0;
              break;
            case 'derived:com.google.height.summary:com.google.android.gms:aggregated':
              formattedEntry.height_in_cms = value[0]?.fpVal * 100 || 0;
              break;
            case 'derived:com.google.sleep.segment:com.google.android.gms:merged':
              formattedEntry.sleep_hours = value[0]?.intVal || 0;
              break;
            case 'derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated':
              formattedEntry.body_fat_in_percent = value[0]?.fpVal || 0;
              break;

            default:
              break;
          }
        }
      });

      formattedData.push(formattedEntry);
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching Google Fit data:', error.message);
    res.status(500).send('Failed to fetch data');
  }
});


//sleep data seperate 
app.get('/api/sleep-data', async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).send('Unauthorized');
    }

    oauth2Client.setCredentials(req.session.tokens);
    const fitness = google.fitness('v1');
    const sleepSessionsResponse = await fitness.users.sessions.list({
      userId: 'me',
      auth: oauth2Client,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
      endTime: new Date().toISOString(),
      activityType: 72, 
    });

    const sleepSessions = sleepSessionsResponse.data.session || [];
    const sleepDetails = [];

    for (const session of sleepSessions) {
      const startTimeMillis = parseInt(session.startTimeMillis);
      const endTimeMillis = parseInt(session.endTimeMillis);

      const sleepSegmentsResponse = await fitness.users.dataset.aggregate({
        userId: 'me',
        auth: oauth2Client,
        requestBody: {
          aggregateBy: [{ dataTypeName: 'com.google.sleep.segment' }],
          startTimeMillis,
          endTimeMillis,
        },
      });

      const sleepSegments = sleepSegmentsResponse.data.bucket || [];
      let sleepDuration = 0;
      const sleepStages = [];

      sleepSegments.forEach((bucket) => {
        const dataset = bucket.dataset[0] || {};
        dataset.point?.forEach((point) => {
          const startNanos = parseInt(point.startTimeNanos);
          const endNanos = parseInt(point.endTimeNanos);
          const stage = point.value[0]?.intVal; 

          sleepStages.push({
            stage,
            duration: (endNanos - startNanos) / (1000 * 60), 
          });

          sleepDuration += (endNanos - startNanos);
        });
      });

      sleepDetails.push({
        sessionId: session.id,
        startTime: new Date(startTimeMillis).toISOString(),
        endTime: new Date(endTimeMillis).toISOString(),
        totalSleepHours: sleepDuration / (1000 * 60 * 60), 
        sleepStages,
      });
    }

   
    res.json({
      sleepDetails,
      message: 'Sleep data retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching sleep data:', error.message);
    res.status(500).send('Failed to fetch data');
  }
});
