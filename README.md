# Growth Assessment Quiz

This web application provides a personalized growth assessment quiz that helps users identify which of five growth levels best describes their current journey.

## Setup Instructions

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/AIfoldenfinger/1to5quiz.git
   cd 1to5quiz
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.sample` to `.env`
   - Fill in your API keys and configuration values in the `.env` file
   ```
   cp .env.sample .env
   ```

4. Start the development server:
   ```
   npm start
   ```

### Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. Add all environment variables from `.env.sample` in the Render dashboard:
   - Go to Dashboard > Your Service > Environment
   - Add each key-value pair from your local `.env` file

5. Deploy your application

## Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 3000) |
| DB_TYPE | Database type ('AIRTABLE' or 'BASEROW') |
| AIRTABLE_API_KEY | Airtable API key (if using Airtable) |
| AIRTABLE_BASE_ID | Airtable base ID (if using Airtable) |
| AIRTABLE_TABLE_NAME | Airtable table name (if using Airtable) |
| BASEROW_API_TOKEN | Baserow API token (if using Baserow) |
| BASEROW_TABLE_ID | Baserow table ID (if using Baserow) |
| IPSTACK_API_KEY | IPStack API key for geolocation |

For local development with ngrok tunneling:
| Variable | Description |
|----------|-------------|
| NGROK_AUTHTOKEN | Your ngrok authentication token |
| NGROK_DOMAIN | Your custom ngrok domain (if available) |

## Security Note

Never commit your `.env` file to Git. The `.gitignore` file is configured to exclude it automatically.
