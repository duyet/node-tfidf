/**
 * Comprehensive test suite for advanced TfIdf features
 * Run with: node --test test/advanced-test.js
 */

'use strict';

const assert = require('assert');
const { describe, it } = require('node:test');
const fs = require('fs');
const path = require('path');
const TfIdf = require('../index.js');

describe('TfIdf - Async File Operations', () => {
  const tempDir = path.join(__dirname, '../temp-test');
  const tempFile = path.join(tempDir, 'test.txt');

  // Setup
  before: (async () => {
    await fs.promises.mkdir(tempDir, { recursive: true });
    await fs.promises.writeFile(tempFile, 'async file loading test');
  })();

  it('should load files asynchronously', async () => {
    const tfidf = new TfIdf();
    await tfidf.addFile(tempFile, 'utf8', { _source: 'file' });

    assert.strictEqual(tfidf.documentCount, 1);
    const meta = tfidf.getMetadata(0);
    assert.strictEqual(meta._source, 'file');
    assert.strictEqual(meta._filePath, tempFile);
  });

  it('should handle invalid encoding', async () => {
    const tfidf = new TfIdf();
    await assert.rejects(
      async () => await tfidf.addFile(tempFile, 'invalid-encoding'),
      /Invalid encoding/
    );
  });

  // Cleanup
  after: (async () => {
    try {
      await fs.promises.unlink(tempFile);
      await fs.promises.rmdir(tempDir);
    } catch (e) {
      // Ignore cleanup errors
    }
  })();
});

describe('TfIdf - Batch Operations', () => {
  it('should add multiple documents at once', () => {
    const tfidf = new TfIdf();
    const docs = ['doc one', 'doc two', 'doc three'];
    const metadata = [{ _id: '1' }, { _id: '2' }, { _id: '3' }];

    tfidf.addDocuments(docs, metadata);

    assert.strictEqual(tfidf.documentCount, 3);
    assert.strictEqual(tfidf.getMetadata(0)._id, '1');
    assert.strictEqual(tfidf.getMetadata(1)._id, '2');
  });

  it('should handle batch add without metadata', () => {
    const tfidf = new TfIdf();
    tfidf.addDocuments(['one', 'two', 'three']);
    assert.strictEqual(tfidf.documentCount, 3);
  });

  it('should throw on invalid documents array', () => {
    const tfidf = new TfIdf();
    assert.throws(() => {
      tfidf.addDocuments('not an array');
    }, TypeError);
  });
});

describe('TfIdf - Document Removal', () => {
  it('should remove documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('doc 1');
    tfidf.addDocument('doc 2');
    tfidf.addDocument('doc 3');

    tfidf.removeDocument(1);

    assert.strictEqual(tfidf.documentCount, 2);
  });

  it('should invalidate cache after removal', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test word');
    tfidf.addDocument('another document');

    const idfBefore = tfidf.idf('test');
    tfidf.removeDocument(1);
    const idfAfter = tfidf.idf('test', true);

    // IDF should change after document removal
    assert.notStrictEqual(idfBefore, idfAfter);
  });

  it('should throw on invalid removal index', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('doc');

    assert.throws(() => {
      tfidf.removeDocument(10);
    }, RangeError);

    assert.throws(() => {
      tfidf.removeDocument(-1);
    }, RangeError);
  });
});

describe('TfIdf - Document Update', () => {
  it('should update document content', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('original content');

    tfidf.updateDocument(0, 'new content');

    const terms = tfidf.listTerms(0);
    const termList = terms.map(t => t.term);

    assert.ok(termList.includes('new'));
    assert.ok(!termList.includes('original'));
  });

  it('should preserve metadata on update', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('original', { _id: 'doc1', _version: 1 });

    tfidf.updateDocument(0, 'updated', { _version: 2 });

    const meta = tfidf.getMetadata(0);
    assert.strictEqual(meta._id, 'doc1');
    assert.strictEqual(meta._version, 2);
  });

  it('should throw on invalid update index', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('doc');

    assert.throws(() => {
      tfidf.updateDocument(10, 'new content');
    }, RangeError);
  });
});

describe('TfIdf - Document Similarity', () => {
  it('should calculate similarity between identical documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('machine learning data science');
    tfidf.addDocument('machine learning data science');

    const sim = tfidf.similarity(0, 1);
    assert.ok(sim > 0.99, 'Identical documents should have ~1.0 similarity');
  });

  it('should calculate similarity between different documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('machine learning');
    tfidf.addDocument('deep learning');
    tfidf.addDocument('quantum computing');

    const sim1 = tfidf.similarity(0, 1);
    const sim2 = tfidf.similarity(0, 2);

    assert.ok(sim1 > sim2, 'Docs with shared terms should be more similar');
  });

  it('should return 0 for completely different documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('apple banana');
    tfidf.addDocument('car truck');

    const sim = tfidf.similarity(0, 1);
    assert.strictEqual(sim, 0);
  });

  it('should handle empty documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('');
    tfidf.addDocument('some content');

    const sim = tfidf.similarity(0, 1);
    assert.strictEqual(sim, 0);
  });

  it('should throw on invalid similarity indices', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('doc');

    assert.throws(() => {
      tfidf.similarity(0, 10);
    }, RangeError);
  });
});

describe('TfIdf - Find Similar Documents', () => {
  it('should find similar documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('machine learning algorithms', { _title: 'ML' });
    tfidf.addDocument('deep learning networks', { _title: 'DL' });
    tfidf.addDocument('quantum mechanics', { _title: 'QM' });

    const similar = tfidf.findSimilar(0, 2);

    assert.strictEqual(similar.length, 2);
    assert.strictEqual(similar[0].metadata._title, 'DL');
    assert.ok(similar[0].similarity > similar[1].similarity);
  });

  it('should exclude self from similarity results', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('doc one');
    tfidf.addDocument('doc two');

    const similar = tfidf.findSimilar(0, 10);

    const indices = similar.map(s => s.index);
    assert.ok(!indices.includes(0), 'Should not include self');
  });

  it('should respect limit parameter', () => {
    const tfidf = new TfIdf();
    for (let i = 0; i < 10; i++) {
      tfidf.addDocument(`document ${i}`);
    }

    const similar = tfidf.findSimilar(0, 3);
    assert.strictEqual(similar.length, 3);
  });
});

describe('TfIdf - Search Functionality', () => {
  it('should search and rank documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('machine learning tutorial');
    tfidf.addDocument('web development guide');
    tfidf.addDocument('machine learning advanced');

    const results = tfidf.search('machine learning');

    assert.ok(results.length > 0);
    assert.ok(results[0].score > 0);
    // Results should be sorted by score
    for (let i = 0; i < results.length - 1; i++) {
      assert.ok(results[i].score >= results[i + 1].score);
    }
  });

  it('should filter by threshold', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('machine learning');
    tfidf.addDocument('web development');

    const results = tfidf.search('machine learning', 10, 1.0);

    results.forEach(r => {
      assert.ok(r.score >= 1.0);
    });
  });

  it('should limit results', () => {
    const tfidf = new TfIdf();
    for (let i = 0; i < 10; i++) {
      tfidf.addDocument(`document with word${i}`);
    }

    const results = tfidf.search('document', 3);
    assert.strictEqual(results.length, 3);
  });

  it('should return empty for no matches', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('apple orange');

    const results = tfidf.search('computer');
    assert.strictEqual(results.length, 0);
  });
});

describe('TfIdf - Metadata Operations', () => {
  it('should get document metadata', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test', { _id: 'doc1', _author: 'John' });

    const meta = tfidf.getMetadata(0);
    assert.strictEqual(meta._id, 'doc1');
    assert.strictEqual(meta._author, 'John');
  });

  it('should find document by metadata', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('doc1', { _id: 'first' });
    tfidf.addDocument('doc2', { _id: 'second' });
    tfidf.addDocument('doc3', { _id: 'third' });

    const index = tfidf.findByMetadata('_id', 'second');
    assert.strictEqual(index, 1);
  });

  it('should return -1 for non-existent metadata', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test', { _id: 'doc1' });

    const index = tfidf.findByMetadata('_id', 'nonexistent');
    assert.strictEqual(index, -1);
  });

  it('should auto-prefix metadata field', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test', { _id: 'doc1' });

    const index = tfidf.findByMetadata('id', 'doc1'); // without _
    assert.strictEqual(index, 0);
  });
});

describe('TfIdf - Vocabulary & Statistics', () => {
  it('should get vocabulary', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('apple banana cherry');
    tfidf.addDocument('banana cherry date');

    const vocab = tfidf.getVocabulary();

    assert.ok(Array.isArray(vocab));
    assert.ok(vocab.includes('apple'));
    assert.ok(vocab.includes('banana'));
    assert.ok(vocab.includes('cherry'));
    assert.ok(vocab.includes('date'));

    // Should be sorted
    const sorted = [...vocab].sort();
    assert.deepStrictEqual(vocab, sorted);
  });

  it('should get corpus statistics', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('one two three');
    tfidf.addDocument('four five');

    const stats = tfidf.getStats();

    assert.strictEqual(stats.documentCount, 2);
    assert.strictEqual(stats.vocabularySize, 5);
    assert.strictEqual(stats.totalTerms, 5);
    assert.strictEqual(stats.averageDocumentLength, 2.5);
  });

  it('should handle empty corpus stats', () => {
    const tfidf = new TfIdf();
    const stats = tfidf.getStats();

    assert.strictEqual(stats.documentCount, 0);
    assert.strictEqual(stats.vocabularySize, 0);
    assert.strictEqual(stats.totalTerms, 0);
    assert.strictEqual(stats.averageDocumentLength, 0);
  });

  it('should exclude metadata from vocabulary', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test document', { _id: 'doc1', _title: 'test' });

    const vocab = tfidf.getVocabulary();

    assert.ok(!vocab.includes('_id'));
    assert.ok(!vocab.includes('_title'));
  });
});

describe('TfIdf - Integration Tests', () => {
  it('should handle complete workflow', () => {
    const tfidf = new TfIdf({ stopwords: ['the', 'is', 'a'] });

    // Add documents
    tfidf.addDocuments([
      'Machine learning is a method of data analysis',
      'Deep learning is a subset of machine learning',
      'Natural language processing is a branch of AI'
    ], [
      { _id: 'ml', _category: 'AI' },
      { _id: 'dl', _category: 'AI' },
      { _id: 'nlp', _category: 'AI' }
    ]);

    assert.strictEqual(tfidf.documentCount, 3);

    // Search
    const results = tfidf.search('machine learning', 2);
    assert.ok(results.length > 0);
    assert.ok(results[0].score > 0);

    // Find similar
    const similar = tfidf.findSimilar(0, 2);
    assert.strictEqual(similar.length, 2);

    // Update document
    tfidf.updateDocument(0, 'Updated machine learning content', { _updated: true });

    // Verify update
    const meta = tfidf.getMetadata(0);
    assert.strictEqual(meta._updated, true);
    assert.strictEqual(meta._id, 'ml');

    // Statistics
    const stats = tfidf.getStats();
    assert.strictEqual(stats.documentCount, 3);
    assert.ok(stats.vocabularySize > 0);
  });
});

console.log('\n✅ All advanced tests completed!\n');
