---
name: security-check
description: Comprehensive security audit and vulnerability assessment for entire projects including databases, authentication/authorization, APIs, environment variables, resource usage, and all codebases. Enforces OWASP security guidelines and industry best practices. Use when users request security review, penetration testing, vulnerability scanning, or security assessment.
license: Complete terms in LICENSE.txt
---

# Security Check Skill

This skill provides comprehensive security auditing capabilities covering the entire project stack from infrastructure to application code.

## When to Use

Use this skill when the user requests:
- Security audit or review
- Vulnerability assessment or scanning
- Penetration testing
- Security hardening
- OWASP compliance check
- Secret/credential leak detection
- Authentication/authorization review
- API security audit
- Database security assessment

## Security Audit Framework

### Phase 1: Reconnaissance & Scope Assessment

**Identify Project Components:**
- Frontend technologies and frameworks
- Backend languages, frameworks, and runtime
- Database systems (SQL, NoSQL, in-memory)
- APIs (REST, GraphQL, gRPC, internal, external)
- Authentication/authorization mechanisms
- Third-party dependencies and services
- Infrastructure (cloud providers, containers, serverless)
- Environment variables and configuration files
- File upload/download functionality
- Search/filter/input fields
- Session management approach

**Gather Security Context:**
- What data is being handled? (PII, financial, health, etc.)
- Compliance requirements? (GDPR, HIPAA, PCI-DSS, SOC2)
- User access levels and permissions
- External integrations and third-party APIs
- Deployment environment (production, staging, dev)

### Phase 2: Systematic Security Analysis

#### 1. Authentication & Authorization Security

**Login/Signup Process Review:**
- **Password Requirements**: Enforce minimum 8+ characters, complexity requirements
- **Password Storage**: NEVER store plain text, use bcrypt/scrypt/Argon2 with proper work factor (minimum cost 12 for bcrypt)
- **Password Reset**: Secure token-based reset with expiration (max 1-2 hours), unique tokens
- **Rate Limiting**: Implement rate limiting on login/signup (max 5-10 attempts per 15 minutes per IP/account)
- **Account Enumeration**: Ensure error messages don't reveal if email exists
- **Session Management**: Secure cookie flags (HttpOnly, Secure, SameSite=Strict), session timeout (15-30 min idle), secure session ID generation
- **Multi-Factor Authentication (MFA)**: Recommended for all sensitive operations
- **Brute Force Protection**: Implement account lockout after failed attempts, CAPTCHA after multiple failures

**Authorization Checks:**
- **Role-Based Access Control (RBAC)**: Proper role implementation
- **Permission Verification**: Check permissions on EVERY sensitive operation
- **Horizontal Privilege Escalation**: Ensure users can't access other users' data
- **Vertical Privilege Escalation**: Ensure regular users can't access admin functions
- **API Authorization**: Verify permissions on ALL API endpoints
- **Resource Ownership**: Validate user owns resource before modification

**CRITICAL FINDING**: Missing authorization checks on API endpoints allowing users to access/modify other users' data

#### 2. Input Validation & Sanitization

**CRITICAL RULE**: Sanitize ALL user inputs (forms, search, URLs, headers, cookies)

**Frontend Validation:**
- Input type validation (email, phone, date, numeric)
- Length restrictions on all fields
- Character whitelist/blacklist where appropriate
- Client-side validation for UX, NEVER for security

**Backend Validation (MUST IMPLEMENT):**
- Validate ALL inputs on server side (frontend validation can be bypassed)
- Type checking and conversion
- Length limits (enforce on backend)
- Character validation (whitelist preferred)
- Range validation for numeric inputs
- Business logic validation

**Sanitization Examples:**
```python
# SQL: Use parameterized queries - NEVER concatenate
cursor.execute("SELECT * FROM users WHERE email = %s", (user_input,))

# XSS: Escape output contextually
escaped = html.escape(user_input)

# Path traversal: Validate and normalize paths
safe_path = os.path.normpath(user_input).lstrip('/')

# Command injection: NEVER use user input in system commands
# Avoid: os.system(f"process {user_input}")
```

**CRITICAL FINDING**: SQL injection vulnerabilities from string concatenation in database queries

#### 3. Database Security

**Query Security:**
- **Parameterized Queries**: MUST use for ALL database queries
- **ORM Security**: Proper use of ORM query builders
- **ORM Injection Risks**: Be careful with raw SQL in ORM queries

**Data Access:**
- **Principle of Least Privilege**: Database user should have minimal required permissions
- **Connection Pooling**: Use secure connection pooling
- **Connection Strings**: Store in environment variables, NEVER in code
- **Encryption at Rest**: Enable encryption for sensitive data
- **Column Encryption**: Encrypt sensitive columns (SSN, credit cards, tokens)

**Query Optimization (Security Context):**
- **Denial of Service**: Prevent expensive queries that could overwhelm database
- **Query Timeout**: Set maximum query execution time
- **Result Limits**: Always LIMIT query results
- **N+1 Query Prevention**: Optimize to prevent performance DoS

**CRITICAL FINDING**: SQL injection vulnerability due to lack of parameterized queries

#### 4. API Security

**CRITICAL RULE**: Implement rate limiting on EVERY API endpoint

**Authentication:**
- **API Keys**: Secure generation, storage, and rotation
- **JWT Tokens**: Secure signature algorithm (RS256 preferred), proper expiration (15 min - 1 hour), proper validation
- **OAuth2**: Secure implementation with proper scope validation
- **Session Tokens**: Secure generation, expiration, revocation

**Rate Limiting:**
- **Default Limits**: 100-1000 requests per minute per user/IP
- **Endpoint-Specific Limits**: Stricter limits on expensive operations
- **Burst Protection**: Handle burst traffic gracefully
- **Rate Limit Headers**: Include rate limit info in response headers
- **Distributed Rate Limiting**: Use Redis or similar for multi-instance setups

**API Security Headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY or SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

**API Response Security:**
- **Error Messages**: Never expose stack traces, internal paths, or sensitive data
- **Data Leakage**: Ensure sensitive data never included in responses
- **Pagination**: Always paginate list endpoints (max 100-1000 items per page)
- **CORS**: Properly configure Cross-Origin Resource Sharing
- **Versioning**: Implement API versioning for security updates

**CRITICAL FINDING**: Missing rate limiting on API endpoints allowing brute force attacks or DoS

#### 5. Secrets Management & Environment Variables

**CRITICAL RULE**: Never hardcode API keys, passwords, or secrets - use environment variables

**Proper Secret Management:**
- **Environment Variables**: Store all secrets in environment variables
- **Secret Managers**: Use AWS Secrets Manager, Azure Key Vault, HashiCorp Vault
- **No Hardcoded Secrets**: NEVER commit secrets to code
- **No Secrets in Config Files**: Don't store secrets in .json, .yaml, .xml files
- **Secret Rotation**: Regular rotation of secrets (every 30-90 days)
- **Secret Scanning**: Use tools to scan for leaked secrets in code

**Git Security:**
- **.gitignore**: Ensure .env files are in .gitignore
- **Git History**: Remove secrets from git history if accidentally committed
- **Pre-commit Hooks**: Implement secret scanning in pre-commit hooks

**CRITICAL FINDING**: Hardcoded API keys or secrets in code committed to repository

#### 6. Cross-Site Scripting (XSS) Prevention

**XSS Attack Vectors:**
- **Stored XSS**: User input stored in database and displayed to others
- **Reflected XSS**: User input reflected in response without sanitization
- **DOM-based XSS**: Client-side JavaScript processes unsanitized input

**Prevention Strategies:**
- **Output Encoding**: Escape HTML, JavaScript, URL, CSS contextually
- **Content Security Policy (CSP)**: Implement strict CSP headers
- **Input Validation**: Validate all user input before processing
- **HttpOnly Cookies**: Prevent JavaScript access to session cookies
- **Framework Protection**: Use built-in XSS protection (React, Angular auto-escape)

**XSS Prevention Examples:**
```python
# Python: Use html.escape for HTML context
from html import escape
safe_html = escape(user_input)

# JavaScript: Use textContent instead of innerHTML
element.textContent = user_input  // Safe
element.innerHTML = user_input  // DANGEROUS

# CSP Header
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random'; style-src 'self' 'nonce-random'
```

**CRITICAL FINDING**: Reflected XSS vulnerability in search/input fields

#### 7. Cross-Site Request Forgery (CSRF) Prevention

**CSRF Attack Vectors:**
- State-changing operations without CSRF protection
- Cookies used for authentication without SameSite protection

**Prevention Strategies:**
- **CSRF Tokens**: Implement unique CSRF tokens for state-changing operations
- **SameSite Cookies**: Set SameSite=Strict or SameSite=Lax
- **Custom Headers**: Require X-Requested-With or similar header
- **Double Submit Cookie**: CSRF token in cookie and form field
- **Verify SameSite**: Validate SameSite attribute on all cookies

**CRITICAL FINDING**: Missing CSRF protection on state-changing operations

#### 8. File Upload Security

**File Upload Risks:**
- **Malicious File Upload**: Executables, scripts, or malicious files
- **File Type Bypass**: Renaming files to bypass type checks
- **Path Traversal**: Overwriting system files via file paths
- **File Size DoS**: Upload of extremely large files

**Secure File Upload Implementation:**
- **File Type Validation**: Validate by magic bytes, not extension
- **File Size Limits**: Maximum 5-10MB for regular uploads
- **Random Filename**: Generate random filenames, prevent overwrites
- **Storage Location**: Store outside web root or use cloud storage
- **Virus Scanning**: Scan uploaded files for malware
- **Content-Type Validation**: Validate actual MIME type
- **Execute Permissions**: Never execute uploaded files

**CRITICAL FINDING**: Insecure file upload allowing arbitrary file execution

#### 9. Session Security

**Session Management Best Practices:**
- **Secure Cookies**: HttpOnly, Secure, SameSite=Strict flags
- **Session ID Generation**: Use cryptographically secure random generator
- **Session Expiration**: Idle timeout (15-30 min), absolute timeout (8-24 hours)
- **Session Fixation**: Regenerate session ID after login
- **Session Revocation**: Implement logout functionality
- **Concurrent Sessions**: Limit number of concurrent sessions per user

**Session Cookie Configuration:**
```
Set-Cookie: session_id=xyz; 
  HttpOnly; 
  Secure; 
  SameSite=Strict; 
  Path=/; 
  Max-Age=1800
```

**CRITICAL FINDING**: Insecure session configuration allowing session hijacking

#### 10. Dependency Security

**Third-Party Dependencies:**
- **Vulnerability Scanning**: Regularly scan dependencies for known vulnerabilities
- **Version Pinning**: Pin dependency versions in lock files
- **Regular Updates**: Keep dependencies updated with security patches
- **Minimize Dependencies**: Remove unused dependencies
- **Vet Dependencies**: Review security reputation of packages

**Supply Chain Security:**
- **Signed Packages**: Verify package signatures when available
- **Package Registries**: Use official package registries only
- **Dependency Lock Files**: Use package-lock.json, yarn.lock, poetry.lock

**CRITICAL FINDING**: Outdated dependencies with known security vulnerabilities

#### 11. Error Handling & Logging Security

**Error Message Security:**
- **No Stack Traces**: Never expose stack traces to users
- **Generic Messages**: Use generic error messages for users
- **Detailed Logs**: Log detailed errors securely (not exposed to users)
- **No Path Exposure**: Don't reveal file paths or internal structure
- **No Database Errors**: Don't expose SQL errors or schema

**Logging Best Practices:**
- **Sensitive Data**: Never log passwords, tokens, credit cards, PII
- **Log Rotation**: Implement log rotation to prevent disk exhaustion
- **Log Access**: Restrict log file access to authorized personnel
- **Audit Logs**: Maintain audit logs for security-relevant events
- **Log Integrity**: Protect logs from tampering

**CRITICAL FINDING**: Stack traces exposed to users revealing internal structure

#### 12. Network Security

**Transport Security:**
- **HTTPS Only**: Enforce HTTPS for all endpoints
- **TLS Configuration**: Use modern TLS (1.2 or 1.3), disable weak ciphers
- **HSTS**: Implement HTTP Strict Transport Security header
- **Certificate Management**: Valid certificates, proper CA chain
- **Perfect Forward Secrecy**: Use PFS cipher suites

**Network Controls:**
- **Firewall Rules**: Restrict unnecessary ports and services
- **Network Segmentation**: Separate public and private networks
- **API Gateway**: Use API gateway for rate limiting, authentication
- **DDoS Protection**: Implement DDoS protection (Cloudflare, AWS Shield)

**CRITICAL FINDING**: Missing HTTPS or weak TLS configuration

#### 13. Resource Usage Security

**Denial of Service Prevention:**
- **Request Size Limits**: Maximum request body size (e.g., 1MB)
- **Response Size Limits**: Maximum response size to prevent memory exhaustion
- **Timeout Settings**: Appropriate timeouts for all external requests
- **Rate Limiting**: Per-user, per-IP rate limiting
- **Resource Quotas**: CPU, memory, disk quotas per user/container
- **Connection Limits**: Maximum concurrent connections per user

**Resource Monitoring:**
- **Memory Usage**: Monitor for memory leaks
- **CPU Usage**: Detect abnormal CPU consumption
- **Disk Usage**: Monitor disk space and I/O
- **Network Traffic**: Detect unusual traffic patterns
- **Alerting**: Set up alerts for abnormal resource usage

**CRITICAL FINDING**: No resource limits allowing DoS attacks

#### 14. Data Security & Privacy

**Data Encryption:**
- **Encryption at Rest**: Encrypt sensitive data in databases
- **Encryption in Transit**: TLS for all network communication
- **Key Management**: Secure key storage and rotation
- **Algorithm Selection**: Use modern, strong encryption (AES-256-GCM, ChaCha20-Poly1305)

**Data Privacy:**
- **Data Minimization**: Collect only necessary data
- **Data Retention**: Implement data retention policies
- **Right to Deletion**: Implement user data deletion
- **Data Anonymization**: Anonymize data for analytics
- **Consent Management**: Implement proper consent mechanisms

**CRITICAL FINDING**: Unencrypted sensitive data in database

### Phase 3: Vulnerability Detection (OWASP Top 10 + Additional)

**A01: Broken Access Control**
- Unauthorized access to administrative functions
- Viewing or modifying other users' data
- Metadata manipulation
- CORS misconfiguration
- Force browsing to unreferenced endpoints

**A02: Cryptographic Failures**
- Transmitting sensitive data in clear text
- Storing sensitive data unencrypted
- Weak encryption algorithms
- Missing or ineffective encryption

**A03: Injection**
- SQL injection
- NoSQL injection
- OS command injection
- LDAP injection
- XSS (HTML injection)
- Template injection

**A04: Insecure Design**
- Missing security controls
- Business logic errors
- Insecure workflows

**A05: Security Misconfiguration**
- Default accounts/credentials
- Unpatched vulnerabilities
- Unnecessary services/features enabled
- Misconfigured security headers
- Verbose error messages

**A06: Vulnerable and Outdated Components**
- Known vulnerabilities in dependencies
- Unsupported software
- Unpatched systems

**A07: Identification and Authentication Failures**
- Credential stuffing
- Weak password policies
- Brute force attacks
- Session fixation
- Session hijacking

**A08: Software and Data Integrity Failures**
- Code signing verification missing
- Unsigned or self-signed certificates
- Unverified software updates

**A09: Security Logging and Monitoring Failures**
- Insufficient logging
- No monitoring
- Log tampering
- Missing alerts

**A10: Server-Side Request Forgery (SSRF)**
- Fetching arbitrary URLs
- Bypassing firewalls
- Accessing internal services

**Additional Critical Vulnerabilities:**
- XXE (XML External Entity) attacks
- Race conditions
- Time-based attacks
- Side-channel attacks
- Insecure direct object references (IDOR)

### Phase 4: Best Practices Enforcement

**MUST IMPLEMENT (Critical):**

1. **OWASP Security Guidelines Compliance**
   - Sanitize ALL user inputs (forms, search, URLs, headers, cookies)
   - Implement rate limiting on EVERY API endpoint
   - Never hardcode API keys - use environment variables or secret managers
   - Use parameterized queries to prevent SQL injection
   - Validate inputs on BOTH frontend (UX) and backend (security)

2. **Authentication & Authorization**
   - Minimum 8-character passwords with complexity requirements
   - Store passwords using bcrypt/scrypt/Argon2 (cost factor 12+)
   - Implement rate limiting on login (5 attempts per 15 min)
   - Secure session cookies: HttpOnly, Secure, SameSite=Strict
   - Session timeout: 15-30 minutes idle
   - Verify permissions on EVERY sensitive operation

3. **API Security**
   - Rate limit ALL endpoints (100-1000 req/min default)
   - Implement proper authentication (JWT with proper validation)
   - Security headers on all responses
   - Never expose stack traces in error responses
   - Implement CORS properly
   - Use HTTPS exclusively

4. **Data Protection**
   - Encrypt data at rest for sensitive information
   - Encrypt data in transit (TLS 1.2+)
   - Never log passwords, tokens, or credit cards
   - Implement data retention and deletion policies
   - Use principle of least privilege for database access

5. **Code Security**
   - Never use eval() or similar dynamic code execution
   - Validate all user input on server side
   - Use framework security features (React auto-escape, etc.)
   - Implement Content Security Policy (CSP)
   - Regular dependency updates and vulnerability scanning

6. **Infrastructure Security**
   - Use environment variables for all secrets
   - Enable HSTS headers
   - Implement firewall rules
   - Regular security updates for OS and dependencies
   - Enable security monitoring and alerting

### Phase 5: Security Report Structure

**Executive Summary**
- Overall security posture (Critical/High/Medium/Low risk)
- Critical vulnerability count
- Compliance status (OWASP, regulatory requirements)
- Immediate action required (yes/no)

**Critical Vulnerabilities (Fix Immediately)**
For each critical vulnerability:
- **Location**: file:line or endpoint
- **Severity**: Critical/High
- **OWASP Category**: (e.g., A03: Injection)
- **CVSS Score**: (if applicable)
- **Description**: Clear explanation of vulnerability
- **Attack Scenario**: How attacker could exploit
- **Impact**: Business impact and data exposure
- **Remediation**: Step-by-step fix with code example
- **Verification**: How to test the fix

**High Severity Issues (Fix Within 1-2 Weeks)**
Same format as critical vulnerabilities

**Medium Severity Issues (Fix Within 1 Month)**
Same format

**Low Severity Issues (Fix in Next Cycle)**
Same format

**Security Best Practices Compliance**
- OWASP Top 10 compliance checklist
- Authentication security checklist
- API security checklist
- Data protection checklist
- Infrastructure security checklist

**Positive Security Measures**
- Security controls properly implemented
- Good security practices observed

**Recommendations & Action Plan**
- Prioritized remediation plan
- Long-term security improvements
- Security tooling recommendations
- Training recommendations
- Ongoing monitoring suggestions

**Appendix: Security Tools & Commands**
- Dependency vulnerability scanning commands
- Secret scanning commands
- Security testing frameworks
- OWASP resources

### Phase 6: Verification & Testing

**Automated Security Testing:**
```bash
# Dependency vulnerability scanning
npm audit  # JavaScript
pip-audit  # Python
snyk test  # Multi-language

# Secret scanning
git secrets --scan
gitleaks detect

# Static analysis
bandit -r .  # Python
semgrep --config=security  # Multi-language
sonarqube

# OWASP ZAP
zap-cli quick-scan --self-contained http://localhost:3000

# Docker security
docker scan myimage
trivy image myimage
```

**Manual Security Testing:**
- Penetration testing checklist
- Burp Suite or OWASP ZAP for web applications
- SQL injection testing
- XSS testing
- CSRF testing
- Authentication testing

### Tools & Resources

**Security Scanning Tools:**
- **OWASP ZAP**: Web application security scanner
- **Burp Suite**: Web security testing
- **Snyk**: Dependency vulnerability scanner
- **SonarQube**: Code quality and security
- **Semgrep**: Static analysis with security rules
- **Bandit**: Python security linter
- **ESLint with security plugins**: JavaScript security
- **Trivy**: Container and file system scanner
- **Gitleaks**: Secret scanner for git
- **Git Secrets**: Git secret scanning

**OWASP Resources:**
- OWASP Top 10: https://owasp.org/Top10/
- OWASP Testing Guide: https://owasp.org/www-project-web-security-testing-guide/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/

**Security Frameworks:**
- OWASP ASVS (Application Security Verification Standard)
- NIST Cybersecurity Framework
- CIS Benchmarks
- PCI-DSS Requirements

## Quick Reference Checklist

**Before Deployment, Verify:**
- [ ] No hardcoded secrets in code
- [ ] All APIs have rate limiting
- [ ] All database queries use parameterized queries
- [ ] All user inputs are validated on backend
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] No stack traces exposed
- [ ] Dependencies up to date
- [ ] Error messages generic
- [ ] Sessions are secure (HttpOnly, Secure, SameSite)
- [ ] File uploads validated and restricted
- [ ] CORS properly configured
- [ ] CSP headers implemented
- [ ] Authentication/authorization on all endpoints
- [ ] Logging doesn't expose sensitive data
- [ ] Regular security scans configured
