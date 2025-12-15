# Backend Configuration API Example

## Overview

This document provides examples of backend API implementations that can serve dynamic configuration for micro front-end remote applications based on region, environment, and other factors.

---

## Option 1: Node.js/Express API

```javascript
// server.js
const express = require('express');
const app = express();

// Configuration database or service
const configurations = {
  development: {
    'us-east-1': {
      region: 'us-east-1',
      environment: 'development',
      remotes: {
        commercialAuto: {
          name: 'commercial-auto-ui',
          url: 'http://localhost:4201',
          componentKey: './commercial-auto-app',
          region: 'us-east-1',
          version: '1.0.0',
        },
      },
    },
  },
  production: {
    'us-east-1': {
      region: 'us-east-1',
      environment: 'production',
      remotes: {
        commercialAuto: {
          name: 'commercial-auto-ui',
          url: 'https://commercial-auto-us-east.example.com',
          componentKey: './commercial-auto-app',
          region: 'us-east-1',
          version: '2.1.0',
        },
      },
    },
    'eu-west-1': {
      region: 'eu-west-1',
      environment: 'production',
      remotes: {
        commercialAuto: {
          name: 'commercial-auto-ui',
          url: 'https://commercial-auto-eu-west.example.com',
          componentKey: './commercial-auto-app',
          region: 'eu-west-1',
          version: '2.1.0',
        },
      },
    },
    'ap-southeast-1': {
      region: 'ap-southeast-1',
      environment: 'production',
      remotes: {
        commercialAuto: {
          name: 'commercial-auto-ui',
          url: 'https://commercial-auto-ap-southeast.example.com',
          componentKey: './commercial-auto-app',
          region: 'ap-southeast-1',
          version: '2.1.0',
        },
      },
    },
  },
};

// Helper function to detect region from request
function detectRegion(req) {
  // Option 1: From query parameter
  if (req.query.region) {
    return req.query.region;
  }

  // Option 2: From header (e.g., CloudFront-Viewer-Country)
  const countryCode = req.headers['cloudfront-viewer-country'];
  if (countryCode) {
    return mapCountryToRegion(countryCode);
  }

  // Option 3: From IP geolocation (requires IP geolocation service)
  const ip = req.ip || req.headers['x-forwarded-for'];
  // const region = await geolocateIP(ip);

  // Default region
  return 'us-east-1';
}

function mapCountryToRegion(countryCode) {
  const mapping = {
    US: 'us-east-1',
    CA: 'us-east-1',
    GB: 'eu-west-1',
    DE: 'eu-west-1',
    FR: 'eu-west-1',
    SG: 'ap-southeast-1',
    JP: 'ap-northeast-1',
    AU: 'ap-southeast-2',
    // Add more mappings
  };
  return mapping[countryCode] || 'us-east-1';
}

// Configuration endpoint
app.get('/api/config', (req, res) => {
  const environment = process.env.NODE_ENV || 'development';
  const region = detectRegion(req);

  const config = configurations[environment]?.[region] ||
                 configurations[environment]?['us-east-1'] ||
                 configurations.development['us-east-1'];

  res.json(config);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Configuration API running on port ${PORT}`);
});
```

---

## Option 2: AWS Lambda + API Gateway

```javascript
// lambda/getConfig.js
exports.handler = async (event) => {
  const environment = process.env.ENVIRONMENT || 'production';
  const region = event.queryStringParameters?.region ||
                 event.headers['CloudFront-Viewer-Country'] ||
                 'us-east-1';

  // Fetch from DynamoDB or Parameter Store
  const AWS = require('aws-sdk');
  const ssm = new AWS.SSM();

  const params = {
    Name: `/micro-frontend/${environment}/${region}/config`,
    WithDecryption: true,
  };

  try {
    const result = await ssm.getParameter(params).promise();
    const config = JSON.parse(result.Parameter.Value);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(config),
    };
  } catch (error) {
    // Fallback configuration
    const fallbackConfig = {
      region: 'us-east-1',
      environment: 'production',
      remotes: {
        commercialAuto: {
          name: 'commercial-auto-ui',
          url: 'https://commercial-auto-us-east.example.com',
          componentKey: './commercial-auto-app',
          region: 'us-east-1',
        },
      },
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(fallbackConfig),
    };
  }
};
```

---

## Option 3: Static JSON with CDN

For simpler deployments, use static JSON files served from a CDN:

**File structure:**
```
config/
├── us-east-1.json
├── eu-west-1.json
├── ap-southeast-1.json
└── default.json
```

**us-east-1.json:**
```json
{
  "region": "us-east-1",
  "environment": "production",
  "remotes": {
    "commercialAuto": {
      "name": "commercial-auto-ui",
      "url": "https://commercial-auto-us-east.example.com",
      "componentKey": "./commercial-auto-app",
      "region": "us-east-1",
      "version": "2.1.0"
    }
  }
}
```

**Updated configService.ts:**
```typescript
async fetchConfig(): Promise<AppConfig> {
  const region = await this.detectRegion();
  const configUrl = `https://cdn.example.com/config/${region}.json`;

  try {
    const response = await fetch(configUrl);
    if (!response.ok) throw new Error('Config not found');
    return await response.json();
  } catch (error) {
    // Fallback to default
    const defaultResponse = await fetch('https://cdn.example.com/config/default.json');
    return await defaultResponse.json();
  }
}
```

---

## Option 4: Environment Variables with Build-Time Substitution

Use different `.env` files for different regions:

**.env.us-east:**
```env
REACT_APP_COMMERCIAL_AUTO_URL=https://commercial-auto-us-east.example.com
REACT_APP_REGION=us-east-1
```

**.env.eu-west:**
```env
REACT_APP_COMMERCIAL_AUTO_URL=https://commercial-auto-eu-west.example.com
REACT_APP_REGION=eu-west-1
```

**Build script:**
```bash
# Build for US East
npm run build -- --env-file=.env.us-east

# Build for EU West
npm run build -- --env-file=.env.eu-west
```

---

## Option 5: Feature Flags Service (LaunchDarkly, etc.)

```typescript
import LaunchDarkly from 'launchdarkly-js-client-sdk';

class ConfigService {
  private ldClient: any;

  async initialize() {
    this.ldClient = LaunchDarkly.initialize('your-client-id', {
      key: 'user-key',
    });

    await this.ldClient.waitForInitialization();
  }

  async getRemoteUrl(remoteName: string): Promise<string> {
    const urlMap = await this.ldClient.variation('remote-urls', {});
    return urlMap[remoteName] || 'http://localhost:4201';
  }
}
```

---

## Recommended Approach for Production

### Multi-Region Setup:

1. **CloudFront + Lambda@Edge**: Detect user region and route to nearest deployment
2. **AWS Parameter Store/Secrets Manager**: Store configuration per region
3. **API Gateway**: Serve configuration based on detected region
4. **Fallback Strategy**: Always have default configuration

### Example Infrastructure:

```
User Request
    ↓
CloudFront (Global CDN)
    ↓
Lambda@Edge (Detect Region)
    ↓
Route to Regional API Gateway
    ↓ (us-east-1)        ↓ (eu-west-1)       ↓ (ap-southeast-1)
Lambda Function      Lambda Function      Lambda Function
    ↓                    ↓                    ↓
Parameter Store      Parameter Store      Parameter Store
    ↓                    ↓                    ↓
Return Config        Return Config        Return Config
```

---

## Security Considerations

1. **CORS**: Configure appropriate CORS headers
2. **Authentication**: Use API keys or JWT tokens
3. **Rate Limiting**: Prevent abuse
4. **Caching**: Cache configuration with appropriate TTL
5. **Encryption**: Encrypt sensitive configuration values

---

## Testing Different Regions

```bash
# Test US region
curl http://localhost:3001/api/config?region=us-east-1

# Test EU region
curl http://localhost:3001/api/config?region=eu-west-1

# Test with header
curl -H "CloudFront-Viewer-Country: DE" http://localhost:3001/api/config
```

---

## Monitoring and Observability

- Log which configuration is served to which user
- Track configuration fetch failures
- Monitor regional performance
- Alert on fallback configuration usage

This approach ensures your micro front-ends can be deployed globally without hardcoded URLs!
