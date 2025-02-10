const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios')

// Load environment variables

dotenv.config();
const app = express();
const PORT = 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// GitHub OAuth callback route
app.post('/api/github/callback', async (req, res) => {
  const { code } = req.body; 
  console.log('post here:', code);
  console.log('CLIENT_ID:', process.env.VITE_GITHUB_CLIENT_ID);
  console.log('CLIENT_SECRET:', process.env.VITE_GITHUB_CLIENT_SECRET);
  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.VITE_GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );
    console.log('post response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.log('post error:', error);
    console.error('GitHub OAuth Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Health check route
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});