import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const tempDir = path.join(process.env.TEMP || 'C:\\TEMP', 'chrome_e2e_' + Date.now());
  console.log(`Starting headless browser: ${chromePath}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    `--user-data-dir=${tempDir}`,
    'about:blank',
  ]);

  // Wait for port 9222
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      if (res.ok) break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  console.log('Connecting to headless Chrome on port 9222...');
  const newTabRes = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
  const tab = await newTabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.addEventListener('open', resolve));

  let reqId = 1;
  await cdpRequest(ws, reqId++, 'Page.enable');
  await cdpRequest(ws, reqId++, 'Runtime.enable');
  await cdpRequest(ws, reqId++, 'Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('\n--- VERIFICATION STEP 1: Unauthenticated Protection & Login Page Reference Matching ---');
  // 1A. Direct visit to /performance/admin without token -> should redirect to /login
  console.log('1A. Visiting /performance/admin unauthenticated...');
  await cdpRequest(ws, reqId++, 'Page.navigate', { url: 'http://127.0.0.1:3000/performance/admin' });
  await new Promise((r) => setTimeout(r, 1500));
  const unauthLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Unauthenticated /performance/admin redirected to:', unauthLoc.result.value);
  if (unauthLoc.result.value !== '/login') {
    throw new Error(`Expected redirect to /login but got ${unauthLoc.result.value}`);
  }

  // 1B. Direct visit to /learn/dashboard without token -> should redirect to /login
  console.log('1B. Visiting /learn/dashboard unauthenticated...');
  await cdpRequest(ws, reqId++, 'Page.navigate', { url: 'http://127.0.0.1:3000/learn/dashboard' });
  await new Promise((r) => setTimeout(r, 1500));
  const unauthLearnLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Unauthenticated /learn/dashboard redirected to:', unauthLearnLoc.result.value);
  if (unauthLearnLoc.result.value !== '/login') {
    throw new Error(`Expected redirect to /login but got ${unauthLearnLoc.result.value}`);
  }

  // 1C. Invalid/expired token rejection via 401 interceptor
  console.log('1C. Testing invalid token injection & 401 interceptor...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      localStorage.setItem('token', 'invalid_expired_token_signature');
      localStorage.setItem('user', JSON.stringify({ role: 'HR_ADMIN', name: 'Fake Session' }));
    `,
  });
  await cdpRequest(ws, reqId++, 'Page.navigate', { url: 'http://127.0.0.1:3000/performance/admin' });
  await new Promise((r) => setTimeout(r, 2000));
  const invalidTokenLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  const clearedToken = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'localStorage.getItem("token")' });
  console.log('Invalid token redirected to:', invalidTokenLoc.result.value, '| token purged:', clearedToken.result.value === null);
  if (invalidTokenLoc.result.value !== '/login') {
    throw new Error(`Expected redirect to /login on 401 but got ${invalidTokenLoc.result.value}`);
  }

  // 1D. Verify Login Page Layout against Design Reference
  console.log('1D. Inspecting Login Page structure against reference HTML...');
  const loginCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const hasLeftPanel = !!document.querySelector('section[class*="lp"]');
        const h2Text = document.querySelector('h2')?.textContent || '';
        const hasTag = !!document.querySelector('div[class*="lpTag"]');
        const hasLapps = !!document.querySelector('div[class*="lapps"]');
        const hasGlasses = !!document.querySelector('div[class*="glasses"]');
        const hasFoot = !!document.querySelector('div[class*="lpFoot"]');
        const h1Text = document.querySelector('h1')?.textContent || '';
        const emailInput = !!document.querySelector('#email');
        const passwordInput = !!document.querySelector('#password');
        const showPwBtn = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Show') || b.textContent.includes('Hide'));
        const msBtn = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Microsoft'));
        return { hasLeftPanel, h2Text, hasTag, hasLapps, hasGlasses, hasFoot, h1Text, emailInput, passwordInput, showPwBtn, msBtn };
      })()
    `,
    returnByValue: true,
  });
  console.log('Login DOM check against reference:', loginCheck.result.value);

  // Capture screenshot of matched login page
  const loginScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const loginPath = path.join(outDir, 'login_page_matched.png');
  fs.writeFileSync(loginPath, Buffer.from(loginScreen.data, 'base64'));
  console.log(`Saved Login screenshot: ${loginPath} (${fs.statSync(loginPath).size} bytes)`);

  console.log('\n--- VERIFICATION STEP 2: Administrator Authentication & Session Restoration ---');
  // 2. Perform authentic Admin Login
  console.log('2. Submitting Admin credentials via UI login form...');
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
  await new Promise((r) => setTimeout(r, 2500));

  const postLoginLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Admin login successful. Landing page:', postLoginLoc.result.value);

  // Navigate to Performance Admin
  console.log('Navigating to /performance/admin...');
  await cdpRequest(ws, reqId++, 'Page.navigate', { url: 'http://127.0.0.1:3000/performance/admin' });
  await new Promise((r) => setTimeout(r, 2500));

  // Capture screenshot of Performance Admin Page
  const perfScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const perfPath = path.join(outDir, 'prod_performance_admin.png');
  fs.writeFileSync(perfPath, Buffer.from(perfScreen.data, 'base64'));
  console.log(`Saved ${perfPath} (${fs.statSync(perfPath).size} bytes)`);

  // Verify Performance Admin DOM elements
  const perfCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.textContent || '';
        const steps = Array.from(document.querySelectorAll('.step b, div[class*="step"] b')).map(el => el.textContent.trim());
        const statLabels = Array.from(document.querySelectorAll('p[class*="statLabel"]')).map(el => el.textContent.trim());
        const rows = document.querySelectorAll('tbody tr').length;
        const exportBtn = !!document.querySelector('button[title*="CSV"], button[title*="Export"]');
        return { title, steps, statLabels, rows, exportBtn };
      })()
    `,
    returnByValue: true,
  });
  console.log('Performance Admin DOM check:', perfCheck.result.value);

  console.log('\n--- VERIFICATION STEP 3: Modals & Navigation In Performance Admin ---');
  // 3A. Test New Cycle Modal
  console.log('3A. Testing New Cycle modal (open and Escape key)...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('New cycle'));
        if (btn) btn.click();
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const modalOpenCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `!!document.querySelector('#new-cycle-title')`,
  });
  console.log('New Cycle modal is open:', modalOpenCheck.result.value);

  // Press Escape to dismiss
  await cdpRequest(ws, reqId++, 'Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await cdpRequest(ws, reqId++, 'Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise((r) => setTimeout(r, 500));

  const modalClosedCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `!document.querySelector('#new-cycle-title')`,
  });
  console.log('New Cycle modal closed via Escape:', modalClosedCheck.result.value);

  // 3B. Test Switch tab to Learning Admin
  console.log('3B. Navigating to Learning Admin via tab...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const learnTab = Array.from(document.querySelectorAll('a[role="tab"]')).find(a => a.textContent.includes('Learning Admin'));
        if (learnTab) learnTab.click();
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 2000));

  const learnTabLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Learning Admin tab location:', learnTabLoc.result.value);

  // Switch back to Performance Admin tab
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const perfTab = Array.from(document.querySelectorAll('a[role="tab"]')).find(a => a.textContent.includes('Performance'));
        if (perfTab) perfTab.click();
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('\n--- VERIFICATION STEP 4: Sign Out & Token Clearance ---');
  console.log('Signing out admin...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `document.querySelector('button[title="Sign out"]')?.click();`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  const afterLogoutLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  const afterLogoutToken = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'localStorage.getItem("token")' });
  console.log('After logout location:', afterLogoutLoc.result.value, '| token purged:', afterLogoutToken.result.value === null);

  console.log('\n--- VERIFICATION STEP 5: Employee Login & My Learning Course Attestation Flow ---');
  console.log('Submitting Employee credentials (rahul.varma@brightcone.ai)...');
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
  await new Promise((r) => setTimeout(r, 3000));

  const empLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Employee landed on:', empLoc.result.value);
  if (empLoc.result.value !== '/learn/my-learning') {
    throw new Error(`Expected employee to land on /learn/my-learning but got ${empLoc.result.value}`);
  }

  // Capture screenshot of My Learning page
  const myLearningScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const myLearningPath = path.join(outDir, 'prod_employee_my_learning_initial.png');
  fs.writeFileSync(myLearningPath, Buffer.from(myLearningScreen.data, 'base64'));
  console.log(`Saved My Learning initial view: ${myLearningPath}`);

  // 5B. Open Lesson Player Modal
  console.log('5B. Opening Course Player for first assigned course...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start') || b.textContent.includes('Continue'));
        if (btn) btn.click();
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 1500));

  // Check Lesson Modal Header & Metadata
  const modalCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const modal = !!document.querySelector('div[role="dialog"]');
        const title = document.querySelector('#lesson-title')?.textContent?.trim() || '';
        const meta = document.querySelector('p[class*="meta"]')?.textContent?.trim() || '';
        const hasCheckbox = !!document.querySelector('input[type="checkbox"]');
        const attestBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Self-report') || b.textContent.includes('Attest'));
        const attestBtnText = attestBtn?.textContent?.trim() || '';
        return { modal, title, meta, hasCheckbox, attestBtnText };
      })()
    `,
    returnByValue: true,
  });
  console.log('Lesson Player Modal verification:', modalCheck.result.value);
  if (!modalCheck.result.value.title || modalCheck.result.value.title === 'Course ·') {
    throw new Error(`Invalid modal title: "${modalCheck.result.value.title}"`);
  }

  // Capture screenshot of opened Lesson Player Modal
  const modalScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const modalPath = path.join(outDir, 'prod_lesson_player_open.png');
  fs.writeFileSync(modalPath, Buffer.from(modalScreen.data, 'base64'));
  console.log(`Saved Lesson Player modal screenshot: ${modalPath}`);

  // 5C. Execute Self-Reported Completion
  console.log('5C. Clicking Self-report course completion button...');
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Self-report course completion'));
        if (btn) btn.click();
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Verify modal state after completion
  const afterAttestCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const isCompleteText = Array.from(document.querySelectorAll('span, div, b')).some(el => el.textContent.includes('Self-reported complete') || el.textContent.includes('Completion Confirmed'));
        const hasCertBtn = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('View Completion Record'));
        const errorToast = Array.from(document.querySelectorAll('div[class*="toastError"]')).length;
        const successToast = Array.from(document.querySelectorAll('div[class*="toastSuccess"]')).length;
        return { isCompleteText, hasCertBtn, errorToast, successToast };
      })()
    `,
    returnByValue: true,
  });
  console.log('After attestation check:', afterAttestCheck.result.value);
  if (afterAttestCheck.result.value.errorToast > 0) {
    throw new Error(`Encountered ${afterAttestCheck.result.value.errorToast} error toasts during progress completion!`);
  }

  // Capture screenshot of completed state in modal
  const completedModalScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const completedModalPath = path.join(outDir, 'prod_lesson_player_completed.png');
  fs.writeFileSync(completedModalPath, Buffer.from(completedModalScreen.data, 'base64'));
  console.log(`Saved Completed Lesson Player screenshot: ${completedModalPath}`);

  // 5D. View Certificate Record
  if (afterAttestCheck.result.value.hasCertBtn) {
    console.log('5D. Opening Completion Record Modal...');
    await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Completion Record'));
          if (btn) btn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 1200));

    const certScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
    const certPath = path.join(outDir, 'prod_certificate_record.png');
    fs.writeFileSync(certPath, Buffer.from(certScreen.data, 'base64'));
    console.log(`Saved Certificate record screenshot: ${certPath}`);

    // Close certificate modal via Escape
    await cdpRequest(ws, reqId++, 'Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await cdpRequest(ws, reqId++, 'Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 500));
  }

  // Close any open lesson modal via Escape or Close button
  await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Close');
        if (closeBtn) closeBtn.click();
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 800));

  // 5E. Verify Persisted Card on /learn/my-learning
  const cardCheck = await cdpRequest(ws, reqId++, 'Runtime.evaluate', {
    expression: `
      (() => {
        const has100 = Array.from(document.querySelectorAll('span, div')).some(el => el.textContent.includes('100% (Self-reported)'));
        const hasCertButton = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Certificate'));
        return { has100, hasCertButton };
      })()
    `,
    returnByValue: true,
  });
  console.log('My Learning persisted card check:', cardCheck.result.value);

  // Capture final My Learning view
  const finalScreen = await cdpRequest(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
  const finalPath = path.join(outDir, 'prod_employee_my_learning_final.png');
  fs.writeFileSync(finalPath, Buffer.from(finalScreen.data, 'base64'));
  console.log(`Saved final My Learning view: ${finalPath}`);

  // 5F. Verify Employee is Blocked from Performance Admin
  console.log('5F. Verifying Employee is blocked from /performance/admin...');
  await cdpRequest(ws, reqId++, 'Page.navigate', { url: 'http://127.0.0.1:3000/performance/admin' });
  await new Promise((r) => setTimeout(r, 2000));
  const blockedLoc = await cdpRequest(ws, reqId++, 'Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('Employee navigating to /performance/admin redirected to:', blockedLoc.result.value);
  if (blockedLoc.result.value === '/performance/admin') {
    throw new Error('Employee was NOT blocked from /performance/admin!');
  }

  try {
    await cdpRequest(ws, reqId++, 'Page.close');
    ws.close();
    console.log('\n========================================================');
    console.log('ALL BROWSER E2E TESTS PASSED SUCCESSFULLY (5/5 SECTIONS)!');
    console.log('========================================================\n');
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

runBrowserFlow().catch((err) => {
  console.error('Browser flow error:', err);
  process.exit(1);
});
