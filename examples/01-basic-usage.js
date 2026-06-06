/**
 * Example 1: Basic Usage
 * Demonstrates core TF-IDF functionality
 */

const TfIdf = require('../index');

console.log('=== Basic TF-IDF Usage ===\n');

// Create a new TF-IDF instance
const tfidf = new TfIdf();

// Add documents
tfidf
  .addDocument('Node.js is a JavaScript runtime built on Chrome V8 engine')
  .addDocument('Python is a popular programming language for data science')
  .addDocument('JavaScript is used for both frontend and backend development')
  .addDocument('Node.js enables server-side JavaScript execution');

console.log(`Added ${tfidf.documentCount} documents\n`);

// Calculate TF-IDF scores
console.log('TF-IDF scores for "JavaScript":');
const jsScores = tfidf.scoreAll('JavaScript');
jsScores.forEach((score, i) => {
  console.log(`  Document ${i}: ${score.toFixed(4)}`);
});

console.log('\nTF-IDF scores for "Node.js" in document 0:');
console.log(`  ${tfidf.score('Node.js', 0).toFixed(4)}`);

// Get top terms for a document
console.log('\nTop 5 terms in document 0:');
const topTerms = tfidf.topTerms(0, 5);
topTerms.forEach(({ term, score }) => {
  console.log(`  ${term}: ${score.toFixed(4)}`);
});

// Get corpus statistics
console.log('\nCorpus Statistics:');
const stats = tfidf.getStats();
console.log(`  Documents: ${stats.documentCount}`);
console.log(`  Vocabulary: ${stats.vocabularySize} unique terms`);
console.log(`  Total terms: ${stats.totalTerms}`);
console.log(`  Avg doc length: ${stats.averageDocumentLength.toFixed(2)} terms`);
