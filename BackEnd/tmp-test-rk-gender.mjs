import axios from 'axios';
import 'dotenv/config';

const RK_KEY = process.env.RECRUITKAR_API_KEY;
const rk = axios.create({
  baseURL: 'https://api.recruitkar.com/v1',
  headers: { Authorization: `Bearer ${RK_KEY}`, 'Content-Type': 'application/json' },
  timeout: 20000,
});

async function tryPreview(label, filters) {
  try {
    const { data } = await rk.post('/person/preview', { filters });
    console.log(`[${label}] OK ->`, JSON.stringify(data));
  } catch (err) {
    console.log(`[${label}] ERROR ${err.response?.status} ->`, JSON.stringify(err.response?.data || err.message));
  }
}

await tryPreview('baseline-skills', { field: 'skills', type: '(.)', value: 'javascript' });
await tryPreview('gender-eq', { field: 'gender', type: '=', value: 'female' });
await tryPreview('gender-dot', { field: 'gender', type: '(.)', value: 'female' });
await tryPreview('sex-eq', { field: 'sex', type: '=', value: 'female' });
