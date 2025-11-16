# node-tfidf

> **Modern, zero-dependency TF-IDF implementation for Node.js**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

A beautifully simple, blazingly fast implementation of TF-IDF (Term Frequency-Inverse Document Frequency) for Node.js. Built with modern JavaScript, zero dependencies, and full TypeScript support.

## ✨ What's New in v0.1.0

This version is a complete rewrite with modern best practices:

- **🚀 Zero Dependencies** - No external packages, no security vulnerabilities
- **⚡ 6.8x Faster** - Intelligent IDF caching with proven benchmarks
- **📘 TypeScript Support** - Full type definitions included
- **✅ 39 Comprehensive Tests** - Every edge case covered
- **🎯 Modern API** - Clean, intuitive methods with consistent naming
- **🔌 Pluggable Tokenization** - Language-agnostic core
- **🔄 Backward Compatible** - Legacy API still works

## 📦 Installation

```bash
npm install node-tfidf
```

## 🚀 Quick Start

```javascript
const TfIdf = require('node-tfidf');

const tfidf = new TfIdf();

// Add documents
tfidf
  .addDocument('This is a sample document about Node.js')
  .addDocument('This is another document about Ruby')
  .addDocument('Node.js is a JavaScript runtime');

// Calculate TF-IDF scores
const score = tfidf.score('Node.js', 0);  // Score for document 0
const allScores = tfidf.scoreAll('Node.js');  // Scores for all documents

// Get top terms
const topTerms = tfidf.topTerms(0, 5);  // Top 5 terms in document 0
console.log(topTerms);
// [
//   { term: 'node', score: 2.2 },
//   { term: 'js', score: 2.2 },
//   { term: 'sample', score: 1.5 },
//   ...
// ]
```

## 📚 API Reference

### Constructor

```javascript
const tfidf = new TfIdf(options);
```

**Options:**
- `tokenizer` - Custom tokenizer object with `tokenize(text)` method
- `stopwords` - Array of words to ignore
- `documents` - Pre-existing documents for restoration

**Example:**
```javascript
const tfidf = new TfIdf({
  stopwords: ['the', 'a', 'an', 'is'],
  tokenizer: customTokenizer
});
```

### Methods

#### `addDocument(document, metadata)`

Add a document to the corpus. Supports method chaining.

```javascript
tfidf.addDocument('Sample text');
tfidf.addDocument(['pre', 'tokenized', 'array']);
tfidf.addDocument('Document with metadata', { id: 'doc1', category: 'tech' });
```

#### `addFileSync(path, encoding, metadata)`

Add a document from a file (synchronous).

```javascript
tfidf.addFileSync('./documents/article.txt', 'utf8', { source: 'file' });
```

#### `score(terms, documentIndex)`

Calculate TF-IDF score for term(s) in a specific document.

```javascript
const score = tfidf.score('machine learning', 0);
const multiScore = tfidf.score(['machine', 'learning'], 0);
```

#### `scoreAll(terms)`

Calculate TF-IDF scores for term(s) across all documents.

```javascript
const scores = tfidf.scoreAll('javascript');
// [1.2, 0, 2.5, 0.8]
```

#### `topTerms(documentIndex, limit)`

Get top N terms for a document, sorted by TF-IDF score.

```javascript
const top10 = tfidf.topTerms(0, 10);
// [{ term: 'machine', score: 3.5 }, { term: 'learning', score: 3.2 }, ...]
```

#### `listTerms(documentIndex)`

Get all terms for a document (sorted by TF-IDF score).

```javascript
const allTerms = tfidf.listTerms(0);
```

#### `setTokenizer(tokenizer)`

Set a custom tokenizer.

```javascript
const customTokenizer = {
  tokenize: (text) => text.toLowerCase().split(/\s+/)
};

tfidf.setTokenizer(customTokenizer);
```

#### `setStopwords(words)` / `addStopwords(words)`

Set or add stopwords.

```javascript
tfidf.setStopwords(['the', 'a', 'an']);
tfidf.addStopwords(['is', 'are', 'was']);
```

#### `idf(term, force)`

Calculate Inverse Document Frequency for a term. Uses caching unless `force = true`.

```javascript
const idfScore = tfidf.idf('machine');
const recalculated = tfidf.idf('machine', true);
```

### Properties

#### `documentCount`

Get the number of documents in the corpus.

```javascript
console.log(tfidf.documentCount);  // 3
```

### Static Methods

#### `TfIdf.tf(term, document)`

Calculate raw term frequency.

```javascript
const doc = { hello: 3, world: 1 };
const freq = TfIdf.tf('hello', doc);  // 3
```

## 🎯 Advanced Usage

### Custom Tokenization (Language-Specific)

```javascript
// Vietnamese tokenizer example
const vietnameseTokenizer = {
  tokenize: (text) => {
    // Use your preferred Vietnamese tokenizer
    return text.toLowerCase().split(/\s+/);
  }
};

const tfidf = new TfIdf({ tokenizer: vietnameseTokenizer });
```

### Document Metadata

```javascript
tfidf.addDocument('Machine learning tutorial', {
  _id: 'doc123',
  _author: 'Jane Doe',
  _category: 'AI'
});

// Metadata is preserved but not indexed
const data = tfidf.toJSON();
console.log(data.documents[0]._author);  // 'Jane Doe'
```

### Serialization

```javascript
// Export
const data = tfidf.toJSON();
fs.writeFileSync('corpus.json', JSON.stringify(data));

// Restore
const restored = new TfIdf({ documents: data.documents });
```

### Multi-Language Support

```javascript
const englishStopwords = ['the', 'a', 'an', 'is', 'are', 'was', 'were'];
const spanishStopwords = ['el', 'la', 'de', 'que', 'y', 'es', 'en'];

const tfidf = new TfIdf({
  stopwords: [...englishStopwords, ...spanishStopwords]
});
```

## 🔄 Migration from v0.0.x

The new API is backward compatible, but we recommend updating to the modern API:

### Old API (Still Works)

```javascript
tfidf.tfidfs('term', function(i, measure, key) {
  console.log('document #' + i + ' is ' + measure);
});

const score = tfidf.tfidf('term', 0);
```

### New API (Recommended)

```javascript
const scores = tfidf.scoreAll('term');
scores.forEach((score, i) => {
  console.log(`document #${i} is ${score}`);
});

const score = tfidf.score('term', 0);
```

## 📊 Performance

Benchmarks on a modern laptop (Node.js v22):

| Operation | Throughput | Notes |
|-----------|-----------|-------|
| IDF Lookup (cached) | **1.7M ops/sec** | 6.8x faster than recalculation |
| Single Document Scoring | **991K ops/sec** | Very fast for real-time queries |
| Top Terms Extraction | **245K ops/sec** | Efficient even for large docs |
| Document Addition | **1.6K ops/sec** | Includes tokenization |

Run benchmarks yourself:
```bash
npm run benchmark
```

## ✅ Testing

```bash
# Modern test suite (39 tests)
npm test

# Legacy compatibility tests
npm run test:legacy

# Run all tests
npm run test:all
```

## 🎓 What is TF-IDF?

**TF-IDF** (Term Frequency-Inverse Document Frequency) measures how important a word is to a document in a corpus.

- **TF (Term Frequency)**: How often a term appears in a document
- **IDF (Inverse Document Frequency)**: How rare a term is across all documents
- **TF-IDF = TF × IDF**: High score means term is important to that specific document

**Use Cases:**
- Document similarity and ranking
- Keyword extraction
- Search relevance scoring
- Text classification
- Content recommendation

**Formula:**
```
TF-IDF(t, d) = TF(t, d) × IDF(t)
IDF(t) = 1 + log(N / (1 + df))
```

Where:
- `t` = term
- `d` = document
- `N` = total documents
- `df` = document frequency (documents containing term)

## 🤝 Contributing

We love contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Add tests for your changes
4. Ensure tests pass: `npm test`
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development

```bash
# Run tests
npm test

# Run benchmarks
npm run benchmark

# Test backward compatibility
npm run test:legacy
```

## 📜 License

MIT License

Copyright (c) 2015-2025 Van-Duyet Le

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Made with ❤️ by [Van-Duyet Le](https://github.com/duyetdev)**

If you find this library useful, please ⭐ star the repository!
