/**
 * Example 2: Document Similarity
 * Find similar documents using cosine similarity
 */

const TfIdf = require('../index');

console.log('=== Document Similarity ===\n');

const tfidf = new TfIdf();

// Add documents with metadata
const docs = [
  { text: 'Machine learning is a subset of artificial intelligence', title: 'ML Basics' },
  { text: 'Deep learning uses neural networks with multiple layers', title: 'Deep Learning' },
  { text: 'Natural language processing helps computers understand human language', title: 'NLP' },
  { text: 'Supervised learning requires labeled training data', title: 'Supervised Learning' },
  { text: 'Neural networks are inspired by biological brain structure', title: 'Neural Nets' }
];

docs.forEach(({ text, title }) => {
  tfidf.addDocument(text, { _title: title });
});

console.log('Documents added:');
for (let i = 0; i < tfidf.documentCount; i++) {
  const meta = tfidf.getMetadata(i);
  console.log(`  ${i}: ${meta._title}`);
}

// Calculate similarity between two documents
console.log('\nSimilarity between doc 0 and doc 1:');
const sim = tfidf.similarity(0, 1);
console.log(`  ${(sim * 100).toFixed(2)}%`);

// Find most similar documents
console.log('\nDocuments similar to "Deep Learning" (doc 1):');
const similar = tfidf.findSimilar(1, 3);
similar.forEach(({ index, similarity, metadata }) => {
  console.log(`  ${metadata._title} (doc ${index}): ${(similarity * 100).toFixed(2)}%`);
});

// Find by metadata
console.log('\nFinding document by title:');
const nlpIndex = tfidf.findByMetadata('_title', 'NLP');
console.log(`  "NLP" is at index: ${nlpIndex}`);
