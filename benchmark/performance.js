/**
 * Performance benchmarks for TfIdf
 * Verifies cache optimization claims
 */

'use strict';

const TfIdf = require('../index');

// Helper to measure execution time
function benchmark(name, fn, iterations = 1000) {
  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1_000_000; // Convert to ms
  const avgTime = duration / iterations;

  console.log(`\n${name}`);
  console.log(`  Total: ${duration.toFixed(2)}ms`);
  console.log(`  Average: ${avgTime.toFixed(4)}ms per iteration`);
  console.log(`  Throughput: ${(iterations / (duration / 1000)).toFixed(0)} ops/sec`);

  return avgTime;
}

console.log('═══════════════════════════════════════');
console.log('  TF-IDF Performance Benchmarks');
console.log('═══════════════════════════════════════\n');

// Benchmark 1: Document addition
console.log('📝 Benchmark 1: Document Addition');
console.log('─────────────────────────────────────');

const tfidf1 = new TfIdf();
benchmark('Adding 1000 documents', () => {
  const tfidf = new TfIdf();
  for (let i = 0; i < 100; i++) {
    tfidf.addDocument(`document ${i} with some sample text`);
  }
}, 10);

// Benchmark 2: IDF calculation with caching
console.log('\n📊 Benchmark 2: IDF Caching');
console.log('─────────────────────────────────────');

const tfidf2 = new TfIdf();
for (let i = 0; i < 1000; i++) {
  tfidf2.addDocument(`document ${i} with sample text and keyword`);
}

const timeWithCache = benchmark('IDF lookup (with cache)', () => {
  tfidf2.idf('sample');
}, 10000);

const timeWithoutCache = benchmark('IDF calculation (forced recalc)', () => {
  tfidf2.idf('sample', true);
}, 10000);

const speedup = (timeWithoutCache / timeWithCache).toFixed(1);
console.log(`\n  ⚡ Cache speedup: ${speedup}x faster`);

// Benchmark 3: TF-IDF scoring
console.log('\n🎯 Benchmark 3: TF-IDF Scoring');
console.log('─────────────────────────────────────');

const tfidf3 = new TfIdf();
for (let i = 0; i < 100; i++) {
  tfidf3.addDocument(`document ${i} machine learning artificial intelligence`);
}

benchmark('Single document scoring', () => {
  tfidf3.score('machine', 0);
}, 10000);

benchmark('Multi-term scoring', () => {
  tfidf3.score(['machine', 'learning'], 0);
}, 10000);

benchmark('Score all documents', () => {
  tfidf3.scoreAll('machine');
}, 1000);

// Benchmark 4: Top terms extraction
console.log('\n🔝 Benchmark 4: Top Terms');
console.log('─────────────────────────────────────');

const tfidf4 = new TfIdf();
tfidf4.addDocument('machine learning is a subset of artificial intelligence that focuses on algorithms');
tfidf4.addDocument('deep learning is a type of machine learning based on neural networks');
tfidf4.addDocument('natural language processing enables computers to understand human language');

benchmark('Extract top 10 terms', () => {
  tfidf4.topTerms(0, 10);
}, 10000);

benchmark('List all terms', () => {
  tfidf4.listTerms(0);
}, 10000);

// Benchmark 5: Large corpus
console.log('\n📚 Benchmark 5: Large Corpus');
console.log('─────────────────────────────────────');

const tfidf5 = new TfIdf();
console.log('Creating corpus with 10,000 documents...');
for (let i = 0; i < 10000; i++) {
  tfidf5.addDocument(`document ${i} ${Math.random() > 0.5 ? 'important' : 'regular'} content`);
}

benchmark('Query large corpus (cached)', () => {
  tfidf5.score('important', 0);
}, 1000);

benchmark('Score all in large corpus', () => {
  tfidf5.scoreAll('important');
}, 10);

// Benchmark 6: Memory efficiency
console.log('\n💾 Benchmark 6: Memory Usage');
console.log('─────────────────────────────────────');

const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;

const tfidf6 = new TfIdf();
for (let i = 0; i < 1000; i++) {
  tfidf6.addDocument('The quick brown fox jumps over the lazy dog');
}

const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
const memUsed = (memAfter - memBefore).toFixed(2);

console.log(`  Memory for 1000 documents: ${memUsed} MB`);
console.log(`  Average per document: ${(parseFloat(memUsed) / 1000 * 1024).toFixed(2)} KB`);

// Benchmark 7: Tokenization
console.log('\n✂️  Benchmark 7: Tokenization');
console.log('─────────────────────────────────────');

const longText = 'word '.repeat(1000);

benchmark('Tokenize 1000-word document', () => {
  const tfidf = new TfIdf();
  tfidf.addDocument(longText);
}, 1000);

// Custom tokenizer comparison
const customTokenizer = {
  tokenize: (text) => text.toLowerCase().split(/\s+/)
};

const tfidf7 = new TfIdf({ tokenizer: customTokenizer });

benchmark('Custom tokenizer (simple split)', () => {
  const tfidf = new TfIdf({ tokenizer: customTokenizer });
  tfidf.addDocument(longText);
}, 1000);

console.log('\n═══════════════════════════════════════');
console.log('  ✅ Benchmarks Complete!');
console.log('═══════════════════════════════════════\n');
