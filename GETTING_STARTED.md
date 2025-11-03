# Getting Started with ZeroTrue Node.js SDK

## • Quick Setup

### 1. Install Dependencies

```bash
cd /home/zwine/Public/work/zerotrue-node
npm install
```

### 2. Build the SDK

```bash
npm run build
```

This will create the distributable files in the `dist/` directory.

### 3. Run Tests

```bash
npm test
```

### 4. Try Examples

Set your API key:

```bash
export ZEROTRUE_API_KEY=zt_your_api_key_here
```

Run TypeScript example:

```bash
npx tsx examples/basic.ts
```

Or build and run JavaScript example:

```bash
npm run build
node examples/basic.js
```

## • Publishing to NPM

### 1. Login to NPM

```bash
npm login
```

### 2. Publish

```bash
npm publish
```

Or use release scripts:

```bash
npm run release:patch  # 1.0.0 -> 1.0.1
npm run release:minor  # 1.0.0 -> 1.1.0
npm run release:major  # 1.0.0 -> 2.0.0
```

## • Testing Locally

### Link Package Locally

In SDK directory:

```bash
npm link
```

In your test project:

```bash
npm link zerotrue
```

Now you can import and test:

```typescript
import ZeroTrue from 'zerotrue';

const client = new ZeroTrue({ apiKey: '...' });
```

## • Development Workflow

### Watch Mode

```bash
npm run dev
```

This rebuilds the SDK on every file change.

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
npm run format:check
```

### Type Checking

```bash
npm run typecheck
```

## • Project Structure

```
zerotrue-node/
├── src/                    # Source code
│   ├── client.ts           # Main client
│   ├── index.ts            # Exports
│   ├── types/              # TypeScript types
│   ├── errors/             # Error classes
│   ├── core/               # HTTP client
│   ├── resources/          # API resources (checks)
│   └── utils/              # Utilities
├── dist/                   # Built files (after npm run build)
├── examples/               # Usage examples
├── tests/                  # Tests
├── memory.md               # Project architecture
└── README.md               # Documentation
```

## • Next Steps

1. • SDK is fully functional
2. Add more tests (optional)
3. Set up CI/CD (GitHub Actions)
4. Publish to NPM
5. Create documentation site (optional)

## 🐛 Troubleshooting

### Build Errors

If you see TypeScript errors:

```bash
rm -rf dist node_modules
npm install
npm run build
```

### Import Errors

Make sure you're importing correctly:

```typescript
// ESM
import ZeroTrue from 'zerotrue';

// CommonJS
const ZeroTrue = require('zerotrue');
```

### API Key Issues

Make sure your API key:
- Starts with `zt_`
- Is at least 10 characters long
- Is set in environment variables

## • Resources

- [README.md](./README.md) - Full documentation
- [memory.md](./memory.md) - Project architecture
- [examples/](./examples/) - Code examples
- [CHANGELOG.md](./CHANGELOG.md) - Version history

---

Happy coding! •
