require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const ngrok = require('@ngrok/ngrok');
const path = require('path');
const ipaddr = require('ipaddr.js');

// ============ CONFIGURATION (Easy to update) ============
const CONFIG = {
    PORT: process.env.PORT || 3000,
    NGROK: {
        AUTHTOKEN: process.env.NGROK_AUTHTOKEN,
        DOMAIN: process.env.NGROK_DOMAIN
    },
    // Database configuration (easy to switch between Baserow/Airtable)
    DB: {
        TYPE: process.env.DB_TYPE || 'AIRTABLE',  // Change to 'BASEROW' if needed
        BASEROW: {
            API_TOKEN: process.env.BASEROW_API_TOKEN,
            TABLE_ID: process.env.BASEROW_TABLE_ID,
            BASE_URL: process.env.BASEROW_BASE_URL || 'https://api.baserow.io/api/database/rows/table'
        },
        AIRTABLE: {
            // Fix for Vercel: Ensure API key is properly retrieved
            API_KEY: process.env.AIRTABLE_API_KEY,
            BASE_ID: process.env.AIRTABLE_BASE_ID,
            TABLE_NAME: process.env.AIRTABLE_TABLE_NAME
        }
    },
    IPSTACK: {
        API_KEY: process.env.IPSTACK_API_KEY
    },
    // Environment detection
    IS_VERCEL: process.env.VERCEL === '1' || process.env.VERCEL === 'true'
};

// Log configuration on startup (without sensitive data)
console.log('Starting server with configuration:');
console.log('Environment:', process.env.NODE_ENV);
console.log('Vercel environment detected:', CONFIG.IS_VERCEL ? 'Yes' : 'No');
console.log('DB TYPE:', CONFIG.DB.TYPE);
console.log('AIRTABLE BASE ID:', CONFIG.DB.AIRTABLE.BASE_ID);
console.log('AIRTABLE TABLE:', CONFIG.DB.AIRTABLE.TABLE_NAME);
console.log('AIRTABLE API KEY:', CONFIG.DB.AIRTABLE.API_KEY ? 'Set (hidden)' : 'Not set');

// ============ Database Interface ============
const DatabaseService = {
    async submitQuiz(data) {
        if (CONFIG.DB.TYPE === 'BASEROW') {
            return axios({
                method: "POST",
                url: `${CONFIG.DB.BASEROW.BASE_URL}/${CONFIG.DB.BASEROW.TABLE_ID}/?user_field_names=true`,
                headers: {
                    Authorization: `Token ${CONFIG.DB.BASEROW.API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                data
            });
        } else if (CONFIG.DB.TYPE === 'AIRTABLE') {
            try {
                // Direct access to environment variables for Vercel compatibility
                const apiKey = process.env.AIRTABLE_API_KEY;
                const baseId = process.env.AIRTABLE_BASE_ID;
                const tableName = process.env.AIRTABLE_TABLE_NAME;
                
                const response = await axios({
                    method: "POST",
                    url: `https://api.airtable.com/v0/${baseId}/${tableName}`,
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    data: {
                        records: [{
                            fields: data
                        }]
                    }
                });
                
                // Transform Airtable response to match Baserow format
                return {
                    data: {
                        ...response.data.records[0].fields,
                        id: response.data.records[0].id
                    }
                };
            } catch (error) {
                console.error('Airtable API error:', error.message);
                throw error; // Re-throw to properly handle in the API endpoint
            }
        }
    },

    async updateQuiz(id, data) {
        if (CONFIG.DB.TYPE === 'BASEROW') {
            return axios({
                method: "PATCH",
                url: `${CONFIG.DB.BASEROW.BASE_URL}/${CONFIG.DB.BASEROW.TABLE_ID}/${id}/?user_field_names=true`,
                headers: {
                    Authorization: `Token ${CONFIG.DB.BASEROW.API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                data
            });
        } else if (CONFIG.DB.TYPE === 'AIRTABLE') {
            try {
                // Direct access to environment variables for Vercel compatibility
                const apiKey = process.env.AIRTABLE_API_KEY;
                const baseId = process.env.AIRTABLE_BASE_ID;
                const tableName = process.env.AIRTABLE_TABLE_NAME;
                
                const response = await axios({
                    method: "PATCH",
                    url: `https://api.airtable.com/v0/${baseId}/${tableName}`,
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    data: {
                        records: [{
                            id: id,
                            fields: data
                        }]
                    }
                });
                
                return {
                    data: {
                        success: true,
                        ...response.data
                    }
                };
            } catch (error) {
                console.error('Airtable API error during update:', error.message);
                throw error; // Re-throw to properly handle in the API endpoint
            }
        }
    }
};

// ============ Express App Setup ============
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Root path handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get IP and country information
app.get('/api/get-ip-info', async (req, res) => {
    try {
        // Get client IP (considering potential proxies)
        const clientIp = req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         req.socket.remoteAddress ||
                         '0.0.0.0';
                         
        // Clean the IP address
        let ip = clientIp;
        if (ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }
        if (ip.includes('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }
        
        // Use IPStack API to get country information
        if (CONFIG.IPSTACK.API_KEY) {
            try {
                const ipstackResponse = await axios({
                    method: 'GET',
                    url: `https://api.ipstack.com/${ip}?access_key=${CONFIG.IPSTACK.API_KEY}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 3000 // 3 second timeout to prevent long waits
                });
                
                if (ipstackResponse.data && ipstackResponse.data.country_name) {
                    return res.json({ 
                        ip: ip, 
                        country: ipstackResponse.data.country_name 
                    });
                } else {
                    console.log('IPStack API returned invalid data');
                    return res.json({ ip: ip, country: 'Unknown' });
                }
            } catch (ipError) {
                console.error('IPStack API error:', ipError.message);
                return res.json({ ip: ip, country: 'Unknown' });
            }
        } else {
            console.log('IPStack API key not configured');
            return res.json({ ip: ip, country: 'Unknown' });
        }
    } catch (error) {
        console.error('IP detection error:', error);
        res.json({ ip: 'unknown', country: 'Unknown' });
    }
});

// Submit quiz results
app.post('/api/submit-quiz', async (req, res) => {
    const { IP, COUNTRY, RESULT, ANSWERS, FULLRESULT, USER_LEVEL } = req.body;
    
    try {
        const data = {
            IP: IP || 'unknown',
            COUNTRY: COUNTRY || 'unknown',
            RESULT: RESULT,
            ANSWERS: ANSWERS || '',
            FULLRESULT: FULLRESULT || '',
            USER_LEVEL: USER_LEVEL || 'unknown'
        };
        
        // Direct access to environment variables for Vercel compatibility
        const apiKey = process.env.AIRTABLE_API_KEY;
        const baseId = process.env.AIRTABLE_BASE_ID;
        const tableName = process.env.AIRTABLE_TABLE_NAME;
        
        // Log the Airtable config for debugging
        console.log('Airtable config for submit:', {
            apiKeyExists: !!apiKey,
            baseId,
            tableName
        });
        
        const response = await DatabaseService.submitQuiz(data);
        res.json(response.data);
    } catch (error) {
        console.error('Error submitting quiz result:', error.message);
        if (error.response) {
            console.error('API response error:', error.response.status, error.response.data);
        }
        // Return a simple response with temp ID to prevent client errors
        res.json({ id: 'temp-id' });
    }
});

// Update quiz with email
app.put('/api/update-quiz/:id', async (req, res) => {
    const { id } = req.params;
    const { EMAIL } = req.body;
    
    // Handle invalid ID
    if (!id || id === 'null' || id === 'undefined' || id === 'temp-id') {
        return res.json({ success: false });
    }
    
    try {
        // Direct access to environment variables for Vercel compatibility
        const apiKey = process.env.AIRTABLE_API_KEY;
        const baseId = process.env.AIRTABLE_BASE_ID;
        const tableName = process.env.AIRTABLE_TABLE_NAME;
        
        // Log the Airtable config for debugging
        console.log('Airtable config for update:', {
            apiKeyExists: !!apiKey,
            baseId,
            tableName,
            id: id
        });
        
        const response = await DatabaseService.updateQuiz(id, { EMAIL });
        res.json(response.data);
    } catch (error) {
        console.error('Error updating quiz result:', error.message);
        if (error.response) {
            console.error('API response error:', error.response.status, error.response.data);
        }
        res.json({ success: false });
    }
});

// Get IP info
app.get('/api/ip-info', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        // Return IP info directly without external API call for Vercel
        return res.json({ ip: clientIp, country: 'Unknown' });
    } catch (error) {
        console.error('IP detection error:', error);
        res.json({ ip: 'unknown', country: 'unknown' });
    }
});

// Test endpoint to check Airtable structure
app.get('/api/test-airtable', async (req, res) => {
    try {
        // Direct access to environment variables for Vercel compatibility
        const apiKey = process.env.AIRTABLE_API_KEY;
        const baseId = process.env.AIRTABLE_BASE_ID;
        const tableName = process.env.AIRTABLE_TABLE_NAME;
        
        // Log the Airtable config for debugging
        console.log('Airtable config for test:', {
            apiKeyExists: !!apiKey,
            baseId,
            tableName
        });
        
        const response = await axios({
            method: 'GET',
            url: `https://api.airtable.com/v0/${baseId}/${tableName}`,
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Airtable test error:', error.message);
        if (error.response) {
            console.error('API response error:', error.response.status, error.response.data);
        }
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// Start server
app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
});

// Set up ngrok
ngrok.connect({ 
    addr: CONFIG.PORT, 
    authtoken: CONFIG.NGROK.AUTHTOKEN,
    domain: CONFIG.NGROK.DOMAIN,
    request_header_add: ['ngrok-skip-browser-warning:true']
})
.then(listener => {
    console.log(`Ingress established at: ${listener.url()}`);
})
.catch(error => {
    console.error('Error setting up ngrok:', error);
});
