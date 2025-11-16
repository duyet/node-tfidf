# node-tfidf Examples

This directory contains practical examples demonstrating various features of node-tfidf.

## Running Examples

```bash
# Run all examples
npm run examples

# Run specific example
node examples/01-basic-usage.js
```

## Examples Overview

### 01 - Basic Usage
**File:** `01-basic-usage.js`

Learn the fundamentals:
- Creating a TF-IDF instance
- Adding documents
- Calculating TF-IDF scores
- Getting top terms
- Corpus statistics

```bash
node examples/01-basic-usage.js
```

### 02 - Document Similarity
**File:** `02-document-similarity.js`

Find similar documents:
- Calculate cosine similarity between documents
- Find most similar documents
- Use metadata for document management
- Search by metadata fields

```bash
node examples/02-document-similarity.js
```

### 03 - Search Engine
**File:** `03-search-engine.js`

Build a simple search engine:
- Index a document collection
- Perform ranked searches
- Filter by score threshold
- Display search results

```bash
node examples/03-search-engine.js
```

### 04 - Advanced Features
**File:** `04-advanced-features.js`

Explore advanced capabilities:
- Custom stopwords
- Batch document operations
- CRUD operations (Create, Read, Update, Delete)
- Custom tokenizers
- Serialization & persistence

```bash
node examples/04-advanced-features.js
```

### 05 - Async File Loading
**File:** `05-async-file-loading.js`

Work with files asynchronously:
- Load documents from files
- Parallel vs sequential loading
- File-based document management
- Error handling

```bash
node examples/05-async-file-loading.js
```

## Real-World Use Cases

### Content Recommendation
```javascript
// Find similar articles for "related content" features
const similar = tfidf.findSimilar(currentArticleIndex, 5);
```

### Search Functionality
```javascript
// Search with minimum relevance threshold
const results = tfidf.search(userQuery, 10, 0.5);
```

### Keyword Extraction
```javascript
// Extract important keywords from a document
const keywords = tfidf.topTerms(docIndex, 10);
```

### Document Classification
```javascript
// Calculate similarity to category prototypes
categories.forEach(categoryDoc => {
  const similarity = tfidf.similarity(newDoc, categoryDoc);
  // Assign to category with highest similarity
});
```

### Duplicate Detection
```javascript
// Find near-duplicate documents
for (let i = 0; i < tfidf.documentCount; i++) {
  const similar = tfidf.findSimilar(i, 1);
  if (similar[0].similarity > 0.95) {
    console.log(`Documents ${i} and ${similar[0].index} are duplicates`);
  }
}
```

## Tips & Best Practices

### Performance
- Use `addDocuments()` for batch operations
- Pre-tokenize if using the same tokenizer repeatedly
- Set appropriate stopwords for your language/domain
- Consider document size limits for large corpora

### Accuracy
- Clean your text (remove HTML, special chars, etc.)
- Use domain-specific stopwords
- Consider stemming/lemmatization in custom tokenizer
- Normalize text (lowercase, trim, etc.)

### Production Use
- Serialize corpus for persistence
- Implement caching for frequently accessed scores
- Add input validation
- Set memory limits for public-facing applications

## Contributing Examples

Have a great example? Please contribute!

1. Create a new numbered example file
2. Follow the existing format
3. Add clear comments
4. Update this README
5. Submit a pull request

## Need Help?

- Check the main [README](../README.md)
- Read the [API documentation](../README.md#-api-reference)
- Open an [issue](https://github.com/duyetdev/node-tfidf/issues)
