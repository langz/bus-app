# Testing Configuration

This project uses [Vitest](https://vitest.dev/) for testing, which provides a fast and modern testing experience.

## Test Scripts

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once and exit
- `npm run test:ui` - Run tests with Vitest UI (requires @vitest/ui package)

## Test Setup

The testing environment is configured with:

- **Vitest** - Fast unit test runner
- **jsdom** - Browser environment simulation
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - Additional DOM matchers
- **@testing-library/user-event** - User interaction simulation

## Configuration Files

- `vite.config.ts` - Main Vitest configuration
- `vitest.config.ts` - Additional Vitest-specific configuration
- `src/test/setup.ts` - Global test setup file

