# Multi-Region Deployment Strategy

## Problem Statement

When deploying remote micro front-end applications across different regions (US, EU, Asia, etc.), hardcoding URLs in the source code creates several issues:

- ❌ Need to rebuild for each region
- ❌ Cannot dynamically route users to nearest server
- ❌ Difficult to update URLs without redeployment
- ❌ No support for A/B testing or gradual rollouts
- ❌ Cannot handle failover scenarios

---

## Recommended Solutions

### **Solution 1: Runtime Configuration API** ⭐ (Best for Production)

**How it works:**
1. React host calls a configuration API at runtime
2. API returns remote URLs based on user's region/environment
3. Remote components are loaded from the provided URLs

**Advantages:**
- ✅ No rebuild needed for different regions
- ✅ Dynamic routing to nearest server
- ✅ Support for feature flags and A/B testing
- ✅ Easy to update configuration
- ✅ Centralized configuration management

**Implementation:**

```typescript
// services/configService.ts
const config = await configService.getRemoteConfig('commercialAuto');
const importMapLoader = getImportMapLoader(config.url);
```

**Backend API Response:**
```json
{
  "region": "us-east-1",
  "environment": "production",
  "remotes": {
    "commercialAuto": {
      "url": "https://commercial-auto-us-east.example.com",
      "componentKey": "./commercial-auto-app",
      "version": "2.1.0"
    }
  }
}
```

**Files Created:**
- [services/configService.ts](react-host/src/services/configService.ts) - Configuration service
- [remotes/commercial-auto/CommercialAutoRemoteDynamic.tsx](react-host/src/remotes/commercial-auto/CommercialAutoRemoteDynamic.tsx) - Dynamic component
- [BACKEND_CONFIG_API_EXAMPLE.md](BACKEND_CONFIG_API_EXAMPLE.md) - Backend examples

---

### **Solution 2: CDN with Static Config Files**

**How it works:**
1. Deploy separate JSON config files to CDN for each region
2. React app fetches appropriate config based on detected region
3. Load remotes using URLs from config

**Advantages:**
- ✅ Simple to implement
- ✅ High availability (CDN)
- ✅ Low latency
- ✅ No backend required

**Configuration Files:**
```
https://cdn.example.com/config/
├── us-east-1.json      # US East configuration
├── eu-west-1.json      # EU West configuration
├── ap-southeast-1.json # Asia Pacific configuration
└── default.json        # Fallback configuration
```

**Example Config:**
```json
{
  "region": "eu-west-1",
  "remotes": {
    "commercialAuto": {
      "url": "https://commercial-auto-eu.example.com",
      "componentKey": "./commercial-auto-app"
    }
  }
}
```

---

### **Solution 3: CloudFront + Lambda@Edge**

**How it works:**
1. User request hits CloudFront
2. Lambda@Edge detects user's region
3. Routes to appropriate regional deployment
4. Returns config with regional URLs

**Advantages:**
- ✅ Automatic region detection
- ✅ Lowest latency (edge computing)
- ✅ Built-in failover
- ✅ Transparent to application code

**Architecture:**
```
User (Germany)
    ↓
CloudFront (Edge Location: Frankfurt)
    ↓
Lambda@Edge (Detect: EU region)
    ↓
Route to EU West deployment
    ↓
Return: https://commercial-auto-eu-west.example.com
```

---

### **Solution 4: Environment-Specific Builds**

**How it works:**
1. Create different `.env` files for each region
2. Build separate bundles for each region
3. Deploy to corresponding region

**Advantages:**
- ✅ Simple build process
- ✅ No runtime overhead
- ✅ Type-safe at build time

**Disadvantages:**
- ❌ Requires separate builds
- ❌ Cannot dynamically change URLs
- ❌ More complex deployment pipeline

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

**Build Commands:**
```bash
npm run build:us-east
npm run build:eu-west
npm run build:ap-southeast
```

---

## Comparison Matrix

| Solution | Complexity | Flexibility | Performance | Cost | Best For |
|----------|-----------|-------------|-------------|------|----------|
| **Runtime Config API** | Medium | ⭐⭐⭐⭐⭐ | Good | Medium | Production, Enterprise |
| **CDN Static Config** | Low | ⭐⭐⭐⭐ | Excellent | Low | Startups, Medium businesses |
| **CloudFront + Lambda@Edge** | High | ⭐⭐⭐⭐⭐ | Excellent | High | Large scale, Global |
| **Environment Builds** | Low | ⭐⭐ | Excellent | Low | Small projects, Simple needs |

---

## Implementation Guide

### Step 1: Choose Your Approach

For most production applications, we recommend **Solution 1 (Runtime Config API)** because:
- Flexible and maintainable
- Supports dynamic configuration
- Easy to implement A/B testing
- No rebuild required for updates

### Step 2: Implement Configuration Service

Use the provided `configService.ts`:

```typescript
import { configService } from './services/configService';

// Fetch configuration
const config = await configService.getRemoteConfig('commercialAuto');

// Use dynamic URL
const importMapLoader = getImportMapLoader(config.url);
```

### Step 3: Update Remote Components

Use `CommercialAutoRemoteDynamic.tsx` instead of hardcoded version:

```typescript
// In App.tsx
const CommercialAutoRemote = lazy(() =>
  import('./remotes/commercial-auto/CommercialAutoRemoteDynamic')
);
```

### Step 4: Deploy Backend API

Choose from the examples in [BACKEND_CONFIG_API_EXAMPLE.md](BACKEND_CONFIG_API_EXAMPLE.md):
- Node.js/Express
- AWS Lambda
- Static JSON on CDN

### Step 5: Configure for Multiple Regions

**Backend Configuration:**
```javascript
{
  'us-east-1': {
    remotes: {
      commercialAuto: {
        url: 'https://commercial-auto-us-east.example.com'
      }
    }
  },
  'eu-west-1': {
    remotes: {
      commercialAuto: {
        url: 'https://commercial-auto-eu-west.example.com'
      }
    }
  }
}
```

---

## Region Detection Strategies

### 1. **CloudFront Header**
```typescript
const region = req.headers['cloudfront-viewer-country'];
```

### 2. **IP Geolocation**
```typescript
const response = await fetch('https://ipapi.co/json/');
const data = await response.json();
const region = mapCountryToRegion(data.country_code);
```

### 3. **User Preference**
```typescript
const region = localStorage.getItem('user-region') || detectRegion();
```

### 4. **DNS-based Routing**
```
us.example.com → us-east-1
eu.example.com → eu-west-1
ap.example.com → ap-southeast-1
```

---

## Deployment Architecture

### Recommended Setup:

```
┌─────────────────────────────────────────────┐
│          Global CloudFront CDN              │
│  (Caches React host and static assets)     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Configuration API Gateway            │
│    (Returns region-specific config)         │
└─────────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌──────────────┐       ┌──────────────┐
│  US Region   │       │  EU Region   │
│  (us-east-1) │       │ (eu-west-1)  │
│              │       │              │
│ Commercial   │       │ Commercial   │
│ Auto UI      │       │ Auto UI      │
│ Server       │       │ Server       │
└──────────────┘       └──────────────┘
```

---

## Testing Multi-Region Setup

### Local Testing:

```bash
# Test US region
curl http://localhost:3001/api/config?region=us-east-1

# Test EU region
curl http://localhost:3001/api/config?region=eu-west-1
```

### Production Testing:

```bash
# Override region with query parameter
https://example.com/?region=eu-west-1

# Test with different IPs
curl -x eu-proxy:8080 https://example.com/api/config
```

---

## Monitoring and Alerts

### Key Metrics to Track:

1. **Configuration Fetch Success Rate**
   - Alert if < 99%

2. **Fallback Configuration Usage**
   - Monitor when default config is used

3. **Regional Performance**
   - Track latency per region

4. **Remote Load Time**
   - Monitor import map initialization time

5. **Error Rates**
   - Alert on failed remote loads

### Example Monitoring:

```typescript
// Log configuration usage
console.log('Configuration loaded:', {
  region: config.region,
  remoteUrl: config.remotes.commercialAuto.url,
  timestamp: new Date().toISOString(),
});

// Track metrics
analytics.track('remote_loaded', {
  remote: 'commercial-auto',
  region: config.region,
  loadTime: performanceEntry.duration,
});
```

---

## Security Considerations

1. **CORS Configuration**
   ```javascript
   'Access-Control-Allow-Origin': 'https://example.com'
   ```

2. **API Authentication**
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`,
   }
   ```

3. **Rate Limiting**
   - Limit config API calls to prevent abuse

4. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self';
                  script-src 'self' https://commercial-auto-*.example.com;">
   ```

5. **Encrypted Configuration**
   - Use AWS Secrets Manager or similar for sensitive values

---

## Migration Path

### From Hardcoded to Dynamic:

1. **Week 1**: Implement configuration service with fallbacks
2. **Week 2**: Deploy backend API (parallel to hardcoded)
3. **Week 3**: Test with feature flag (10% traffic)
4. **Week 4**: Gradually increase to 50% traffic
5. **Week 5**: Full rollout to 100% traffic
6. **Week 6**: Remove hardcoded configuration

---

## Summary

✅ **Runtime Configuration API** is the recommended approach for production deployments

✅ Provides maximum flexibility without code changes

✅ Supports multi-region, A/B testing, and feature flags

✅ Easy to implement with provided code examples

See [BACKEND_CONFIG_API_EXAMPLE.md](BACKEND_CONFIG_API_EXAMPLE.md) for complete backend implementation examples!
