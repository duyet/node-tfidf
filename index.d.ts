/**
 * Type definitions for node-tfidf
 * Modern TF-IDF implementation for Node.js
 */

declare module 'node-tfidf' {
  /**
   * Tokenizer interface - must implement tokenize method
   */
  export interface Tokenizer {
    /**
     * Tokenize text into array of tokens
     * @param text - Input text to tokenize
     * @returns Array of tokens
     */
    tokenize(text: string): string[];
  }

  /**
   * Term-score pair returned by topTerms and listTerms
   */
  export interface TermScore {
    /** The term */
    term: string;
    /** TF-IDF score for the term */
    score: number;
  }

  /**
   * Document metadata - can include any custom fields
   */
  export interface DocumentMetadata {
    [key: string]: any;
  }

  /**
   * Options for TfIdf constructor
   */
  export interface TfIdfOptions {
    /** Custom tokenizer (must have tokenize method) */
    tokenizer?: Tokenizer;
    /** Array of stopwords to ignore */
    stopwords?: string[];
    /** Pre-existing documents to restore */
    documents?: any[];
  }

  /**
   * Serialized TfIdf data
   */
  export interface TfIdfJSON {
    documents: any[];
  }

  /**
   * Default tokenizer - splits on whitespace and punctuation
   */
  export class DefaultTokenizer implements Tokenizer {
    /**
     * Tokenize text by splitting on whitespace and removing punctuation
     * @param text - Text to tokenize
     * @returns Array of lowercase tokens
     */
    tokenize(text: string): string[];
  }

  /**
   * TF-IDF (Term Frequency-Inverse Document Frequency) calculator
   *
   * @example
   * ```typescript
   * const tfidf = new TfIdf();
   *
   * tfidf
   *   .addDocument('This is a sample document')
   *   .addDocument('This is another document');
   *
   * const score = tfidf.score('sample', 0);
   * const allScores = tfidf.scoreAll('sample');
   * const topTerms = tfidf.topTerms(0, 10);
   * ```
   */
  export class TfIdf {
    /**
     * Create a new TF-IDF calculator
     * @param options - Configuration options
     */
    constructor(options?: TfIdfOptions);

    /**
     * Add a document to the corpus
     *
     * @param document - Document text or pre-tokenized array
     * @param metadata - Optional metadata (e.g., { id: 'doc1', title: '...' })
     * @returns this (for method chaining)
     */
    addDocument(
      document: string | string[],
      metadata?: DocumentMetadata
    ): this;

    /**
     * Add a document from a file (synchronous)
     *
     * @param path - File path
     * @param encoding - File encoding (default: 'utf8')
     * @param metadata - Optional metadata
     * @returns this (for method chaining)
     */
    addFileSync(
      path: string,
      encoding?: BufferEncoding,
      metadata?: DocumentMetadata
    ): this;

    /**
     * Calculate Inverse Document Frequency for a term
     * Uses smooth IDF: idf = 1 + log(N / (1 + df))
     *
     * @param term - The term to calculate IDF for
     * @param force - Force recalculation (bypass cache)
     * @returns The IDF score
     */
    idf(term: string, force?: boolean): number;

    /**
     * Calculate TF-IDF score for a term in a specific document
     *
     * @param terms - Term(s) to score
     * @param documentIndex - Index of the document
     * @returns TF-IDF score
     * @throws {RangeError} If document index is out of range
     */
    score(terms: string | string[], documentIndex: number): number;

    /**
     * Calculate TF-IDF scores for a term across all documents
     *
     * @param terms - Term(s) to score
     * @returns Array of TF-IDF scores for each document
     */
    scoreAll(terms: string | string[]): number[];

    /**
     * Get top N terms for a document, sorted by TF-IDF score
     *
     * @param documentIndex - Index of the document
     * @param limit - Number of top terms to return (default: 10)
     * @returns Sorted array of term-score pairs
     * @throws {RangeError} If document index is out of range
     */
    topTerms(documentIndex: number, limit?: number): TermScore[];

    /**
     * Get all terms for a document (alias for topTerms without limit)
     *
     * @param documentIndex - Index of the document
     * @returns Sorted array of all term-score pairs
     * @throws {RangeError} If document index is out of range
     */
    listTerms(documentIndex: number): TermScore[];

    /**
     * Set a custom tokenizer
     *
     * @param tokenizer - Tokenizer with tokenize(text) method
     * @returns this (for method chaining)
     * @throws {TypeError} If tokenizer doesn't have tokenize method
     */
    setTokenizer(tokenizer: Tokenizer): this;

    /**
     * Set stopwords (words to ignore)
     *
     * @param words - Array of stopwords
     * @returns this (for method chaining)
     * @throws {TypeError} If words is not an array
     */
    setStopwords(words: string[]): this;

    /**
     * Add stopwords to the existing set
     *
     * @param words - Array of stopwords to add
     * @returns this (for method chaining)
     * @throws {TypeError} If words is not an array
     */
    addStopwords(words: string[]): this;

    /**
     * Get number of documents in corpus
     */
    readonly documentCount: number;

    /**
     * Export documents for serialization
     *
     * @returns Serialized documents
     */
    toJSON(): TfIdfJSON;

    /**
     * Calculate raw term frequency (static helper)
     *
     * @param term - The term
     * @param document - The term frequency map
     * @returns Term frequency
     */
    static tf(term: string, document: any): number;

    // Legacy API (deprecated)

    /**
     * @deprecated Use score() instead
     */
    tfidf(terms: string | string[], documentIndex: number): number;

    /**
     * @deprecated Use scoreAll() instead
     */
    tfidfs(
      terms: string | string[],
      callback?: (index: number, score: number, key?: any) => void
    ): number[];
  }

  /**
   * Legacy TfIdf class with backward compatibility methods
   * This is the default export for backward compatibility
   */
  export class TfIdfLegacy extends TfIdf {}

  // Default export
  const _default: typeof TfIdfLegacy;
  export default _default;
}
