# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-16

### 🎉 Complete Rewrite

This version represents a complete modernization of node-tfidf from the ground up.

### Added

#### Core Features
- **Zero-dependency implementation** - Removed all external packages
- **Modern ES6+ codebase** - Classes with private fields, proper encapsulation
- **TypeScript support** - Full type definitions in `index.d.ts`
- **Comprehensive test suite** - 39 tests with 100% pass rate
- **Performance benchmarks** - Verifiable 6.8x speedup from caching

#### New API Methods
- `score(terms, documentIndex)` - Modern replacement for `tfidf()`
- `scoreAll(terms)` - Modern replacement for `tfidfs()`
- `topTerms(documentIndex, limit)` - Get top N terms by TF-IDF score
- `setStopwords(words)` - Configure stopwords
- `addStopwords(words)` - Add to existing stopwords
- `documentCount` - Getter for corpus size
- `toJSON()` - Serialization support

#### Developer Experience
- Method chaining support on `addDocument()`, `setTokenizer()`, etc.
- Detailed error messages with context
- JSDoc comments throughout
- Proper error types (`RangeError`, `TypeError`)

#### Documentation
- Complete API reference in README
- Migration guide from v0.0.x
- Real-world usage examples
- Performance benchmarks
- Contributing guidelines (CONTRIBUTING.md)
- Security policy (SECURITY.md)

### Changed

#### Breaking Changes (with backward compatibility layer)
- **Architecture**: Complete rewrite with modern JavaScript
- **Dependencies**: All dependencies removed (was: underscore, node-vntokenizer, vietnamese-stopwords)
- **API**: New method names (old methods still work but deprecated)
  - `tfidf()` → `score()` (old still works)
  - `tfidfs()` → `scoreAll()` (old still works)
  - `listTerms()` → `topTerms()` (both available)

#### Improvements
- **6.8x faster** IDF calculations with intelligent caching
- **Language-agnostic** - Pluggable tokenization instead of hardcoded Vietnamese
- **Secure by default** - No prototype pollution, proper input validation
- **Better defaults** - Simple whitespace tokenizer works for any language

### Fixed

#### Security
- **CVE-2021-23337** - Critical prototype pollution in lodash (via node-vntokenizer)
- **CVE-2019-10744** - Moderate prototype pollution in lodash
- Removed all vulnerable dependencies

#### Bugs
- Fixed prototype pollution vulnerability in term counting
- Fixed missing validation on document indices
- Fixed infinite IDF values (now uses smooth IDF formula)
- Fixed global tokenizer state mutation

#### Performance
- Implemented IDF caching (6.8x speedup)
- Optimized term frequency counting
- Reduced memory allocations

### Removed

- **underscore** dependency (1.8.3) - Replaced with native JavaScript
- **node-vntokenizer** dependency (0.0.1) - Made tokenization pluggable
- **vietnamese-stopwords** dependency (0.0.2) - Made stopwords configurable
- IIFE wrapper pattern - Unnecessary in modern Node.js
- Callback-based API (still supported for compatibility)

### Deprecated

- `tfidf()` method - Use `score()` instead
- `tfidfs()` method - Use `scoreAll()` instead
- Callback pattern in `tfidfs()` - Use return value instead

### Performance

Benchmarks on Node.js v22:

| Operation | Throughput | Speedup |
|-----------|-----------|---------|
| IDF Lookup (cached) | 1,741,462 ops/sec | 6.8x |
| Single Document Scoring | 991,305 ops/sec | - |
| Top Terms Extraction | 245,460 ops/sec | - |
| Document Addition | 1,599 ops/sec | - |

### Migration from 0.0.x

```javascript
// Old API (still works)
tfidf.tfidfs('term', function(i, measure) {
  console.log('document #' + i + ' is ' + measure);
});

// New API (recommended)
const scores = tfidf.scoreAll('term');
scores.forEach((score, i) => {
  console.log(`document #${i} is ${score}`);
});
```

## [0.0.1] - 2015-06-20

### Initial Release

- Basic TF-IDF implementation
- Vietnamese tokenization support
- File loading support
- Callback-based API

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Incompatible API changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

## Links

- [npm package](https://www.npmjs.com/package/node-tfidf)
- [GitHub repository](https://github.com/duyetdev/node-tfidf)
- [Issue tracker](https://github.com/duyetdev/node-tfidf/issues)
