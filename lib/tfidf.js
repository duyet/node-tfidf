/**
 * TF-IDF (Term Frequency-Inverse Document Frequency)
 * Modern, zero-dependency implementation
 *
 * @author Van-Duyet Le
 * @license MIT
 */

'use strict';

/**
 * Default tokenizer - simple whitespace and punctuation splitting
 * Can be replaced with language-specific tokenizers
 */
class DefaultTokenizer {
  tokenize(text) {
    if (typeof text !== 'string') {
      throw new TypeError(`Expected string, got ${typeof text}`);
    }
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
}

/**
 * TF-IDF Calculator
 *
 * @example
 * const tfidf = new TfIdf();
 * tfidf.addDocument('This is a sample document');
 * tfidf.addDocument('This is another document');
 *
 * const score = tfidf.score('sample', 0);
 * const allScores = tfidf.scoreAll('sample');
 * const topTerms = tfidf.topTerms(0, 10);
 */
class TfIdf {
  #documents = [];
  #idfCache = new Map();
  #tokenizer = new DefaultTokenizer();
  #stopwords = new Set();

  /**
   * Create a new TF-IDF calculator
   * @param {Object} options - Configuration options
   * @param {Object} options.tokenizer - Custom tokenizer (must have tokenize method)
   * @param {Array<string>} options.stopwords - Words to ignore
   * @param {Array<Object>} options.documents - Pre-existing documents to restore
   */
  constructor(options = {}) {
    if (options.tokenizer) {
      this.setTokenizer(options.tokenizer);
    }

    if (options.stopwords) {
      this.setStopwords(options.stopwords);
    }

    if (options.documents) {
      if (!Array.isArray(options.documents)) {
        throw new TypeError('documents must be an array');
      }
      this.#documents = options.documents;
    }
  }

  /**
   * Build a term frequency map from text or token array
   * @private
   */
  #buildDocument(input, metadata = {}) {
    let tokens;

    if (typeof input === 'string') {
      tokens = this.#tokenizer.tokenize(input);
    } else if (Array.isArray(input)) {
      tokens = input;
    } else {
      throw new TypeError('Document must be a string or array of tokens');
    }

    const termFrequencies = { ...metadata };

    for (const token of tokens) {
      // Skip stopwords
      if (this.#stopwords.has(token)) {
        continue;
      }

      // Avoid prototype pollution
      if (!Object.prototype.hasOwnProperty.call(termFrequencies, token)) {
        termFrequencies[token] = 0;
      }

      termFrequencies[token]++;
    }

    return termFrequencies;
  }

  /**
   * Get term frequency for a term in a document
   * @private
   */
  #tf(term, document) {
    return document[term] || 0;
  }

  /**
   * Check if document contains term
   * @private
   */
  #documentHasTerm(term, document) {
    return document[term] > 0;
  }

  /**
   * Invalidate IDF cache
   * @private
   */
  #invalidateCache() {
    this.#idfCache.clear();
  }

  /**
   * Calculate Inverse Document Frequency for a term
   * Uses smooth IDF: idf = 1 + log(N / (1 + df))
   *
   * @param {string} term - The term to calculate IDF for
   * @param {boolean} force - Force recalculation (bypass cache)
   * @returns {number} The IDF score
   */
  idf(term, force = false) {
    if (!force && this.#idfCache.has(term)) {
      return this.#idfCache.get(term);
    }

    const docsWithTerm = this.#documents.reduce((count, doc) => {
      return count + (this.#documentHasTerm(term, doc) ? 1 : 0);
    }, 0);

    // Smooth IDF formula prevents negative values and division by zero
    const idf = 1 + Math.log(this.#documents.length / (1 + docsWithTerm));

    this.#idfCache.set(term, idf);
    return idf;
  }

  /**
   * Add a document to the corpus
   *
   * @param {string|Array<string>} document - Document text or pre-tokenized array
   * @param {Object} metadata - Optional metadata (e.g., { id: 'doc1', title: '...' })
   * @returns {TfIdf} this (for method chaining)
   */
  addDocument(document, metadata = {}) {
    const doc = this.#buildDocument(document, metadata);
    this.#documents.push(doc);
    this.#invalidateCache();
    return this;
  }

  /**
   * Add a document from a file (synchronous)
   *
   * @param {string} path - File path
   * @param {string} encoding - File encoding (default: 'utf8')
   * @param {Object} metadata - Optional metadata
   * @returns {TfIdf} this (for method chaining)
   */
  addFileSync(path, encoding = 'utf8', metadata = {}) {
    const fs = require('fs');

    // Validate encoding
    const validEncodings = ['utf8', 'utf-8', 'ascii', 'binary', 'base64', 'hex', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'];
    if (!validEncodings.includes(encoding.toLowerCase())) {
      throw new Error(`Invalid encoding: ${encoding}`);
    }

    const content = fs.readFileSync(path, encoding);
    return this.addDocument(content, { ...metadata, _filePath: path });
  }

  /**
   * Add a document from a file (asynchronous)
   *
   * @param {string} path - File path
   * @param {string} encoding - File encoding (default: 'utf8')
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<TfIdf>} Promise resolving to this (for method chaining)
   */
  async addFile(path, encoding = 'utf8', metadata = {}) {
    const fs = require('fs').promises;

    // Validate encoding
    const validEncodings = ['utf8', 'utf-8', 'ascii', 'binary', 'base64', 'hex', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'];
    if (!validEncodings.includes(encoding.toLowerCase())) {
      throw new Error(`Invalid encoding: ${encoding}`);
    }

    const content = await fs.readFile(path, encoding);
    return this.addDocument(content, { ...metadata, _filePath: path });
  }

  /**
   * Add multiple documents at once (batch operation)
   *
   * @param {Array<string|Array<string>>} documents - Array of documents
   * @param {Array<Object>} metadataArray - Optional array of metadata objects
   * @returns {TfIdf} this (for method chaining)
   */
  addDocuments(documents, metadataArray = []) {
    if (!Array.isArray(documents)) {
      throw new TypeError('documents must be an array');
    }

    documents.forEach((doc, index) => {
      const metadata = metadataArray[index] || {};
      this.#documents.push(this.#buildDocument(doc, metadata));
    });

    this.#invalidateCache();
    return this;
  }

  /**
   * Remove a document from the corpus
   *
   * @param {number} documentIndex - Index of the document to remove
   * @returns {TfIdf} this (for method chaining)
   */
  removeDocument(documentIndex) {
    if (documentIndex < 0 || documentIndex >= this.#documents.length) {
      throw new RangeError(`Document index ${documentIndex} out of range [0, ${this.#documents.length - 1}]`);
    }

    this.#documents.splice(documentIndex, 1);
    this.#invalidateCache();
    return this;
  }

  /**
   * Update a document in the corpus
   *
   * @param {number} documentIndex - Index of the document to update
   * @param {string|Array<string>} document - New document content
   * @param {Object} metadata - Optional metadata (merged with existing)
   * @returns {TfIdf} this (for method chaining)
   */
  updateDocument(documentIndex, document, metadata = {}) {
    if (documentIndex < 0 || documentIndex >= this.#documents.length) {
      throw new RangeError(`Document index ${documentIndex} out of range [0, ${this.#documents.length - 1}]`);
    }

    const oldMetadata = this.#documents[documentIndex];
    const mergedMetadata = { ...oldMetadata, ...metadata };

    // Preserve only metadata fields (those starting with _)
    const preservedMetadata = {};
    for (const key in mergedMetadata) {
      if (key.startsWith('_')) {
        preservedMetadata[key] = mergedMetadata[key];
      }
    }

    this.#documents[documentIndex] = this.#buildDocument(document, preservedMetadata);
    this.#invalidateCache();
    return this;
  }

  /**
   * Calculate TF-IDF score for a term in a specific document
   *
   * @param {string|Array<string>} terms - Term(s) to score
   * @param {number} documentIndex - Index of the document
   * @returns {number} TF-IDF score
   */
  score(terms, documentIndex) {
    if (documentIndex < 0 || documentIndex >= this.#documents.length) {
      throw new RangeError(`Document index ${documentIndex} out of range [0, ${this.#documents.length - 1}]`);
    }

    const tokens = Array.isArray(terms)
      ? terms
      : this.#tokenizer.tokenize(terms.toString());

    return tokens.reduce((score, term) => {
      const tf = this.#tf(term, this.#documents[documentIndex]);
      const idf = this.idf(term);

      // Handle edge case where term appears in no documents
      const termScore = idf === Infinity ? 0 : tf * idf;

      return score + termScore;
    }, 0);
  }

  /**
   * Calculate TF-IDF scores for a term across all documents
   *
   * @param {string|Array<string>} terms - Term(s) to score
   * @returns {Array<number>} Array of TF-IDF scores for each document
   */
  scoreAll(terms) {
    return this.#documents.map((_, index) => this.score(terms, index));
  }

  /**
   * Get top N terms for a document, sorted by TF-IDF score
   *
   * @param {number} documentIndex - Index of the document
   * @param {number} limit - Number of top terms to return (default: 10)
   * @returns {Array<{term: string, score: number}>} Sorted array of term-score pairs
   */
  topTerms(documentIndex, limit = 10) {
    if (documentIndex < 0 || documentIndex >= this.#documents.length) {
      throw new RangeError(`Document index ${documentIndex} out of range [0, ${this.#documents.length - 1}]`);
    }

    const document = this.#documents[documentIndex];
    const terms = [];

    for (const term in document) {
      // Skip metadata fields (those starting with _)
      if (term.startsWith('_') || !Object.prototype.hasOwnProperty.call(document, term)) {
        continue;
      }

      terms.push({
        term,
        score: this.score(term, documentIndex)
      });
    }

    return terms
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get all terms for a document (alias for topTerms without limit)
   *
   * @param {number} documentIndex - Index of the document
   * @returns {Array<{term: string, score: number}>} Sorted array of all term-score pairs
   */
  listTerms(documentIndex) {
    return this.topTerms(documentIndex, Infinity);
  }

  /**
   * Set a custom tokenizer
   *
   * @param {Object} tokenizer - Tokenizer with tokenize(text) method
   * @returns {TfIdf} this (for method chaining)
   */
  setTokenizer(tokenizer) {
    if (!tokenizer || typeof tokenizer.tokenize !== 'function') {
      throw new TypeError('Tokenizer must have a tokenize() method');
    }
    this.#tokenizer = tokenizer;
    return this;
  }

  /**
   * Set stopwords (words to ignore)
   *
   * @param {Array<string>} words - Array of stopwords
   * @returns {TfIdf} this (for method chaining)
   */
  setStopwords(words) {
    if (!Array.isArray(words)) {
      throw new TypeError('Stopwords must be an array');
    }
    this.#stopwords = new Set(words.map(w => w.toLowerCase()));
    return this;
  }

  /**
   * Add stopwords to the existing set
   *
   * @param {Array<string>} words - Array of stopwords to add
   * @returns {TfIdf} this (for method chaining)
   */
  addStopwords(words) {
    if (!Array.isArray(words)) {
      throw new TypeError('Stopwords must be an array');
    }
    words.forEach(w => this.#stopwords.add(w.toLowerCase()));
    return this;
  }

  /**
   * Calculate cosine similarity between two documents
   * Returns value between 0 (completely different) and 1 (identical)
   *
   * @param {number} docIndex1 - First document index
   * @param {number} docIndex2 - Second document index
   * @returns {number} Cosine similarity score (0-1)
   */
  similarity(docIndex1, docIndex2) {
    if (docIndex1 < 0 || docIndex1 >= this.#documents.length) {
      throw new RangeError(`Document index ${docIndex1} out of range [0, ${this.#documents.length - 1}]`);
    }
    if (docIndex2 < 0 || docIndex2 >= this.#documents.length) {
      throw new RangeError(`Document index ${docIndex2} out of range [0, ${this.#documents.length - 1}]`);
    }

    const doc1 = this.#documents[docIndex1];
    const doc2 = this.#documents[docIndex2];

    // Get all unique terms from both documents
    const allTerms = new Set();
    for (const term in doc1) {
      if (!term.startsWith('_')) allTerms.add(term);
    }
    for (const term in doc2) {
      if (!term.startsWith('_')) allTerms.add(term);
    }

    // Calculate TF-IDF vectors
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const term of allTerms) {
      const tfidf1 = this.#tf(term, doc1) * this.idf(term);
      const tfidf2 = this.#tf(term, doc2) * this.idf(term);

      dotProduct += tfidf1 * tfidf2;
      magnitude1 += tfidf1 * tfidf1;
      magnitude2 += tfidf2 * tfidf2;
    }

    // Avoid division by zero
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  /**
   * Find most similar documents to a given document
   *
   * @param {number} documentIndex - Reference document index
   * @param {number} limit - Number of similar documents to return (default: 5)
   * @returns {Array<{index: number, similarity: number, metadata: Object}>} Similar documents sorted by similarity
   */
  findSimilar(documentIndex, limit = 5) {
    if (documentIndex < 0 || documentIndex >= this.#documents.length) {
      throw new RangeError(`Document index ${documentIndex} out of range [0, ${this.#documents.length - 1}]`);
    }

    const similarities = [];

    for (let i = 0; i < this.#documents.length; i++) {
      if (i === documentIndex) continue; // Skip self

      const sim = this.similarity(documentIndex, i);
      const metadata = {};

      // Extract metadata from document
      for (const key in this.#documents[i]) {
        if (key.startsWith('_')) {
          metadata[key] = this.#documents[i][key];
        }
      }

      similarities.push({
        index: i,
        similarity: sim,
        metadata
      });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Search for documents matching a query, ranked by relevance
   *
   * @param {string|Array<string>} query - Search query (text or tokens)
   * @param {number} limit - Maximum results to return (default: 10)
   * @param {number} threshold - Minimum score threshold (default: 0)
   * @returns {Array<{index: number, score: number, metadata: Object}>} Ranked search results
   */
  search(query, limit = 10, threshold = 0) {
    const results = [];

    for (let i = 0; i < this.#documents.length; i++) {
      const score = this.score(query, i);

      if (score > threshold) {
        const metadata = {};

        // Extract metadata from document
        for (const key in this.#documents[i]) {
          if (key.startsWith('_')) {
            metadata[key] = this.#documents[i][key];
          }
        }

        results.push({
          index: i,
          score,
          metadata
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get document metadata
   *
   * @param {number} documentIndex - Document index
   * @returns {Object} Document metadata
   */
  getMetadata(documentIndex) {
    if (documentIndex < 0 || documentIndex >= this.#documents.length) {
      throw new RangeError(`Document index ${documentIndex} out of range [0, ${this.#documents.length - 1}]`);
    }

    const metadata = {};
    const doc = this.#documents[documentIndex];

    for (const key in doc) {
      if (key.startsWith('_')) {
        metadata[key] = doc[key];
      }
    }

    return metadata;
  }

  /**
   * Find document index by metadata field
   *
   * @param {string} field - Metadata field name (should start with _)
   * @param {*} value - Value to search for
   * @returns {number} Document index, or -1 if not found
   */
  findByMetadata(field, value) {
    if (!field.startsWith('_')) {
      field = '_' + field;
    }

    return this.#documents.findIndex(doc => doc[field] === value);
  }

  /**
   * Get all unique terms in the corpus
   *
   * @returns {Array<string>} Array of unique terms
   */
  getVocabulary() {
    const vocab = new Set();

    for (const doc of this.#documents) {
      for (const term in doc) {
        if (!term.startsWith('_') && Object.prototype.hasOwnProperty.call(doc, term)) {
          vocab.add(term);
        }
      }
    }

    return Array.from(vocab).sort();
  }

  /**
   * Get corpus statistics
   *
   * @returns {Object} Statistics about the corpus
   */
  getStats() {
    const vocab = this.getVocabulary();
    let totalTerms = 0;
    let totalUniqueTerms = 0;

    for (const doc of this.#documents) {
      let docTerms = 0;
      for (const term in doc) {
        if (!term.startsWith('_')) {
          docTerms += doc[term];
        }
      }
      totalTerms += docTerms;
    }

    return {
      documentCount: this.#documents.length,
      vocabularySize: vocab.length,
      totalTerms,
      averageDocumentLength: totalTerms / this.#documents.length || 0
    };
  }

  /**
   * Get number of documents in corpus
   *
   * @returns {number} Document count
   */
  get documentCount() {
    return this.#documents.length;
  }

  /**
   * Export documents for serialization
   *
   * @returns {Array<Object>} Documents array
   */
  toJSON() {
    return {
      documents: this.#documents
    };
  }

  /**
   * Calculate raw term frequency (static helper)
   *
   * @param {string} term - The term
   * @param {Object} document - The term frequency map
   * @returns {number} Term frequency
   */
  static tf(term, document) {
    return document[term] || 0;
  }
}

// Backward compatibility - support both ES6 and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TfIdf;
  module.exports.TfIdf = TfIdf;
  module.exports.DefaultTokenizer = DefaultTokenizer;
}

// ES6 export
if (typeof exports !== 'undefined') {
  exports.TfIdf = TfIdf;
  exports.DefaultTokenizer = DefaultTokenizer;
}
