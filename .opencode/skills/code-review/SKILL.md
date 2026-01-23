---
name: code-review
description: Comprehensive code review and analysis including bug detection, security vulnerabilities, performance optimization, best practices, and architectural improvements. Use this when users ask to review, analyze, audit, or critique code for quality, correctness, efficiency, or maintainability issues.
license: Complete terms in LICENSE.txt
---

# Code Review Skill

This skill provides comprehensive code review capabilities covering security, performance, best practices, maintainability, and architectural quality.

## When to Use

Use this skill when the user requests:
- Code review or audit
- Bug finding and analysis
- Security vulnerability assessment
- Performance optimization
- Code quality assessment
- Refactoring recommendations
- Best practices evaluation
- Architectural review
- Maintainability analysis

## Review Process

### 1. Initial Assessment

**Understand the Context:**
- What language/framework is being used?
- What is the code's purpose and functionality?
- Are there any specific concerns or areas of focus?
- What are the performance/security requirements?
- Who will maintain this code?

**Scan for Critical Issues:**
- Security vulnerabilities (SQL injection, XSS, auth bypass)
- Race conditions and concurrency issues
- Memory leaks or resource leaks
- Logic errors that could cause crashes or data corruption
- API misuse or contract violations

### 2. Systematic Review

#### Security Review

**Common Vulnerabilities:**
- **Input validation**: Unsanitized user input, missing validation
- **Injection attacks**: SQL injection, command injection, LDAP injection
- **XSS**: Cross-site scripting vulnerabilities
- **Authentication/Authorization**: Weak auth checks, privilege escalation
- **Cryptography**: Weak algorithms, hardcoded secrets, insecure random
- **Data exposure**: Sensitive data in logs, error messages, or storage
- **Injection flaws**: Using eval(), exec(), or similar dangerous functions
- **Path traversal**: Unvalidated file paths
- **Deserialization**: Unsafe object deserialization
- **Session management**: Insecure session handling

**Security Best Practices:**
- Use parameterized queries for database access
- Validate and sanitize all user input
- Implement proper error handling without exposing sensitive information
- Use HTTPS/TLS for all network communications
- Follow principle of least privilege
- Keep dependencies updated and patched
- Use secure coding frameworks and libraries

#### Performance Review

**Identify Performance Issues:**
- **Inefficient algorithms**: O(n²) where O(n log n) exists, nested loops unnecessarily
- **Memory usage**: Unnecessary copies, memory leaks, large object allocations
- **I/O operations**: Blocking I/O, excessive network/database calls
- **Caching**: Missing caching where appropriate, cache invalidation issues
- **Database**: N+1 queries, missing indexes, inefficient joins
- **Concurrency**: Thread contention, deadlock risks, blocking operations
- **Resource management**: Unclosed connections, file handles, streams

**Performance Optimization Strategies:**
- Use appropriate data structures (e.g., hash maps for lookups)
- Batch operations to reduce I/O
- Implement lazy loading where appropriate
- Use connection pooling for databases
- Profile and measure before optimizing
- Consider caching strategies (memoization, HTTP caching)
- Use async/await or similar patterns for I/O-bound operations

#### Code Quality Review

**Code Smells:**
- **Duplication**: Repeated code that should be extracted to functions
- **Long methods/functions**: Functions that do too much
- **Large classes**: Classes with too many responsibilities
- **Complex conditionals**: Deeply nested if/else statements
- **Magic numbers**: Unnamed numeric constants
- **Global state**: Mutable global variables
- **Feature envy**: Methods that use more data from other classes
- **Shotgun surgery**: Changes require modifications across many files

**Best Practices:**
- Follow language-specific conventions (PEP 8, Google Style Guide, etc.)
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Write self-documenting code
- Use type hints/annotations where appropriate
- Handle errors gracefully
- Write tests (unit, integration, end-to-end)
- Document complex logic and APIs

#### Architectural Review

**Design Patterns and Principles:**
- **SOLID principles**: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **Separation of concerns**: UI, business logic, data access
- **Dependency injection**: Proper dependency management
- **Composition over inheritance**: Prefer composition

**Architecture Issues:**
- Tight coupling between components
- Missing abstraction layers
- Violation of architectural boundaries
- Poor error handling strategy
- Inconsistent logging approach
- Missing or inadequate testing strategy

#### Maintainability Review

**Assess Maintainability:**
- **Readability**: Clear variable names, consistent formatting, logical structure
- **Documentation**: Comments for complex logic, API documentation, README
- **Testing**: Unit tests, integration tests, test coverage
- **Error handling**: Comprehensive error handling and logging
- **Configuration**: Proper separation of config and code
- **Dependencies**: Minimal external dependencies, versions pinned

**Maintainability Improvements:**
- Extract complex logic into well-named functions
- Add type hints and interfaces
- Write comprehensive tests
- Document public APIs and non-obvious implementations
- Use standard libraries over external dependencies
- Implement proper logging and monitoring
- Create clear upgrade/migration paths

### 3. Prioritization Framework

**Critical Issues (Fix Immediately):**
- Security vulnerabilities that could be exploited
- Data corruption or loss risks
- Crashes or critical failures
- Performance issues impacting production

**High Priority (Fix Soon):**
- Code smells that will cause maintenance problems
- Performance bottlenecks in hot paths
- Missing error handling for important operations
- Test coverage gaps in critical code

**Medium Priority (Fix Later):**
- Minor code quality issues
- Documentation gaps
- Slightly inefficient but not problematic code
- Inconsistent naming or formatting

**Low Priority (Optional):**
- Stylistic preferences
- Minor optimizations
- Very low-impact issues

### 4. Deliver Output Format

Structure your review as follows:

**Executive Summary**
- Overall assessment (1-3 sentences)
- Critical issues count
- Recommendation (approve with changes, needs revision, reject)

**Critical Issues**
- List each critical issue with:
  - Location (file:line)
  - Severity (Critical/High/Medium/Low)
  - Description of the problem
  - Why it's a problem
  - Suggested fix with code example

**Security Concerns**
- Security-specific issues following same format as Critical Issues

**Performance Issues**
- Performance-specific issues following same format

**Code Quality Issues**
- Code quality concerns following same format

**Architectural Concerns**
- High-level design issues and recommendations

**Positive Aspects**
- What's working well
- Good patterns or practices used

**Recommendations**
- Prioritized action items
- Long-term improvement suggestions
- Additional resources or references

### 5. Language-Specific Guidelines

#### Python
- Follow PEP 8 style guide
- Use type hints (PEP 484)
- Prefer list comprehensions over map/filter
- Use context managers for resource management
- Avoid mutable default arguments
- Use `__slots__` for performance-critical classes
- Leverage standard library (itertools, functools, collections)
- Use virtual environments and dependency management (pip, poetry, pipenv)

#### JavaScript/TypeScript
- Use strict mode and TypeScript for type safety
- Prefer const/let over var
- Use async/await over callbacks
- Avoid global variables
- Use meaningful variable names
- Leverage ES6+ features (arrow functions, destructuring, spread)
- Use linters (ESLint, TSLint)
- Follow Airbnb or Google style guides

#### Java
- Follow Java Code Conventions
- Use try-with-resources for resource management
- Prefer Optional over null
- Use streams and lambdas appropriately
- Follow SOLID principles
- Use dependency injection frameworks (Spring, Guice)
- Write comprehensive JUnit tests
- Use proper exception handling

#### Go
- Follow Effective Go guidelines
- Use gofmt for consistent formatting
- Handle errors explicitly (don't ignore them)
- Use goroutines and channels for concurrency
- Prefer composition over inheritance
- Use interfaces for abstraction
- Write table-driven tests
- Leverage the standard library

#### C++
- Follow C++ Core Guidelines
- Use smart pointers (unique_ptr, shared_ptr)
- Prefer RAII for resource management
- Use move semantics for efficiency
- Leverage STL algorithms and containers
- Avoid raw pointers where possible
- Use constexpr and const for compile-time optimization
- Write unit tests with Google Test or Catch2

#### Rust
- Follow Rust API Guidelines
- Leverage ownership and borrowing for safety
- Use Result for error handling
- Use iterators and functional patterns
- Avoid unsafe code unless necessary
- Use cargo for dependency management
- Write comprehensive tests with built-in test framework

### 6. Testing Review

**Assess Test Coverage:**
- Are there unit tests for core functionality?
- Are there integration tests for component interactions?
- Are there end-to-end tests for critical user flows?
- Are edge cases and error conditions tested?
- What is the test coverage percentage?

**Test Quality:**
- Are tests clear and maintainable?
- Do tests have descriptive names?
- Are tests independent and reproducible?
- Do tests use appropriate assertions?
- Are there tests for security-relevant code paths?

### 7. Documentation Review

**Check for:**
- README with setup and usage instructions
- API documentation (docstrings, Javadoc, etc.)
- Comments explaining complex algorithms
- Architecture documentation
- CONTRIBUTING guidelines
- Changelog or release notes

### 8. Dependencies Review

**Evaluate Dependencies:**
- Are dependencies necessary and minimal?
- Are dependencies actively maintained?
- Are there known vulnerabilities in dependencies?
- Are versions properly pinned?
- Is there a dependency update strategy?

### Tools and Resources

**Static Analysis Tools:**
- Python: pylint, flake8, mypy, bandit (security)
- JavaScript: ESLint, SonarJS, Snyk
- Java: Checkstyle, PMD, FindBugs, SpotBugs
- Go: go vet, golangci-lint, staticcheck
- C++: clang-tidy, cppcheck
- Rust: clippy, rustfmt

**Security Scanning:**
- Snyk, OWASP Dependency-Check, SonarQube
- Language-specific: bandit (Python), gosec (Go), audit (npm)

**Performance Profiling:**
- Python: cProfile, memory_profiler
- JavaScript: Chrome DevTools, Node.js profiler
- Go: pprof
- Rust: criterion, flamegraph

## Best Practices for Reviewers

1. **Be constructive**: Focus on improvement, not criticism
2. **Explain why**: Provide context for recommendations
3. **Offer solutions**: Don't just identify problems, suggest fixes
4. **Prioritize**: Help the developer understand what's most important
5. **Consider context**: Understand constraints and trade-offs
6. **Be respectful**: Code review is collaborative, not adversarial
7. **Learn from others**: Use reviews as a learning opportunity for both sides
