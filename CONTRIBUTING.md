# Contributing to ngx-lift

Thank you for your interest in contributing to ngx-lift! This document provides guidelines and instructions for
contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Project Structure](#project-structure)

## 📜 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Git

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ngx-lift-workspace.git
   cd ngx-lift-workspace
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/wghglory/ngx-lift-workspace.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Build the libraries**:
   ```bash
   npm run build:libs
   ```
6. **Start the demo app** (optional):
   ```bash
   npm start
   ```

## 🔄 Development Workflow

### Creating a Branch

1. **Update your main branch**:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Making Changes

1. **Make your changes** following our [coding standards](#coding-standards)
2. **Write/update tests** for your changes
3. **Update documentation** if needed
4. **Run tests** to ensure everything passes:
   ```bash
   npm test
   ```
5. **Run linting**:
   ```bash
   npm run lint
   ```
6. **Format code**:
   ```bash
   npm run format
   ```

### Committing Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m "feat(ngx-lift): add new utility function"
git commit -m "fix(clr-lift): resolve alert component issue"
git commit -m "docs: update README with new examples"
git commit -m "test(ngx-lift): add tests for new operator"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

## 📐 Coding Standards

### TypeScript

- ✅ **Strict Mode**: All code must pass TypeScript strict mode
- ✅ **No `any` Types**: Use proper types or `unknown` with type guards
- ✅ **DRY Principle**: Don't repeat yourself
- ✅ **Type Inference**: Use where possible; explicit types for public APIs

### Angular

- ✅ **Standalone Components**: All components must be standalone (no NgModules)
- ✅ **OnPush Strategy**: **MANDATORY** for all components
- ✅ **Signal Inputs/Outputs**: Use `input()`, `output()` instead of `@Input()`, `@Output()`
- ✅ **Dependency Injection**: Prefer `inject()` function over constructor injection
- ✅ **Change Detection**: Minimize by using signals and computed values

### Code Quality

- ✅ **ESLint**: All code must pass ESLint without errors
- ✅ **Prettier**: All code must be formatted with Prettier
- ✅ **JSDoc**: **MANDATORY** for all exported functions, classes, interfaces, types, and constants
- ✅ **Self-Review**: Review your own code before submitting

### File Organization

- ✅ **Naming**: Use kebab-case for files, PascalCase for classes
- ✅ **Structure**: Follow existing project structure
- ✅ **Imports**: Use path mappings from `tsconfig.base.json`

## 🧪 Testing Guidelines

### Test Coverage

- **Minimum Coverage**: 60% for all components
- **Critical Paths**: Aim for 80%+ coverage on business logic
- **Test Types**: Unit tests (Vitest) and E2E tests (Playwright)

### Writing Tests

```typescript
import {describe, it, expect, beforeEach} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyComponent],
    });
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific library
npm run test:ngx
npm run test:clr

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
nx test ngx-lift --watch
```

## 📚 Documentation

### Code Documentation

- **JSDoc Comments**: Required for all exported APIs
- **Examples**: Include code examples in JSDoc when helpful
- **Parameter Documentation**: Document all parameters with `@param`
- **Return Documentation**: Document return values with `@returns`

Example:

````typescript
/**
 * Creates an async state from an observable.
 *
 * @param options - Configuration options for async state creation
 * @param options.next - Callback executed when data is received
 * @param options.error - Callback executed when an error occurs
 * @returns An observable that emits AsyncState objects
 *
 * @example
 * ```typescript
 * const state$ = this.http.get('/api/data').pipe(
 *   createAsyncState({
 *     next: (data) => console.log('Data:', data),
 *     error: (err) => console.error('Error:', err),
 *   })
 * );
 * ```
 */
export function createAsyncState<T>(options: AsyncStateOptions<T>): OperatorFunction<T, AsyncState<T>> {
  // Implementation
}
````

### README Updates

- Update README when adding new features
- Include usage examples
- Update feature lists
- Add migration guides for breaking changes

## 📤 Submitting Changes

### Pull Request Process

1. **Update your branch**:

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Push your changes**:

   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots/demos if applicable

4. **Wait for Review**:
   - Address review comments
   - Update your PR as needed
   - Ensure all CI checks pass

### Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] JSDoc comments added for exported APIs
- [ ] TypeScript strict mode compliance
- [ ] No `any` types used
- [ ] ESLint passes without errors
- [ ] Prettier formatting applied
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
- [ ] No console.log statements
- [ ] No commented-out code

## 📁 Project Structure

```
ngx-lift-workspace/
├── apps/
│   ├── demo/              # Demo application
│   └── demo-e2e/          # E2E tests
├── libs/
│   ├── ngx-lift/          # ngx-lift library
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── models/
│   │   │   │   ├── operators/
│   │   │   │   ├── pipes/
│   │   │   │   ├── signals/
│   │   │   │   ├── utils/
│   │   │   │   └── validators/
│   │   │   └── index.ts
│   │   └── package.json
│   └── clr-lift/          # clr-lift library
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   ├── models/
│       │   │   ├── operators/
│       │   │   ├── pipes/
│       │   │   ├── services/
│       │   │   └── utils/
│       │   └── index.ts
│       └── package.json
└── docs/                   # Documentation
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Angular version, library version, browser, etc.
6. **Screenshots**: If applicable
7. **Code Example**: Minimal reproduction example

## 💡 Requesting Features

When requesting features, please include:

1. **Use Case**: Why is this feature needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions you've considered
4. **Examples**: Code examples showing usage
5. **Impact**: Who would benefit from this feature?

## ❓ Questions?

- 🐛 **Found a bug?** [Open an issue](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=bug_report.md)
- 💡 **Have a feature request?**
  [Request a feature](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=feature_request.md)
- 💬 **Have a question?** [Start a discussion](https://github.com/wghglory/ngx-lift-workspace/discussions)

## 🙏 Thank You!

Thank you for contributing to ngx-lift! Your contributions make this project better for everyone.

---

**Happy coding! 🚀**
