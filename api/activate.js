// Serverless function for SiriusXM activation
// Deploy to Vercel/Netlify for static hosting with backend functionality

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { radioId } = req.body;

  if (!radioId || radioId.length !== 12) {
    return res.status(400).json({ error: 'Invalid Radio ID' });
  }

  let progress = [];

  try {
    // Generate UUID for this session
    const uuid4 = generateUUID();
    const radioIdUpper = radioId.toUpperCase();

    // Step 1: App Config
    await appConfig();
    progress.push('✓ App config completed');

    // Step 2: Login
    const authToken = await login();
    if (!authToken) {
      throw new Error('Login failed');
    }
    progress.push('✓ Login completed');

    // Step 3: Version Control
    await versionControl(authToken, uuid4);
    progress.push('✓ Version control completed');

    // Step 4: Get Properties
    await getProperties(authToken, uuid4);
    progress.push('✓ Properties retrieved');

    // Step 5: Update 1
    const seq = await update1(authToken, uuid4, radioIdUpper);
    if (!seq) {
      throw new Error('Device update failed');
    }
    progress.push(`✓ Device update initiated - Seq: ${seq}`);

    // Step 6: Get CRM
    await getCRM(authToken, uuid4, radioIdUpper, seq);
    progress.push('✓ CRM data retrieved');

    // Step 7: DB Update
    await dbUpdate(authToken, uuid4, radioIdUpper, seq);
    progress.push('✓ Database updated');

    // Step 8: Blocklist
    await blocklist(authToken, uuid4);
    progress.push('✓ Blocklist checked');

    // Step 9: Oracle
    await oracle();
    progress.push('✓ Oracle validation completed');

    // Step 10: Create Account
    const accountSuccess = await createAccount(authToken, uuid4, radioIdUpper, seq);
    if (!accountSuccess) {
      throw new Error('Account creation failed');
    }
    progress.push('✓ Account created successfully');

    // Step 11: Final Update
    const updateSuccess = await update2(authToken, uuid4, radioIdUpper);
    if (!updateSuccess) {
      throw new Error('Final update failed');
    }
    progress.push('✓ Final update completed successfully');
    progress.push('🎉 Activation completed successfully!');

    return res.status(200).json({
      success: true,
      progress: progress,
      message: 'Activation completed successfully!'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      progress: progress
    });
  }
}

// Helper functions (converted from Python)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function appConfig() {
  const response = await fetch('https://dealerapp.siriusxm.com/authService/100000002/appconfig', {
    method: 'POST',
    headers: {
      'X-Kony-Integrity': 'GWSUSEVMJK;FEC9AA232EC59BE8A39F0FAE1B71300216E906B85F40CA2B1C5C7A59F85B17A4',
      'X-HTTP-Method-Override': 'GET',
      'X-Voltmx-App-Key': '67cfe0220c41a54cb4e768723ad56b41',
      'Accept': '*/*',
      'X-Voltmx-App-Secret': 'c086fca8646a72cf391f8ae9f15e5331',
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error('App config failed');
  }
}

async function login() {
  const response = await fetch('https://dealerapp.siriusxm.com/authService/100000002/login', {
    method: 'POST',
    headers: {
      'X-Voltmx-Platform-Type': 'ios',
      'Accept': 'application/json',
      'X-Voltmx-App-Secret': 'c086fca8646a72cf391f8ae9f15e5331',
      'Accept-Language': 'en-us',
      'X-Voltmx-SDK-Type': 'js',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-SDK-Version': '9.5.36',
      'X-Voltmx-App-Key': '67cfe0220c41a54cb4e768723ad56b41'
    }
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.claims_token?.value;
}

async function versionControl(authToken, uuid4) {
  const params = new URLSearchParams({
    'deviceCategory': 'iPhone',
    'appver': '3.1.0',
    'deviceLocale': 'en_US',
    'deviceModel': 'iPhone%206%20Plus',
    'deviceVersion': '12.5.7',
    'deviceType': ''
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/DealerAppService7/VersionControl', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Version control failed');
  }
}

async function getProperties(authToken, uuid4) {
  const response = await fetch('https://dealerapp.siriusxm.com/services/DealerAppService7/getProperties', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    }
  });

  if (!response.ok) {
    throw new Error('Get properties failed');
  }
}

async function update1(authToken, uuid4, radioId) {
  const params = new URLSearchParams({
    'deviceId': radioId,
    'appVersion': '3.1.0',
    'lng': '-86.210313195',
    'deviceID': uuid4,
    'provisionPriority': '2',
    'provisionType': 'activate',
    'lat': '32.37436705'
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/USUpdateDeviceSATRefresh/updateDeviceSATRefreshWithPriority', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Update 1 failed');
  }

  const data = await response.json();
  return data.seqValue;
}

async function getCRM(authToken, uuid4, radioId, seq) {
  const params = new URLSearchParams({
    'seqVal': seq,
    'deviceId': radioId
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/DemoConsumptionRules/GetCRMAccountPlanInformation', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Get CRM failed');
  }
}

async function dbUpdate(authToken, uuid4, radioId, seq) {
  const params = new URLSearchParams({
    'OM_ELIGIBILITY_STATUS': 'Eligible',
    'appVersion': '3.1.0',
    'flag': 'failure',
    'Radio_ID': radioId,
    'deviceID': uuid4,
    'G_PLACES_REQUEST': '',
    'OS_Version': 'iPhone 12.5.7',
    'G_PLACES_RESPONSE': '',
    'Confirmation_Status': 'SUCCESS',
    'seqVal': seq
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/DBSuccessUpdate/DBUpdateForGoogle', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Database update failed');
  }
}

async function blocklist(authToken, uuid4) {
  const params = new URLSearchParams({
    'deviceId': uuid4
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/USBlockListDevice/BlockListDevice', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Blocklist check failed');
  }
}

async function oracle() {
  const url = new URL('https://oemremarketing.custhelp.com/cgi-bin/oemremarketing.cfg/php/custom/src/oracle/program_status.php');
  url.searchParams.append('google_addr', '395 EASTERN BLVD, MONTGOMERY, AL 36117, USA');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate'
    }
  });

  if (!response.ok) {
    throw new Error('Oracle check failed');
  }
}

async function createAccount(authToken, uuid4, radioId, seq) {
  const params = new URLSearchParams({
    'seqVal': seq,
    'deviceId': radioId,
    'oracleCXFailed': '1',
    'appVersion': '3.1.0'
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/DealerAppService3/CreateAccount', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Create account failed');
  }

  const data = await response.json();
  return String(data).includes('SUCCESS');
}

async function update2(authToken, uuid4, radioId) {
  const params = new URLSearchParams({
    'deviceId': radioId,
    'provisionPriority': '2',
    'appVersion': '3.1.0',
    'device_Type': 'iPhone iPhone 6 Plus',
    'deviceID': uuid4,
    'os_Version': 'iPhone 12.5.7',
    'provisionType': 'activate'
  });

  const response = await fetch('https://dealerapp.siriusxm.com/services/USUpdateDeviceRefreshForCC/updateDeviceSATRefreshWithPriority', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'X-Voltmx-API-Version': '1.0',
      'X-Voltmx-DeviceId': uuid4,
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'br, gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'SiriusXM%20Dealer/3.1.0 CFNetwork/1568.200.51 Darwin/24.1.0',
      'X-Voltmx-Authorization': authToken
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Update 2 failed');
  }

  const data = await response.json();
  return String(data).includes('SUCCESS');
}
