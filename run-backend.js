const { spawn, execSync } = require('child_process');
const path = require('path');

const services = [
  { name: 'auth',             port: 3000 },
  { name: 'product',          port: 3001 },
  { name: 'cart',             port: 3002 },
  { name: 'order',            port: 3003 },
  { name: 'payment',          port: 3004 },
  { name: 'ai-buddy',         port: 3005 },
  { name: 'notification',     port: 3006 },
  { name: 'seller-dashboard', port: 3007 },
];

/**
 * Kill any process currently listening on a given port (Windows).
 */
function freePort(port) {
  try {
    const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', shell: true });
    if (!result) return;

    const lines = result.split(/\r?\n/).filter(line => line.includes('LISTENING'));
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid) && pid !== '0') {
          pids.add(pid);
        }
      }
    }

    [...pids].forEach(pid => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { shell: true, stdio: 'ignore' });
        console.log(`  Freed port ${port} (killed PID ${pid})`);
      } catch (_) {}
    });
  } catch (_) {
    // Port was already free or command failed
  }
}

console.log('\nStarting ShopMantra Backend Microservices...');
console.log('Clearing ports...');
services.forEach(({ port }) => freePort(port));
console.log('All ports cleared.\n');

const children = [];

function startService(name) {
  const serviceDir = path.join(__dirname, name);
  const child = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, name),
    stdio: 'pipe',
  });

  child.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[${name}] ERR: ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}. Restarting in 2s...`);
    setTimeout(() => {
      startService(name);
    }, 2000);
  });

  children.push(child);
}

services.forEach(({ name }) => {
  startService(name);
});

console.log('\nAll 8 microservices successfully launched and monitored in background!');

// Keep manager alive so children aren't torn down on Windows console exit
setInterval(() => {}, 60000);
// Triggered restart 4
