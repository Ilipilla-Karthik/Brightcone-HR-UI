import fs from 'fs';
import path from 'path';

async function cdpRequest(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function runBrowserFlow() {
  const userProfile = process.env.USERPROFILE || 'C:\\Users\\satvi';
  const outDir = path.join(userProfile, '.gemini', 'antigravity-ide', 'brain', 'da2f3938-af14-4e5a-be31-31230f3dff2e', 'browser');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Connecting to headless Chrome on port 9222...');
  const newTabRes = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
  const tab = await newTabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.addEventListener('open', resolve));

  let reqId = 1;
  await cdpRequest(ws, reqId++, 'Page.enable');
  await cdpRequest(ws, reqId++, 'Runtime.enable');

  // 1. Navigate to http://127.0.0.1:3000/login
  console.log('Navigating to http://127.0.0.1:3000/login...');
  await cdpRequest(ws, reqId++, 'Page.navigate', { url: 'http://127.0.0.1:3000/login' });
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Perform Admin Login
  console.log('Submitting Admin credentials via UI form...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        function setReactInput(input, val) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          setter.call(input, val);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        setReactInput(document.querySelector('#email'), 'ananya.rao@brightcone.ai');
        setReactInput(document.querySelector('#password'), 'Admin@123');
        document.querySelector('button[type="submit"]').click();
      })()
    `,
  });

  // Wait for login request, localStorage save, and redirect to /learn/dashboard
  await new Promise((r) => setTimeout(r, 4000));

  // Capture screenshot of authenticated Admin Dashboard
  const adminScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const adminPath = path.join(outDir, 'prod_admin_dashboard_interactive.png');
  fs.writeFileSync(adminPath, Buffer.from(adminScreen.data, 'base64'));
  console.log(`Saved ${adminPath} (${fs.statSync(adminPath).size} bytes)`);

  // Verify current location
  const locEval = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Admin redirected to:', locEval.result.value);

  // 3. Test Logout via UI
  console.log('Clicking Sign Out button...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `document.querySelector('button[title="Sign out"]').click();`,
  });
  await new Promise((r) => setTimeout(r, 2000));

  const afterLogoutEval = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('After logout, path is:', afterLogoutEval.result.value);

  // 4. Perform Employee Login
  console.log('Submitting Employee credentials via UI form...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        function setReactInput(input, val) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          setter.call(input, val);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        setReactInput(document.querySelector('#email'), 'rahul.varma@brightcone.ai');
        setReactInput(document.querySelector('#password'), 'Welcome@123');
        document.querySelector('button[type="submit"]').click();
      })()
    `,
  });

  // Wait for login request, localStorage save, and redirect to /learn/my-learning
  await new Promise((r) => setTimeout(r, 4000));

  // Capture screenshot of Employee My Learning
  const empScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const empPath = path.join(outDir, 'prod_employee_learning_interactive.png');
  fs.writeFileSync(empPath, Buffer.from(empScreen.data, 'base64'));
  console.log(`Saved ${empPath} (${fs.statSync(empPath).size} bytes)`);

  const empLocEval = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Employee redirected to:', empLocEval.result.value);

  await cdpRequest(ws, reqId++, 'Page.close');
  ws.close();
  console.log('Interactive browser flow completed successfully.');
}

runBrowserFlow().catch(console.error);
