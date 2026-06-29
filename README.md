# Playwright Learning - API Testing

## Description

This is a learning project for API testing using **Playwright Test**, a powerful end-to-end testing framework. The project focuses on testing REST API endpoints from the FakeAPI Platzi service.

## Project Overview

This repository contains automated test suites that demonstrate:

- **CRUD Operations**: Create, Read, Update, and Delete product endpoints
- **Query Operations**: Fetching products by ID, slug, and pagination
- **Related Products**: Retrieving products related by ID and slug
- **API Testing Patterns**: Test organization, assertions, and request/response handling

## Technologies

- **Playwright Test**: End-to-end testing framework
- **TypeScript**: Type-safe test code
- **FakeAPI Platzi**: Mock API for testing purposes

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run tests:

   ```bash
   npx playwright test
   ```

3. View test report:
   ```bash
   npx playwright show-report
   ```

## Test Structure

Tests are organized in the `tests/` directory and cover various API endpoints including:

- Product retrieval by ID and slug
- Product creation and updates
- Product deletion
- Pagination functionality
- Related products queries

## License

ISC
