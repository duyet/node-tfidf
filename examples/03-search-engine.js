/**
 * Example 3: Search Engine
 * Build a simple search engine with ranked results
 */

const TfIdf = require('../index');

console.log('=== Search Engine ===\n');

const tfidf = new TfIdf();

// Sample article database
const articles = [
  {
    title: 'Introduction to Machine Learning',
    content: 'Machine learning is a method of data analysis that automates analytical model building'
  },
  {
    title: 'Getting Started with Python',
    content: 'Python is an interpreted high-level programming language for general-purpose programming'
  },
  {
    title: 'Web Development with JavaScript',
    content: 'JavaScript is a programming language that enables interactive web pages and is an essential part of web applications'
  },
  {
    title: 'Data Science Fundamentals',
    content: 'Data science combines domain expertise, programming skills, and knowledge of mathematics and statistics'
  },
  {
    title: 'Advanced Python Programming',
    content: 'Advanced Python programming techniques include decorators, generators, context managers and metaclasses'
  }
];

// Index all articles
articles.forEach(({ title, content }) => {
  tfidf.addDocument(content, { _title: title });
});

console.log(`Indexed ${tfidf.documentCount} articles\n`);

// Search function
function search(query, limit = 3) {
  console.log(`\n🔍 Search: "${query}"`);
  console.log('─'.repeat(50));

  const results = tfidf.search(query, limit);

  if (results.length === 0) {
    console.log('No results found');
    return;
  }

  results.forEach(({ index, score, metadata }, rank) => {
    console.log(`${rank + 1}. ${metadata._title}`);
    console.log(`   Score: ${score.toFixed(4)}`);
    console.log(`   ${articles[index].content.substring(0, 60)}...`);
  });
}

// Perform searches
search('Python programming');
search('machine learning data');
search('JavaScript web development');
search('quantum computing', 5); // No results expected

// Get vocabulary
console.log('\n\nCorpus Vocabulary (first 10 terms):');
const vocab = tfidf.getVocabulary();
console.log(vocab.slice(0, 10).join(', '));
