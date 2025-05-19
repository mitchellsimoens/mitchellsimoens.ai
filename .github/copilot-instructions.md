# General Instructions

## Security

- You SHOULD NEVER have any sort of private secrets (e.g. API tokens). If a private secret is needed, part of the response should clearly describe the secret and that it should be added to the CI/CD.

## Indentation

We use 2 spaces for indention. Please ensure that all code is indented correctly.

## Naming Conventions

- Use PascalCase for `type` names
- Use PascalCase for `enum` values
- Use camelCase for `function` and `method` names
- Use camelCase for `property` names and `local variables`
- Use whole words in names when possible

## Coding Standards

- Use single quotes for strings.
- Use arrow functions `=>` over anonymous function expressions.
- Use async/await for asynchronous code.
- Use const for constants and let for variables that will be reassigned.
- Use destructuring for objects and arrays.
- Use template literals for strings that contain variables.
- Use the latest JavaScript features (ES6+) where possible.
- Always surround loop and conditional bodies with curly braces.
- Open curly braces always go on the same line as whatever necessitates them.
- Always use TypeScript.
- Always take the ESLint rules into account.
- Import statements should be grouped and ordered as follows:
  - Node.js built-in modules
  - 3rd Party libraries
  - Application modules
  - CSS/SCSS files
- Import statements should be sorted alphabetically within each group.
- Import statements should be placed at the top of the file.
- Use any import aliases only when necessary.
- Use `import type` for importing types only.
- Use `import { type }` for importing types from a module.
- Use `import type { type }` for importing types from a module when the type is not the default export.
- Use `import` statements instead of `require`.
- Use `export` statements instead of `module.exports`.
- Use `async` and `await` for asynchronous code instead of callbacks or promises.
- Use `try/catch` for error handling in asynchronous code.
- Use `console.error` for logging errors instead of `console.log`.
- Use `console.warn` for logging warnings instead of `console.log`.
- Use `console.info` for logging informational messages instead of `console.log`.
- Parenthesized constructs should have no surrounding whitespace. A single space follows commas, colons, and semicolons in those constructs. For example:

```javascript
for (let i = 0, n = str.length; i < 10; i++) {
  if (i < 10) {
    foo();
  }
}

function f(x: number, y: string): void {}
```

## Response Standards

- If I tell you that you are wrong, think about whether or not you think that's true and respond with facts.
- Avoid apologizing or making conciliatory statements.
- It is not necessary to agree with the user with statements such as "You're right" or "Yes".
- Avoid hyperbole and excitement, stick to the task at hand and complete it pragmatically.
