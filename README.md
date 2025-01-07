# UserLog for Node.js

## Installation

### Using npm

```bash
npm install @userlog/node
```

## Usage

```javascript
import { UserLog } from "@userlog/node";

const userlog = new UserLog({
  api_key: "<API_KEY>",
  project: "<PROJECT_NAME>",
});

// Track an event
await userlog.track({
  channel: "payments",
  event: "New Subscription",
  user_id: "user@example.com",
  icon: "💰",
  notify: true,
  tags: {
    plan: "premium",
    cycle: "monthly",
    trial: false,
  },
});
```

## Disabling Tracking

You can disable tracking for development purposes by using the `disableTracking` method:

```javascript
userlog.disableTracking();
```

And enable it back with:

```javascript
userlog.enableTracking();
```

You can check if tracking is disabled with:

```javascript
userlog.isTrackingDisabled();
```

## Method

- `track(options: TrackOptions): Promise<boolean>`: Track custom events.

## API Documentation

For more information about the UserLog API, see: [docs.getuserlog.com](https://docs.getuserlog.com)

## Support

If you encounter any problems or issues, please contact us at [michael@8byte.de](mailto:michael@8byte.de)
