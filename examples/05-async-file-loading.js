/**
 * Example 5: Async File Loading
 * Load documents from files asynchronously
 */

const TfIdf = require('../index');
const fs = require('fs').promises;
const path = require('path');

console.log('=== Async File Loading ===\n');

async function main() {
  const tfidf = new TfIdf();

  // Create sample files
  const tempDir = path.join(__dirname, '../temp');

  try {
    await fs.mkdir(tempDir, { recursive: true });

    const files = [
      { name: 'doc1.txt', content: 'Machine learning algorithms learn from data to make predictions' },
      { name: 'doc2.txt', content: 'Natural language processing analyzes human language' },
      { name: 'doc3.txt', content: 'Deep learning uses neural networks with multiple layers' }
    ];

    // Write sample files
    console.log('Creating sample files...');
    for (const file of files) {
      const filePath = path.join(tempDir, file.name);
      await fs.writeFile(filePath, file.content);
      console.log(`  ✓ ${file.name}`);
    }

    // Load files asynchronously (one at a time)
    console.log('\nLoading files asynchronously (sequential)...');
    for (const file of files) {
      const filePath = path.join(tempDir, file.name);
      await tfidf.addFile(filePath, 'utf8', { _filename: file.name });
      console.log(`  ✓ Loaded ${file.name}`);
    }

    console.log(`\nTotal documents loaded: ${tfidf.documentCount}\n`);

    // Search across loaded documents
    console.log('Search results for "learning":');
    const results = tfidf.search('learning', 10);
    results.forEach(({ index, score, metadata }) => {
      console.log(`  ${metadata._filename}: ${score.toFixed(4)}`);
    });

    // Parallel loading (all at once)
    console.log('\n\nLoading files in parallel...');
    const tfidf2 = new TfIdf();

    const loadPromises = files.map(file => {
      const filePath = path.join(tempDir, file.name);
      return tfidf2.addFile(filePath, 'utf8', { _filename: file.name });
    });

    await Promise.all(loadPromises);
    console.log(`✓ Loaded ${tfidf2.documentCount} files in parallel`);

    // Clean up
    console.log('\nCleaning up temp files...');
    for (const file of files) {
      await fs.unlink(path.join(tempDir, file.name));
    }
    await fs.rmdir(tempDir);
    console.log('✓ Cleanup complete');

  } catch (error) {
    console.error('Error:', error.message);
    // Clean up on error
    try {
      await fs.rmdir(tempDir, { recursive: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

main();
