/**
 * Example 4: Advanced Features
 * Batch operations, document updates, stopwords, and more
 */

const TfIdf = require('../index');

console.log('=== Advanced Features ===\n');

// Custom stopwords
console.log('1. Custom Stopwords');
console.log('─'.repeat(50));

const tfidf = new TfIdf({
  stopwords: ['the', 'is', 'a', 'an', 'and', 'or', 'but']
});

tfidf.addDocument('The cat is on the mat and the dog is in the yard');

console.log('Top terms (with stopwords filtered):');
const terms = tfidf.topTerms(0, 5);
terms.forEach(({ term, score }) => {
  console.log(`  ${term}: ${score.toFixed(4)}`);
});

// Batch document addition
console.log('\n2. Batch Operations');
console.log('─'.repeat(50));

const tfidf2 = new TfIdf();

const docs = [
  'First document about technology',
  'Second document about science',
  'Third document about mathematics'
];

const metadata = [
  { _id: 'doc1', _category: 'tech' },
  { _id: 'doc2', _category: 'science' },
  { _id: 'doc3', _category: 'math' }
];

tfidf2.addDocuments(docs, metadata);
console.log(`Added ${tfidf2.documentCount} documents in batch`);

// Document CRUD operations
console.log('\n3. Document CRUD Operations');
console.log('─'.repeat(50));

const tfidf3 = new TfIdf();

// Create
tfidf3.addDocument('Original document', { _id: 'doc1' });
console.log(`Created: ${tfidf3.documentCount} document(s)`);

// Read
console.log(`Metadata:`, tfidf3.getMetadata(0));

// Update
tfidf3.updateDocument(0, 'Updated document content', { _id: 'doc1', _updated: true });
console.log(`Updated document 0`);
console.log(`New metadata:`, tfidf3.getMetadata(0));

// Delete
tfidf3.addDocument('Document to be deleted');
console.log(`Before delete: ${tfidf3.documentCount} documents`);
tfidf3.removeDocument(1);
console.log(`After delete: ${tfidf3.documentCount} documents`);

// Custom tokenizer
console.log('\n4. Custom Tokenizer');
console.log('─'.repeat(50));

const customTokenizer = {
  tokenize: (text) => {
    // Custom tokenization: split on whitespace, keep punctuation
    return text.split(/\s+/).map(t => t.toLowerCase());
  }
};

const tfidf4 = new TfIdf({ tokenizer: customTokenizer });
tfidf4.addDocument('Hello, world! How are you?');

console.log('Tokens with custom tokenizer:');
const vocab = tfidf4.getVocabulary();
console.log(vocab.join(', '));

// Serialization
console.log('\n5. Serialization & Persistence');
console.log('─'.repeat(50));

const tfidf5 = new TfIdf();
tfidf5.addDocument('Document one');
tfidf5.addDocument('Document two');

// Export to JSON
const exported = tfidf5.toJSON();
console.log(`Exported ${exported.documents.length} documents`);

// Import from JSON
const tfidf6 = new TfIdf({ documents: exported.documents });
console.log(`Imported ${tfidf6.documentCount} documents`);
console.log(`Vocabulary:`, tfidf6.getVocabulary());
