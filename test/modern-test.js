/**
 * Comprehensive test suite for TfIdf
 * Uses Node.js built-in test runner and assert module
 * Run with: node --test test/modern-test.js
 */

'use strict';

const assert = require('assert');
const { describe, it } = require('node:test');
const TfIdf = require('../index.js');

describe('TfIdf - Core Functionality', () => {
  it('should create an empty instance', () => {
    const tfidf = new TfIdf();
    assert.strictEqual(tfidf.documentCount, 0);
  });

  it('should add documents and update count', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('This is a test');
    tfidf.addDocument('This is another test');

    assert.strictEqual(tfidf.documentCount, 2);
  });

  it('should support method chaining', () => {
    const tfidf = new TfIdf();
    const result = tfidf
      .addDocument('First document')
      .addDocument('Second document');

    assert.strictEqual(result, tfidf);
    assert.strictEqual(tfidf.documentCount, 2);
  });

  it('should accept pre-tokenized arrays', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument(['hello', 'world']);
    tfidf.addDocument(['hello', 'universe']);

    assert.strictEqual(tfidf.documentCount, 2);
  });

  it('should throw on invalid document types', () => {
    const tfidf = new TfIdf();
    assert.throws(() => {
      tfidf.addDocument(123);
    }, TypeError);

    assert.throws(() => {
      tfidf.addDocument({ foo: 'bar' });
    }, TypeError);
  });
});

describe('TfIdf - TF-IDF Calculation', () => {
  it('should calculate correct TF-IDF scores', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('this is a sample');
    tfidf.addDocument('this is another example');

    // Term "sample" appears only in doc 0
    const score0 = tfidf.score('sample', 0);
    const score1 = tfidf.score('sample', 1);

    assert.ok(score0 > 0, 'Score for doc containing term should be > 0');
    assert.strictEqual(score1, 0, 'Score for doc without term should be 0');
  });

  it('should handle multi-word terms', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('machine learning is awesome');
    tfidf.addDocument('deep learning is powerful');

    const score = tfidf.score(['machine', 'learning'], 0);
    assert.ok(score > 0);
  });

  it('should calculate IDF correctly', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('cat dog');
    tfidf.addDocument('cat bird');
    tfidf.addDocument('cat fish');

    // 'cat' appears in all 3 docs - should have lower IDF
    const idfCat = tfidf.idf('cat');

    // 'dog' appears in only 1 doc - should have higher IDF
    const idfDog = tfidf.idf('dog');

    assert.ok(idfDog > idfCat, 'Rare terms should have higher IDF');
  });

  it('should use smooth IDF formula', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('hello world');

    // Term not in any document - should not be Infinity
    const idf = tfidf.idf('nonexistent');
    assert.ok(isFinite(idf), 'IDF should be finite');
    assert.ok(idf > 0, 'Smooth IDF should be positive');
  });

  it('should cache IDF values', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test document');

    const idf1 = tfidf.idf('test');
    const idf2 = tfidf.idf('test');

    assert.strictEqual(idf1, idf2, 'Cached IDF should be identical');
  });

  it('should invalidate cache when adding documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test');

    const idfBefore = tfidf.idf('test');

    tfidf.addDocument('another document');

    const idfAfter = tfidf.idf('test', true); // force recalc

    assert.notStrictEqual(idfBefore, idfAfter, 'IDF should change after adding docs');
  });
});

describe('TfIdf - scoreAll()', () => {
  it('should return scores for all documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('apple banana');
    tfidf.addDocument('banana cherry');
    tfidf.addDocument('cherry date');

    const scores = tfidf.scoreAll('banana');

    assert.strictEqual(scores.length, 3);
    assert.ok(scores[0] > 0, 'Doc 0 contains banana');
    assert.ok(scores[1] > 0, 'Doc 1 contains banana');
    assert.strictEqual(scores[2], 0, 'Doc 2 does not contain banana');
  });
});

describe('TfIdf - topTerms() and listTerms()', () => {
  it('should return top N terms sorted by TF-IDF', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('apple apple apple banana');
    tfidf.addDocument('banana cherry');

    const topTerms = tfidf.topTerms(0, 2);

    assert.strictEqual(topTerms.length, 2);
    assert.strictEqual(topTerms[0].term, 'apple', 'Most frequent unique term');
    assert.ok(topTerms[0].score > topTerms[1].score, 'Should be sorted by score');
  });

  it('should respect limit parameter', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('a b c d e f g h');

    const top3 = tfidf.topTerms(0, 3);
    assert.strictEqual(top3.length, 3);
  });

  it('listTerms should return all terms', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('a b c');

    const allTerms = tfidf.listTerms(0);
    assert.strictEqual(allTerms.length, 3);
  });

  it('should throw on invalid document index', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test');

    assert.throws(() => {
      tfidf.topTerms(5);
    }, RangeError);

    assert.throws(() => {
      tfidf.topTerms(-1);
    }, RangeError);
  });
});

describe('TfIdf - Stopwords', () => {
  it('should filter stopwords', () => {
    const tfidf = new TfIdf({
      stopwords: ['the', 'is', 'a']
    });

    tfidf.addDocument('the cat is a mammal');

    const terms = tfidf.listTerms(0);
    const termList = terms.map(t => t.term);

    assert.ok(!termList.includes('the'));
    assert.ok(!termList.includes('is'));
    assert.ok(!termList.includes('a'));
    assert.ok(termList.includes('cat'));
    assert.ok(termList.includes('mammal'));
  });

  it('should allow adding stopwords after construction', () => {
    const tfidf = new TfIdf();
    tfidf.setStopwords(['foo', 'bar']);
    tfidf.addDocument('foo bar baz');

    const terms = tfidf.listTerms(0);
    assert.strictEqual(terms.length, 1);
    assert.strictEqual(terms[0].term, 'baz');
  });

  it('should be case-insensitive for stopwords', () => {
    const tfidf = new TfIdf();
    tfidf.setStopwords(['THE']);
    tfidf.addDocument('The cat');

    const terms = tfidf.listTerms(0);
    const termList = terms.map(t => t.term);

    assert.ok(!termList.includes('the'));
  });
});

describe('TfIdf - Custom Tokenizer', () => {
  it('should accept custom tokenizer', () => {
    // Simple tokenizer that splits on commas
    const customTokenizer = {
      tokenize: (text) => text.toLowerCase().split(',').map(s => s.trim())
    };

    const tfidf = new TfIdf({ tokenizer: customTokenizer });
    tfidf.addDocument('apple,banana,cherry');

    const terms = tfidf.listTerms(0);
    assert.strictEqual(terms.length, 3);
    assert.ok(terms.some(t => t.term === 'apple'));
  });

  it('should throw on invalid tokenizer', () => {
    assert.throws(() => {
      new TfIdf({ tokenizer: {} });
    }, TypeError);

    assert.throws(() => {
      new TfIdf({ tokenizer: 'not an object' });
    }, TypeError);
  });

  it('should allow setting tokenizer after construction', () => {
    const tfidf = new TfIdf();
    const customTokenizer = {
      tokenize: (text) => [text.toLowerCase()]
    };

    tfidf.setTokenizer(customTokenizer);
    tfidf.addDocument('this-is-one-token');

    const terms = tfidf.listTerms(0);
    assert.strictEqual(terms.length, 1);
    assert.strictEqual(terms[0].term, 'this-is-one-token');
  });
});

describe('TfIdf - Metadata', () => {
  it('should store metadata with documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test', { _id: 'doc1', _title: 'Test Document' });

    const json = tfidf.toJSON();
    assert.strictEqual(json.documents[0]._id, 'doc1');
    assert.strictEqual(json.documents[0]._title, 'Test Document');
  });

  it('should not include metadata fields in term list', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('hello world', { _id: 'doc1' });

    const terms = tfidf.listTerms(0);
    const termList = terms.map(t => t.term);

    assert.ok(!termList.includes('_id'));
  });
});

describe('TfIdf - Edge Cases', () => {
  it('should handle empty documents', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('');
    tfidf.addDocument('   ');

    assert.strictEqual(tfidf.documentCount, 2);
  });

  it('should handle documents with only stopwords', () => {
    const tfidf = new TfIdf({ stopwords: ['the', 'a', 'an'] });
    tfidf.addDocument('the a an');

    const terms = tfidf.listTerms(0);
    assert.strictEqual(terms.length, 0);
  });

  it('should handle special characters and punctuation', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('Hello, world! How are you?');

    const terms = tfidf.listTerms(0);
    const termList = terms.map(t => t.term);

    assert.ok(termList.includes('hello'));
    assert.ok(termList.includes('world'));
    assert.ok(!termList.includes('hello,'));
  });

  it('should handle Unicode and emojis', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('Hello 世界 🌍');

    const score = tfidf.score('hello', 0);
    assert.ok(score >= 0);
  });

  it('should handle very long documents', () => {
    const tfidf = new TfIdf();
    const longDoc = 'word '.repeat(10000);

    tfidf.addDocument(longDoc);
    assert.strictEqual(tfidf.documentCount, 1);
  });

  it('should handle score calculation with out-of-bounds index', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test');

    assert.throws(() => {
      tfidf.score('test', 10);
    }, RangeError);
  });
});

describe('TfIdf - Serialization', () => {
  it('should export to JSON', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('test document');

    const json = tfidf.toJSON();
    assert.ok(Array.isArray(json.documents));
    assert.strictEqual(json.documents.length, 1);
  });

  it('should restore from serialized data', () => {
    const tfidf1 = new TfIdf();
    tfidf1.addDocument('hello world');

    const json = tfidf1.toJSON();

    const tfidf2 = new TfIdf({ documents: json.documents });
    assert.strictEqual(tfidf2.documentCount, 1);

    const score1 = tfidf1.score('hello', 0);
    const score2 = tfidf2.score('hello', 0);

    assert.strictEqual(score1, score2);
  });
});

describe('TfIdf - Static Methods', () => {
  it('should provide static tf() method', () => {
    const doc = { hello: 3, world: 1 };
    assert.strictEqual(TfIdf.tf('hello', doc), 3);
    assert.strictEqual(TfIdf.tf('world', doc), 1);
    assert.strictEqual(TfIdf.tf('missing', doc), 0);
  });
});

describe('TfIdf - Backward Compatibility', () => {
  it('should support legacy tfidf() method', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('hello world');
    tfidf.addDocument('hello universe');

    // Old API
    const score = tfidf.tfidf('hello', 0);
    assert.ok(score > 0);
  });

  it('should support legacy tfidfs() callback API', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('apple');
    tfidf.addDocument('banana');

    const results = [];
    const scores = tfidf.tfidfs('apple', (i, measure) => {
      results.push({ index: i, score: measure });
    });

    assert.strictEqual(results.length, 2);
    assert.strictEqual(scores.length, 2);
    assert.ok(results[0].score > 0);
    assert.strictEqual(results[1].score, 0);
  });

  it('should work with old-style addDocument calls', () => {
    const tfidf = new TfIdf();

    // Old API: addDocument(doc, key, restoreCache)
    tfidf.addDocument('test', { __key: 'doc1' });

    const json = tfidf.toJSON();
    assert.strictEqual(json.documents[0].__key, 'doc1');
  });
});

describe('TfIdf - Mathematical Correctness', () => {
  it('should calculate TF correctly', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument(['word', 'word', 'word', 'other']);

    const doc = tfidf.toJSON().documents[0];
    assert.strictEqual(TfIdf.tf('word', doc), 3);
    assert.strictEqual(TfIdf.tf('other', doc), 1);
  });

  it('should follow smooth IDF formula: 1 + log(N / (1 + df))', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument('cat');
    tfidf.addDocument('cat');
    tfidf.addDocument('dog');

    const idfCat = tfidf.idf('cat');

    // Manual calculation: 1 + log(3 / (1 + 2)) = 1 + log(1) = 1
    const expected = 1 + Math.log(3 / (1 + 2));

    assert.strictEqual(idfCat, expected);
  });

  it('should calculate TF-IDF as tf * idf', () => {
    const tfidf = new TfIdf();
    tfidf.addDocument(['test', 'test']);
    tfidf.addDocument('other');

    const doc = tfidf.toJSON().documents[0];
    const tf = TfIdf.tf('test', doc);
    const idf = tfidf.idf('test');
    const tfidfScore = tfidf.score('test', 0);

    assert.strictEqual(tfidfScore, tf * idf);
  });
});

console.log('\n✅ All tests completed!\n');
