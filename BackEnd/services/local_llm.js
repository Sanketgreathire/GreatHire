const { spawnSync } = require('child_process');
const axios = require('axios');

function _findJsonSubstring(text) {
  if (!text || typeof text !== 'string') return null;
  // Strip common markdown code fences
  text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''));

  const starts = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{' || ch === '[') starts.push(i);
  }

  for (const start of starts) {
    let stack = [];
    let end = -1;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (ch === '{' || ch === '[') stack.push(ch);
      if (ch === '}' || ch === ']') {
        stack.pop();
        if (stack.length === 0) {
          end = i;
          break;
        }
      }
    }
    if (end > start) {
      const candidate = text.slice(start, end + 1);
      try {
        const parsed = JSON.parse(candidate);
        return parsed;
      } catch (e) {
        // continue trying other candidates
      }
    }
  }
  return null;
}

async function generateChatCompletion({ prompt, timeout = 60000 } = {}) {
  // Option A: call a local HTTP model server
  if (process.env.LOCAL_MODEL_URL) {
    const url = process.env.LOCAL_MODEL_URL;
    const body = { prompt };
    const res = await axios.post(url, body, { timeout });
    // prefer common shapes
    if (res.data?.text) return res.data.text;
    if (typeof res.data === 'string') return res.data;
    return JSON.stringify(res.data);
  }

  // Option B: shell out to a local CLI that reads prompt from stdin
  if (process.env.LOCAL_MODEL_CMD) {
    const cmd = process.env.LOCAL_MODEL_CMD;
    const result = spawnSync(cmd, {
      input: prompt,
      shell: true,
      encoding: 'utf-8',
      timeout,
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(result.stderr || 'Local model CLI failed');
    }
    return result.stdout;
  }

  throw new Error('LOCAL_MODEL_URL or LOCAL_MODEL_CMD must be set to use local model mode');
}

module.exports = { generateChatCompletion, _findJsonSubstring };
