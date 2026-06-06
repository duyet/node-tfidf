# CLAUDE.md

> **Instructions for Claude AI when working with this project**

This file helps Claude understand the project structure, philosophy, and best practices for `node-tfidf`.

## 📋 Project Overview

**node-tfidf** is a modern, zero-dependency TF-IDF (Term Frequency-Inverse Document Frequency) implementation for Node.js. It's built with production-quality standards, comprehensive testing, and developer experience as top priorities.

### Key Characteristics

- **Zero Dependencies** - No external packages, complete security
- **Modern JavaScript** - ES6+ classes, private fields, async/await
- **TypeScript Support** - Full type definitions included
- **Comprehensive Testing** - 71+ tests covering all functionality
- **Production Ready** - CI/CD, security policy, documentation
- **Backward Compatible** - Legacy API still works

## 🏗️ Architecture

### File Structure

```
node-tfidf/
├── lib/
│   ├── tfidf.js              # Main modern implementation (ES6+, zero deps)
│   └── tfidf/
│       └── index.js          # Legacy implementation (preserved for compatibility)
├── test/
│   ├── modern-test.js        # Core feature tests (39 tests)
│   ├── advanced-test.js      # Advanced feature tests (32 tests)
│   └── test.js               # Legacy compatibility tests
├── examples/                  # 5 practical examples with detailed comments
├── benchmark/                 # Performance benchmarks
├── .github/workflows/         # CI/CD configuration
├── index.js                  # Entry point with backward compatibility wrapper
├── index.d.ts                # TypeScript definitions
├── package.json              # Zero dependencies!
├── README.md                 # User-facing documentation
├── SECURITY.md               # Security policy
├── CONTRIBUTING.md           # Contribution guidelines
├── CHANGELOG.md              # Version history
└── CLAUDE.md                 # This file
```

### Core Components

#### 1. Main Implementation (`lib/tfidf.js`)

**Modern ES6+ implementation** with:
- Private fields using `#` syntax
- No external dependencies
- Comprehensive error handling
- Full JSDoc documentation

**Key Classes:**
- `DefaultTokenizer` - Simple whitespace/punctuation tokenizer
- `TfIdf` - Main TF-IDF calculator

**Design Principles:**
- Language-agnostic core
- Pluggable tokenization
- Intelligent IDF caching (6.8x speedup)
- Proper bounds checking on all operations
- No prototype pollution vulnerabilities

#### 2. Entry Point (`index.js`)

**Backward compatibility wrapper** that:
- Exports `TfIdfLegacy` class by default
- Provides deprecated `tfidf()` and `tfidfs()` methods
- Maintains 100% backward compatibility with v0.0.x
- Recommends modern API via JSDoc `@deprecated` tags

#### 3. TypeScript Definitions (`index.d.ts`)

**Complete type safety** with:
- All method signatures
- Interface definitions (TermScore, SearchResult, SimilarityResult, etc.)
- Proper return types
- Parameter documentation

## 🎯 Design Philosophy

### 1. **Zero Dependencies Policy**

**Why:** Every dependency is a liability (security, maintenance, breaking changes)

**Implementation:**
- Use native JavaScript features
- No underscore, lodash, or utility libraries
- Custom tokenizer instead of external packages
- Node.js built-in modules only (fs, assert)

**Exception:** None. There are ZERO dependencies.

### 2. **Backward Compatibility**

**Why:** Don't break existing user code

**Implementation:**
- Legacy methods still work (`tfidf()`, `tfidfs()`)
- Same mathematical formulas
- Wrapper class pattern (`TfIdfLegacy extends TfIdf`)
- Deprecation warnings via JSDoc

**Example:**
```javascript
// Old API (still works)
tfidf.tfidfs('term', (i, score) => console.log(score));

// New API (recommended)
const scores = tfidf.scoreAll('term');
```

### 3. **Security First**

**Threats Addressed:**
- ✅ Prototype pollution - Use `Map`, `Set`, and proper hasOwnProperty checks
- ✅ Code injection - No `eval()`, `Function()`, or `vm` module
- ✅ Path traversal - Validate file paths in examples
- ✅ Supply chain attacks - Zero dependencies
- ✅ DoS via large inputs - Document size limits in SECURITY.md

**Security Features:**
- Private fields prevent external mutation
- Bounds checking on all indices
- Type validation on all inputs
- No global state mutation

### 4. **Performance Optimization**

**Caching Strategy:**
- IDF values cached in `Map` (O(1) lookup)
- Cache invalidated on corpus changes
- Force recalculation available via `force` parameter
- **Proven 6.8x speedup** via benchmarks

**Batch Operations:**
- `addDocuments()` - 10x faster than individual adds
- Single cache invalidation per batch

### 5. **Developer Experience**

**IntelliSense Support:**
- Full JSDoc comments
- TypeScript definitions
- Descriptive parameter names

**Error Messages:**
```javascript
// ❌ Bad: throw new Error('Invalid index')
// ✅ Good: throw new RangeError(`Document index ${index} out of range [0, ${max}]`)
```

**Method Chaining:**
```javascript
tfidf
  .addDocument('doc1')
  .addDocument('doc2')
  .setStopwords(['the', 'a']);
```

## 🔧 Development Guidelines

### When Adding New Features

1. **Write tests FIRST** (`test/advanced-test.js`)
   - Happy path
   - Edge cases
   - Error conditions
   - Integration scenarios

2. **Update TypeScript definitions** (`index.d.ts`)
   - Method signatures
   - Return types
   - New interfaces if needed

3. **Add JSDoc comments**
   - Description
   - `@param` for all parameters
   - `@returns` for return value
   - `@throws` for exceptions
   - `@example` for complex methods

4. **Update documentation**
   - README.md - User guide
   - CHANGELOG.md - Version history
   - Examples if applicable

5. **Maintain zero dependencies**
   - Use native JavaScript
   - No external packages

### Code Style

**Follow existing patterns:**

```javascript
// ✅ Modern class with private fields
class TfIdf {
  #documents = [];
  #idfCache = new Map();

  methodName(param1, param2) {
    // Validate inputs
    if (!isValid) {
      throw new TypeError('Descriptive message');
    }

    // Implementation

    // Return for chaining where appropriate
    return this;
  }
}

// ✅ Proper error handling
if (index < 0 || index >= this.#documents.length) {
  throw new RangeError(`Document index ${index} out of range [0, ${this.#documents.length - 1}]`);
}

// ✅ Use modern JavaScript
const vocab = new Set();
for (const doc of this.#documents) {
  for (const term in doc) {
    if (!term.startsWith('_')) {
      vocab.add(term);
    }
  }
}
```

### Testing Requirements

**All PRs must include:**
- Unit tests for new methods
- Edge case tests
- Error condition tests
- Integration tests if adding complex features

**Run before committing:**
```bash
npm test              # Core + advanced tests
npm run test:legacy   # Backward compatibility
npm run benchmark     # Performance verification
```

### Documentation Standards

**JSDoc Format:**
```javascript
/**
 * Calculate cosine similarity between two documents
 * Returns value between 0 (completely different) and 1 (identical)
 *
 * @param {number} docIndex1 - First document index
 * @param {number} docIndex2 - Second document index
 * @returns {number} Cosine similarity score (0-1)
 * @throws {RangeError} If either document index is out of range
 *
 * @example
 * const sim = tfidf.similarity(0, 1); // 0.85
 */
similarity(docIndex1, docIndex2) {
  // Implementation
}
```

## 🧪 Testing Strategy

### Test Organization

1. **Core Tests** (`test/modern-test.js`)
   - Basic TF-IDF functionality
   - Mathematical correctness
   - API usability
   - Backward compatibility

2. **Advanced Tests** (`test/advanced-test.js`)
   - New features (similarity, search, etc.)
   - Async operations
   - Batch operations
   - CRUD operations
   - Integration scenarios

3. **Legacy Tests** (`test/test.js`)
   - Original functionality preserved
   - Ensures no breaking changes

### Running Tests

```bash
# All tests
npm test

# Individual test suites
npm run test:basic      # Core tests
npm run test:advanced   # Advanced features
npm run test:legacy     # Backward compatibility

# Full test suite
npm run test:all
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

**Jobs:**
1. **Test** - Multi-platform, multi-version
   - Node.js: 14.x, 16.x, 18.x, 20.x, 22.x
   - OS: Ubuntu, Windows, macOS

2. **Lint** - Code style enforcement
   - ESLint with error reporting

3. **Benchmark** - Performance verification
   - Ensures no performance regressions

4. **Security** - Vulnerability scanning
   - `npm audit` for dependencies (should find none!)

5. **Publish Dry Run** - Package verification
   - Test npm pack on PRs

## 📊 Performance Considerations

### Current Benchmarks (Node.js v22)

| Operation | Throughput | Notes |
|-----------|-----------|-------|
| IDF Lookup (cached) | 1.7M ops/sec | 6.8x speedup |
| Document Scoring | 991K ops/sec | Single doc |
| Top Terms | 245K ops/sec | Extract keywords |
| Batch Add | 16K ops/sec | 100 docs at once |
| Similarity | 500K ops/sec | Cosine similarity |
| Search | 280 ops/sec | 1000 doc corpus |

### Optimization Guidelines

1. **Use batch operations** - `addDocuments()` over multiple `addDocument()`
2. **Cache IDF values** - Automatic, but avoid `force` parameter unless needed
3. **Pre-tokenize** - If using same tokenizer repeatedly
4. **Limit corpus size** - Consider pagination for >10K documents
5. **Use metadata** - For document lookups instead of linear search

## 🔍 Common Workflows

### Adding a New Method

```bash
# 1. Write test first
vim test/advanced-test.js

# 2. Implement method
vim lib/tfidf.js

# 3. Add TypeScript types
vim index.d.ts

# 4. Run tests
npm test

# 5. Update docs
vim README.md
vim CHANGELOG.md

# 6. Commit
git add .
git commit -m "feat: add new method description"
```

### Fixing a Bug

```bash
# 1. Write failing test
vim test/modern-test.js

# 2. Fix bug
vim lib/tfidf.js

# 3. Verify fix
npm test

# 4. Update CHANGELOG
vim CHANGELOG.md

# 5. Commit
git commit -m "fix: description of bug fix"
```

### Performance Optimization

```bash
# 1. Run benchmarks before
npm run benchmark > before.txt

# 2. Make changes
vim lib/tfidf.js

# 3. Run benchmarks after
npm run benchmark > after.txt

# 4. Compare
diff before.txt after.txt

# 5. Document improvement
vim CHANGELOG.md
```

## 🎓 Key Algorithms

### TF-IDF Formula

**Term Frequency (TF):**
```
tf(t, d) = count of term t in document d
```

**Inverse Document Frequency (IDF) - Smooth IDF:**
```
idf(t) = 1 + log(N / (1 + df))
```
Where:
- N = total number of documents
- df = number of documents containing term t

**TF-IDF Score:**
```
tfidf(t, d) = tf(t, d) × idf(t)
```

### Cosine Similarity

```
similarity(d1, d2) = (v1 · v2) / (||v1|| × ||v2||)
```
Where:
- v1, v2 = TF-IDF vectors for documents
- · = dot product
- || || = Euclidean norm

**Implementation:** `lib/tfidf.js:403-443`

## 🐛 Common Issues & Solutions

### Issue: "Module not found"
**Cause:** Missing dependency attempt
**Solution:** This project has ZERO dependencies. If you see this, something's wrong.

### Issue: "IDF is Infinity"
**Cause:** Term appears in no documents
**Solution:** Smooth IDF formula handles this (returns finite value)

### Issue: "Index out of range"
**Cause:** Accessing non-existent document
**Solution:** Check `tfidf.documentCount` before accessing

### Issue: Slow performance
**Cause:** Large corpus without optimization
**Solution:**
- Use batch operations
- Implement document pagination
- Set size limits

### Issue: Memory usage
**Cause:** Very large corpus
**Solution:**
- Limit corpus size
- Implement LRU cache (future enhancement)
- Stream processing for bulk imports

## 📝 Commit Message Convention

Follow conventional commits:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `test:` - Adding tests
- `perf:` - Performance improvement
- `refactor:` - Code restructuring
- `chore:` - Maintenance

**Examples:**
```bash
feat: add document similarity calculation
fix: handle Unicode in tokenization
docs: update API reference with new methods
test: add edge cases for empty documents
perf: optimize IDF cache with Map
```

## 🎯 Future Enhancements (Ideas)

**Potential improvements** (not committed to, just ideas):

1. **Streaming API** - Process large files without loading into memory
2. **Weighted TF-IDF** - Support for document importance weights
3. **BM25 Algorithm** - Alternative to TF-IDF
4. **N-gram Support** - Multi-word phrase analysis
5. **Clustering** - K-means document clustering
6. **Persistence** - SQLite/LevelDB backend for large corpora
7. **Web Workers** - Parallel processing in browser
8. **CLI Tool** - Command-line interface

**Before adding ANY of these:**
- Discuss in GitHub issue
- Ensure zero-dependency policy
- Write comprehensive tests
- Update all documentation

## 🔐 Security Reminders

**Never:**
- Add dependencies without discussion
- Use `eval()` or `Function()` constructor
- Mutate global state
- Skip input validation
- Ignore prototype pollution risks

**Always:**
- Validate all inputs
- Check array bounds
- Use private fields for internal state
- Document security implications
- Update SECURITY.md if needed

## 📞 Getting Help

**For Claude AI:**
- This file (CLAUDE.md) - Project context
- CONTRIBUTING.md - Contribution process
- SECURITY.md - Security guidelines
- README.md - User documentation
- Test files - Usage examples

**For Humans:**
- GitHub Issues - Bug reports, feature requests
- GitHub Discussions - Questions, ideas
- README.md - Getting started guide

## ✅ Pre-Commit Checklist

Before committing changes:

- [ ] All tests pass (`npm test`)
- [ ] No new dependencies added
- [ ] TypeScript definitions updated
- [ ] JSDoc comments added
- [ ] README.md updated if needed
- [ ] CHANGELOG.md updated
- [ ] Examples work correctly
- [ ] Backward compatibility maintained
- [ ] Security implications considered
- [ ] Performance impact measured

## 🎉 Success Criteria

A successful contribution:
- ✅ Adds value to users
- ✅ Maintains zero dependencies
- ✅ Includes comprehensive tests
- ✅ Preserves backward compatibility
- ✅ Has clear documentation
- ✅ Follows existing patterns
- ✅ Passes all CI checks
- ✅ Improves developer experience

---

**Remember:** This project is about quality over quantity. Every line should be intentional, tested, and documented. We're building something developers will love to use.

Last updated: 2025-01-16
