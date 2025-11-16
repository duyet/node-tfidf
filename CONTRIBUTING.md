# Contributing to node-tfidf

First off, thank you for considering contributing to node-tfidf! It's people like you that make this library great.

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something amazing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** - Summarize the issue in one line
- **Steps to reproduce** - Minimal code example
- **Expected behavior** - What should happen?
- **Actual behavior** - What actually happens?
- **Environment** - Node.js version, OS, etc.

**Example:**
```markdown
## Issue: score() returns NaN for empty documents

### Reproduction
const tfidf = new TfIdf();
tfidf.addDocument('');
console.log(tfidf.score('test', 0)); // NaN

### Expected
Should return 0

### Environment
- Node.js: v18.0.0
- node-tfidf: 0.1.0
```

### Suggesting Features

Feature requests are welcome! Please:

1. **Check existing requests** - Avoid duplicates
2. **Explain the use case** - Why is this needed?
3. **Provide examples** - Show how it would work
4. **Consider alternatives** - What other solutions exist?

### Pull Requests

#### Before You Start

1. **Open an issue first** - Discuss major changes
2. **Check existing PRs** - Avoid duplicate work
3. **Read the code** - Understand the architecture

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/node-tfidf.git
cd node-tfidf

# Create a branch
git checkout -b feature/amazing-feature

# Run tests
npm test

# Run benchmarks
npm run benchmark
```

#### Code Standards

**Zero Dependencies Philosophy**
- No external packages unless absolutely critical
- Use native JavaScript features
- Keep bundle size minimal

**Modern JavaScript**
```javascript
// ✅ DO: Use modern ES6+
class MyClass {
  #privateField = null;

  constructor() {
    this.#privateField = new Map();
  }
}

// ❌ DON'T: Old patterns
function MyClass() {
  this._privateField = {};
}
```

**Error Handling**
```javascript
// ✅ DO: Descriptive errors with context
if (index < 0 || index >= this.#documents.length) {
  throw new RangeError(
    `Document index ${index} out of range [0, ${this.#documents.length - 1}]`
  );
}

// ❌ DON'T: Silent failures or vague errors
if (invalid) return null;
throw new Error('Bad input');
```

**Documentation**
```javascript
// ✅ DO: JSDoc for all public methods
/**
 * Calculate TF-IDF score for a term
 * @param {string} term - The term to score
 * @param {number} docIndex - Document index
 * @returns {number} TF-IDF score
 * @throws {RangeError} If docIndex is out of bounds
 */
score(term, docIndex) { }

// ❌ DON'T: Undocumented methods
function score(term, docIndex) { }
```

#### Testing Requirements

**Every PR must include tests:**

```javascript
// Test the happy path
it('should calculate correct TF-IDF scores', () => {
  const tfidf = new TfIdf();
  tfidf.addDocument('test document');
  assert.ok(tfidf.score('test', 0) > 0);
});

// Test edge cases
it('should handle empty documents', () => {
  const tfidf = new TfIdf();
  tfidf.addDocument('');
  assert.strictEqual(tfidf.score('test', 0), 0);
});

// Test error conditions
it('should throw on invalid index', () => {
  const tfidf = new TfIdf();
  assert.throws(() => tfidf.score('test', 99), RangeError);
});
```

Run tests before submitting:
```bash
npm test        # Modern tests
npm run test:all # All tests including legacy
```

#### Commit Messages

Follow conventional commits:

```bash
# Format: <type>: <description>

feat: add document similarity calculation
fix: handle Unicode in tokenization
docs: update API reference
test: add edge cases for empty docs
perf: optimize IDF cache with LRU
refactor: simplify token processing
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `test` - Adding tests
- `perf` - Performance improvement
- `refactor` - Code restructuring
- `chore` - Maintenance tasks

#### Pull Request Process

1. **Update documentation** - README, JSDoc, etc.
2. **Add tests** - Cover new functionality
3. **Run tests** - Ensure all pass
4. **Update CHANGELOG.md** - Document your changes
5. **Keep it focused** - One feature per PR

**PR Template:**
```markdown
## Description
Brief explanation of what this PR does

## Motivation
Why is this change needed?

## Changes
- Added X feature
- Fixed Y bug
- Refactored Z

## Testing
How did you test this?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No new dependencies
- [ ] Backward compatible
```

## Project Structure

```
node-tfidf/
├── lib/
│   ├── tfidf.js           # Main implementation
│   └── tfidf/
│       └── index.js       # Legacy implementation
├── test/
│   ├── modern-test.js     # Comprehensive tests
│   └── test.js            # Legacy tests
├── benchmark/
│   └── performance.js     # Performance tests
├── examples/              # Example usage
├── index.js              # Entry point
├── index.d.ts            # TypeScript definitions
└── README.md
```

## Design Philosophy

### Simplicity Over Cleverness
```javascript
// ✅ Clear and obvious
const scores = tfidf.scoreAll('term');

// ❌ Clever but confusing
const scores = tfidf.tfidfs('term', null, true);
```

### Zero Dependencies
- Every dependency is a liability
- Native JavaScript is powerful enough
- Security through simplicity

### Backward Compatibility
- Don't break existing code
- Deprecate gracefully
- Provide migration paths

### Performance Matters
- O(1) lookups where possible
- Cache intelligently
- Benchmark everything

### Type Safety
- Full TypeScript definitions
- Runtime validation
- Helpful error messages

## Testing Strategy

**Unit Tests** - Test individual methods
```javascript
it('should calculate IDF correctly', () => {
  // Test IDF formula
});
```

**Integration Tests** - Test workflows
```javascript
it('should handle full document pipeline', () => {
  // Add docs, score, get top terms
});
```

**Edge Cases** - Test boundaries
```javascript
it('should handle empty corpus', () => {
  // Test with no documents
});
```

**Performance Tests** - Verify speed
```javascript
benchmark('Large corpus query', () => {
  // Measure performance
});
```

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create git tag: `git tag v0.1.0`
5. Push: `git push --tags`
6. Publish: `npm publish`
7. Create GitHub release

## Questions?

- **Bugs/Features**: [Open an issue](https://github.com/duyetdev/node-tfidf/issues)
- **Security**: See [SECURITY.md](SECURITY.md)
- **General discussion**: GitHub Discussions

## Recognition

Contributors are credited in:
- CHANGELOG.md
- GitHub contributors page
- Release notes

Thank you for making node-tfidf better! 🚀
