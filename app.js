import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sendEmail } from './controllers/email_sent.js';

const app = express();

// CORS - Allow only your frontend domain
const corsOptions = {
  origin: "*"  ,
  methods: ['GET', 'POST']
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Thermox Backend - Email Service');
});

app.post('/send-email', sendEmail);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});