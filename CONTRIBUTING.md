# Contributing to ZeroTrue Node.js SDK


## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/zerotrue/zerotrue-node/issues)
2. If not, create a new issue using the Bug Report template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Code samples
   - Environment details

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue using the Feature Request template
3. Clearly describe:
   - The problem it solves
   - How you envision it working
   - Example usage

### Pull Requests

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zerotrue-node.git
   cd zerotrue-node
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

6. **Run tests**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```

7. **Build the project**
   ```bash
   npm run build
   ```

8. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Build process or auxiliary tool changes

9. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

10. **Create a Pull Request**
    - Go to the original repository
    - Click "New Pull Request"
    - Select your branch
    - Fill out the PR template
    - Submit!

## Development Guidelines

### Code Style

- Follow existing TypeScript patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use TypeScript types (avoid `any`)

### Testing

- Write tests for new features
- Maintain > 90% code coverage
- Test edge cases
- Use descriptive test names

```typescript
describe('Feature', () => {
  it('should handle expected input correctly', () => {
    // Test code
  });

  it('should throw error on invalid input', () => {
    // Test code
  });
});
```

### Documentation

- Update README.md for new features
- Add examples in `examples/` directory
- Update CHANGELOG.md
- Add JSDoc comments with examples

```typescript
/**
 * Creates a new check
 * 
 * @param params - Check parameters
 * @returns Check response
 * 
 * @example
 * ```typescript
 * const check = await client.checks.create({
 *   input: { type: 'text', value: 'Test' }
 * });
 * ```
 */
```

### File Organization

```
src/
├── client.ts           # Main client
├── index.ts            # Exports
├── types/              # TypeScript types
├── errors/             # Error classes
├── core/               # Core functionality
├── resources/          # API resources
└── utils/              # Utility functions
```

## Testing Locally

### Link Package

```bash
npm link
```

In your test project:
```bash
npm link zerotrue
```

### Run Examples

```bash
export ZEROTRUE_API_KEY=zt_your_key
npx tsx examples/basic.ts
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.1`
4. Push tag: `git push origin v1.0.1`
5. GitHub Actions will automatically publish to NPM

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Read the [README.md](./README.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

