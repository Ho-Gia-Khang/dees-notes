# Dees Notes Shared Module

This is a shared module for the Dees Notes application services. It contains common utilities, types, and functions that can be used across different services.

## Installation

Since this is a local module, you can install it in your services using npm's local path feature:

```bash
npm install --save ../shared-module
```

Or add it to your package.json directly:

```json
"dependencies": {
  "@dees-notes/shared-module": "file:../shared-module"
}
```

## Usage

After installation, you can import and use the shared utilities in your services:

```typescript
import { createLogger, validateObject, ApiResponse } from '@dees-notes/shared-module';

// Create a logger for your service
const logger = createLogger('my-service');
logger.info('Service started');

// Use validation utilities
const result = validateObject(data, schema);

// Use shared types
const response: ApiResponse<User> = {
  success: true,
  data: user
};
```

## Building

To build the module:

```bash
cd shared-module
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.
