# Contributing to Slop AI

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Quick Start

1. **Fork the repository**
   ```bash
   git clone https://github.com/PranjaldevX/slope_ai.git
   cd slop_ai
   ```

2. **Install dependencies**
   ```bash
   cd extension
   npm install
   ```

3. **Build and test**
   ```bash
   npm run build
   ```

4. **Load extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `extension/dist` folder

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `extension/src/`
   - Follow existing code style
   - Add comments for complex logic

3. **Test your changes**
   - Build: `npm run build`
   - Reload extension in Chrome
   - Test on pages in `test-pages/`
   - Test on real websites

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

### Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add review clustering algorithm
fix: prevent false positives on technical content
docs: update installation instructions
```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict type checking
- Avoid `any` types when possible
- Use meaningful variable names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use CSS modules or scoped styles

### Comments

- Add JSDoc comments for public functions
- Explain "why" not "what" in inline comments
- Document complex algorithms

Example:
```typescript
/**
 * Calculates the claim-to-evidence ratio for a text.
 * High ratio indicates many unsupported claims.
 * 
 * @param text - The text to analyze
 * @returns Ratio from 0.0 (evidence-backed) to 1.0 (unsupported claims)
 */
export function claimToEvidenceRatio(text: string): number {
  // Implementation
}
```

## 🧪 Testing

### Manual Testing

1. **Test on provided test pages**
   - AI-generated content should be flagged
   - Quality content should NOT be flagged

2. **Test on real websites**
   - Amazon product reviews
   - Blog posts
   - News articles
   - Technical documentation

3. **Test edge cases**
   - Very short paragraphs
   - Code blocks
   - Lists and tables
   - Non-English content

### Adding Test Pages

Create new HTML files in `test-pages/`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page Name</title>
</head>
<body>
    <h1>Test Content</h1>
    <p>Your test content here...</p>
</body>
</html>
```

## 🎯 Areas for Contribution

### High Priority

1. **Improve Detection Accuracy**
   - Reduce false positives
   - Catch more subtle slop patterns
   - Add new linguistic metrics

2. **Performance Optimization**
   - Faster page scanning
   - Reduce memory usage
   - Optimize regex patterns

3. **Browser Compatibility**
   - Firefox support
   - Edge support
   - Safari support

### Medium Priority

4. **UI/UX Improvements**
   - Better visual indicators
   - More detailed tooltips
   - Customizable themes

5. **Configuration Options**
   - Adjustable thresholds
   - Whitelist/blacklist domains
   - Custom metric weights

6. **Documentation**
   - More examples
   - Video tutorials
   - API documentation

### Nice to Have

7. **Advanced Features**
   - Export analysis reports
   - Historical tracking
   - Machine learning integration

8. **Testing Infrastructure**
   - Unit tests
   - Integration tests
   - Automated accuracy testing

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the issue already exists
2. Test on latest version
3. Try to reproduce consistently

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Browser: Chrome 120
- Extension Version: 1.0.0
- OS: Windows 11
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Problem**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors
- [ ] Extension loads in Chrome
- [ ] Tested on multiple pages
- [ ] No console errors
- [ ] Code follows style guide
- [ ] Commit messages follow convention

### PR Description Template

```markdown
**What does this PR do?**
Brief description

**Why is this needed?**
Problem it solves

**How was it tested?**
Testing steps

**Screenshots**
If UI changes

**Related Issues**
Fixes #123
```

### Review Process

1. Maintainer reviews code
2. Feedback provided if needed
3. You make requested changes
4. Maintainer approves and merges

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: security@example.com (replace with actual email)

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Chat**: Join our Discord (if available)
- **Email**: contact@example.com (replace with actual email)

## 🎓 Learning Resources

### Understanding the Codebase

1. **Start with**: `extension/src/analyzer.ts` - Core detection logic
2. **Then read**: `extension/src/content.ts` - Page scanning
3. **Finally**: `extension/src/App.tsx` - UI components

### Useful Links

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Credited in extension about page

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Information Density Filter! 🎉
