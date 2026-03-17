# AgroBridge Demo Mode Guide

## Overview

AgroBridge includes a comprehensive demo mode system designed for sales presentations, investor demos, and product exploration without requiring database setup or affecting production data.

## Key Features

### 1. Immutable Seed Data

Demo data is stored as **frozen, immutable seed datasets** that serve as the pristine baseline:

- **5 Demo Farmers** with realistic profiles from Kaduna corridor
- **3 Demo Contracts** showing active fulfillment and completed status
- **3 Demo Deliveries** with verified and in-transit examples
- **Impressive Metrics**: 1,228 farmers, 4,732 hectares, 92% delivery reliability

All seed data is stored in `lib/demo/demo-seed.ts` and can never be accidentally modified.

### 2. Transient Demo Store

All demo mutations happen in an **in-memory transient store**:

```typescript
// Demo users interact with copies of seed data
const demoStore = new DemoDataStore()

// Changes persist within session
demoStore.setFarmers([...modifiedFarmers])

// Reset returns to pristine seed state
demoStore.reset()
```

### 3. One-Click Reset

Demo data can be reset to pristine state at any time:

**Via UI:**
- Click "Demo Controls" in any demo dashboard header
- Click "Reset Demo Data" button

**Via API:**
```bash
POST /api/demo/reset
```

**Via Code:**
```typescript
import { resetDemoData } from '@/lib/demo/demo-seed'
resetDemoData()
```

### 4. Demo User Detection

Users are automatically identified as demo users based on email pattern:

```typescript
// Demo users (use demo seed data):
demo-buyer@agrobridge.app
demo-ops@agrobridge.app
demo-agent@agrobridge.app

// Production users (use real database):
john@company.com
```

### 5. Visual Indicators

Demo mode includes multiple visual indicators:

- **Amber Badge**: "DEMO MODE" in dashboard headers
- **Banner**: Persistent reminder that no real data is persisted
- **Watermark**: Subtle overlay on buyer, investor, ops dashboards
- **API Header**: All responses include `X-AgroBridge-Mode: demo`

## Demo Credentials

### Buyer/Offtaker
- **Email**: `demo-buyer@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Contract management, delivery tracking, quality reports

### Operations Manager
- **Email**: `demo-ops@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Logistics oversight, verification, warehouse management

### Field Agent
- **Email**: `demo-agent@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Farmer management, service delivery, data collection

### Admin
- **Email**: `demo-admin@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Platform analytics, user management, demo controls

### Partner (Service Provider)
- **Email**: `demo-partner@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Service requests, job tracking, payment history

### Coordinator
- **Email**: `demo-coordinator@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Agent oversight, cluster management, performance metrics

### Farmer (Mobile View)
- **Email**: `demo-farmer@agrobridge.app`
- **Password**: `demo123`
- **Dashboard**: Personal profile, contracts, deliveries, payments

## Demo Safety Features

Demo mode includes automatic safety overrides:

```typescript
const demoConfig = {
  disableRealPayments: true,        // No money movement
  disableNotifications: true,       // No SMS/email sent
  disableExternalIntegrations: true,// No third-party API calls
  allowFastForward: true,          // Can skip waiting periods
  autoApproveFlows: true,          // Skip approval steps
}
```

## Architecture

### Demo Seed System

```
lib/demo/
├── demo-seed.ts          # Immutable seed data + transient store
├── demo-data.ts          # Legacy demo helpers (deprecated)
├── demo-users.ts         # Demo user credentials
├── demo-context.tsx      # React context for demo mode
├── demo-api.ts           # Reset API endpoint logic
└── demo-badge.tsx        # UI components

components/demo/
├── demo-badge.tsx        # "DEMO MODE" header badge
├── demo-banner.tsx       # Persistent info banner
├── demo-watermark.tsx    # Dashboard watermark overlay
├── demo-admin-panel.tsx  # Demo controls dialog
└── demo-credentials-card.tsx  # Login page credentials
```

### Repository Integration

Mock repositories check if user is in demo mode:

```typescript
class MockFarmerRepository {
  constructor(userEmail?: string) {
    this.isDemo = isDemoUser(userEmail)
    if (this.isDemo) {
      this.data = getDemoStore().getFarmers()  // Use transient store
    } else {
      this.data = [...FARMERS]  // Use static mock data
    }
  }

  async create(input) {
    this.data.push(newFarmer)
    this.persist()  // Saves to demo store, not database
  }
}
```

## Best Practices

### For Sales Demos

1. **Always start with reset**: Click "Reset Demo Data" before presenting
2. **Know the credentials**: Keep demo login info handy
3. **Highlight the data**: 1,228 farmers, 4,732 hectares sounds impressive
4. **Use multiple roles**: Switch between buyer, agent, ops to show full workflow

### For Investor Presentations

1. **Emphasize scale**: Show aggregate metrics (demo mode shows impressive totals)
2. **Show real workflows**: Walk through farmer → agent → contract → delivery → payment
3. **Demonstrate safety**: Point out demo mode indicators (no real money moves)
4. **Reset between sessions**: Keep data clean for repeatable demos

### For Product Testing

1. **Test CRUD operations**: Create/edit entities freely, then reset
2. **Simulate workflows**: Use fast-forward to skip waiting periods
3. **Check integrations**: Verify external APIs are properly mocked
4. **Verify isolation**: Ensure demo actions never touch production

## Troubleshooting

### Demo data not resetting
- Check browser console for errors
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Clear localStorage: `localStorage.clear()`

### Seeing production data in demo
- Verify email contains "demo-" or "@agrobridge.app"
- Check `X-AgroBridge-Mode` header in Network tab (should be "demo")
- Logout and login again with demo credentials

### Demo badge not showing
- Demo context requires `DemoProvider` wrapper in `app/layout.tsx`
- Check browser console for React context errors
- Verify localStorage has user session

## Switching to Production

To disable demo mode and use real database:

1. Set environment variables:
```bash
REPOSITORY_MODE=production
DATABASE_URL=postgresql://...
AUTH_MODE=production
JWT_SECRET=your-secret-key
```

2. Run database migrations:
```bash
npm run db:push
```

3. Restart the application

Demo users will continue to work in production (they use separate tenant).
