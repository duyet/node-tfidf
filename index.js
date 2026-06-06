'use strict';

// Modern implementation (recommended)
const TfIdf = require('./lib/tfidf');

// Backward compatibility wrapper
class TfIdfLegacy extends TfIdf {
  /**
   * Legacy callback-based API (deprecated)
   * Use scoreAll() instead
   *
   * @deprecated
   */
  tfidfs(terms, callback) {
    const scores = this.scoreAll(terms);

    if (callback) {
      scores.forEach((score, index) => {
        const doc = this.toJSON().documents[index];
        callback(index, score, doc._key || doc.__key);
      });
    }

    return scores;
  }

  /**
   * Legacy method name (deprecated)
   * Use score() instead
   *
   * @deprecated
   */
  tfidf(terms, documentIndex) {
    return this.score(terms, documentIndex);
  }
}

// Export modern API by default, with legacy support
module.exports = TfIdfLegacy;
module.exports.TfIdf = TfIdf;
module.exports.TfIdfLegacy = TfIdfLegacy;

// Static method for backward compatibility
module.exports.tf = TfIdf.tf;