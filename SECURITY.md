# Security Policy

## Supported Versions

We take security seriously. The following versions are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Security Features

### Zero Dependencies
This library has **zero dependencies**, eliminating an entire class of supply chain attacks. No third-party code means:
- No transitive dependency vulnerabilities
- No malicious package injection
- Complete code auditability

### Modern JavaScript Security
- **No `eval()` or `Function()` constructors** - prevents code injection
- **No prototype pollution** - uses `Map` and proper property checks
- **Proper input validation** - strict type checking on all inputs
- **Private fields** - true encapsulation with `#` syntax

### Safe Defaults
- File operations validate encoding
- Document indices are bounds-checked
- Tokenization handles Unicode safely
- No global state mutation

## Reporting a Vulnerability

We appreciate responsible disclosure of security issues.

### How to Report

**Please DO NOT create public GitHub issues for security vulnerabilities.**

Instead, email security concerns to:
- **Email**: [duyet@users.noreply.github.com](mailto:duyet@users.noreply.github.com)
- **Subject**: `[SECURITY] node-tfidf vulnerability report`

### What to Include

Please provide:
1. **Description** - Clear explanation of the vulnerability
2. **Impact** - What can an attacker achieve?
3. **Reproduction** - Step-by-step PoC if possible
4. **Affected versions** - Which versions are vulnerable?
5. **Suggested fix** - If you have ideas (optional)

### What to Expect

- **Acknowledgment** - Within 48 hours
- **Initial assessment** - Within 1 week
- **Fix timeline** - Depends on severity:
  - Critical: 1-7 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Disclosure Policy

- We'll work with you to understand and fix the issue
- We'll credit you in the changelog (unless you prefer anonymity)
- We'll publish a security advisory after the fix is released
- We ask for 90 days before public disclosure

## Security Best Practices

When using `node-tfidf`:

### Input Validation
```javascript
// Always validate external input
const userInput = req.body.text;
if (typeof userInput !== 'string' || userInput.length > 1_000_000) {
  throw new Error('Invalid input');
}

tfidf.addDocument(userInput);
```

### Resource Limits
```javascript
// Limit corpus size for public-facing applications
if (tfidf.documentCount >= MAX_DOCUMENTS) {
  throw new Error('Corpus size limit reached');
}
```

### File Operations
```javascript
// Validate file paths to prevent directory traversal
const path = require('path');
const safePath = path.resolve(ALLOWED_DIR, userProvidedPath);
if (!safePath.startsWith(ALLOWED_DIR)) {
  throw new Error('Path traversal attempt');
}

tfidf.addFileSync(safePath);
```

### Memory Management
```javascript
// For large corpora, consider pagination
const MAX_CORPUS_SIZE = 10_000;
if (documents.length > MAX_CORPUS_SIZE) {
  // Implement chunking or sampling
}
```

## Known Security Considerations

### Not for Untrusted Code Execution
This library is designed for text analysis, not sandboxed code execution. Do not use it to process or execute untrusted code.

### DoS via Large Documents
Extremely large documents (>100MB) may cause memory issues. Implement size limits in production.

### Metadata Injection
Document metadata is stored as-is. Sanitize metadata if it will be displayed in web contexts to prevent XSS.

## Audit History

- **v0.1.0** (2025) - Complete rewrite, eliminated all dependencies
- **v0.0.x** (2015) - Had 2 vulnerabilities via dependencies (now removed)

## Security Checklist for Contributors

Before submitting code:

- [ ] No use of `eval()`, `Function()`, or `vm` module
- [ ] Input validation on all public methods
- [ ] No introduction of dependencies
- [ ] Proper error handling (no silent failures)
- [ ] Bounds checking on array access
- [ ] No global state mutation
- [ ] Tests cover security edge cases

## Credits

We thank the security research community for helping keep this project secure.

**Hall of Fame**: (Security researchers who responsibly disclosed issues)
- *No reports yet*

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://www.npmjs.com/advisories)
