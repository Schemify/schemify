# 🛡️ Error Handling System - Schemify CLI

## 📋 General Description

Schemify CLI implements a robust error handling system inspired by NestJS best practices, providing:

- **Centralized error handling** with custom error classes
- **Informative error messages** with helpful suggestions
- **Global unhandled error capture**
- **Graceful process exit**
- **Structured error logging**

## 🏗️ System Architecture

### Custom Error Classes

```typescript
// Base error for the entire application
export class SchemifyError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestions?: string[]
  )
}

// Domain-specific errors
export class ValidationError extends SchemifyError
export class PromptError extends SchemifyError
export class ScaffoldingError extends SchemifyError
```

### Main Error Handler

```typescript
export class ErrorHandler {
  static handle(error: unknown): void
  static formatError(message: string, code?: string): string
}
```

### Handling Utilities

```typescript
// Wrapper for async operations with error handling
export function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorContext?: string
): Promise<T>
```

## 🎯 Use Cases

### 1. Input Validation

```typescript
if (!name) {
  throw new ValidationError(
    'You must specify a project name.',
    [
      'Example: schemify new my-project',
      'The name must be valid for a project directory'
    ]
  )
}
```

### 2. Prompt Handling

```typescript
try {
  const answers = await prompt([...])
} catch (error) {
  if (error.message.includes('cancelled')) {
    throw new PromptError('Operation cancelled by user')
  }
}
```

### 3. Scaffolding Operations

```typescript
await withErrorHandling(
  async () => {
    await scaffolder.scaffold(options)
  },
  'Failed to create new application'
)
```

## 🔧 Global Configuration

### Unhandled Error Handler

```typescript
// Capture unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  ErrorHandler.handle(reason)
  process.exit(1)
})

// Capture uncaught exceptions
process.on('uncaughtException', (error) => {
  ErrorHandler.handle(error)
  process.exit(1)
})
```

### System Signal Handling

```typescript
// Graceful handling of Ctrl+C
process.on('SIGINT', () => {
  console.log('\nOperation cancelled by user.')
  process.exit(0)
})
```

## 📊 Error Types and Codes

| Code                | Description               | Example                |
| ------------------- | ------------------------- | ---------------------- |
| `VALIDATION_ERROR`  | Input validation errors   | Invalid project name   |
| `PROMPT_ERROR`      | Interactive prompt errors | User cancels operation |
| `SCAFFOLDING_ERROR` | Code generation errors    | File permissions       |
| `OPERATION_ERROR`   | General operation errors  | Network errors         |

## 🎨 Output Format

### Validation Error
```
❌ ValidationError: You must specify a project name.

💡 Suggestions:
   • Example: schemify new my-project
   • The name must be valid for a project directory

📖 For more information, run: schemify --help
```

### Prompt Error
```
❌ PromptError: Operation cancelled by user

📖 Try running the command again or use Ctrl+C to cancel
```

### Scaffolding Error
```
❌ ScaffoldingError: Permission denied. Check your file system permissions.

💡 Tip: Check that you have write permissions in the current directory.

📖 Check your permissions and available disk space
```

## 🔄 Error Handling Flow

1. **Detection**: Error occurs anywhere in the application
2. **Classification**: Error type is determined and appropriate class is created
3. **Enrichment**: Suggestions and useful context are added
4. **Propagation**: Error is propagated up the call chain
5. **Handling**: The `ErrorHandler` processes and formats the error
6. **Output**: Formatted message is displayed and process is terminated

## 🧪 Testing

### Test Example

```typescript
describe('ErrorHandler', () => {
  it('should handle ValidationError correctly', () => {
    const error = new ValidationError('Test error', ['Suggestion 1'])
    
    // Mock console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    ErrorHandler.handle(error)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ ValidationError:'),
      'Test error'
    )
  })
})
```

## 🚀 Best Practices

1. **Always use custom error classes** instead of generic `Error`
2. **Provide helpful suggestions** in validation errors
3. **Use `withErrorHandling`** for complex async operations
4. **Keep error messages in English** for consistency
5. **Include error codes** to facilitate debugging
6. **Provide context** in error messages

## 🔗 NestJS Integration

This system is inspired by NestJS error handling:

- **Exception Filters**: Similar to `ErrorHandler.handle()`
- **Custom Exceptions**: Similar to our custom error classes
- **Global Exception Handler**: Similar to our global handler
- **Graceful Shutdown**: Similar to our signal handling

## 📝 Logs and Debugging

For advanced debugging, you can enable detailed logs:

```bash
DEBUG=schemify:* schemify new my-project
```

This will show detailed information about the error handling flow. 