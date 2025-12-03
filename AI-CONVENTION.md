# AI Comment Convention

This document defines the standard format for AI-friendly comments in the codebase. These comments provide structured metadata and decision records that help AI tools understand the code's purpose, context, and design decisions.

## Overview

AI-friendly comments come in two formats:
1. **Short format**: Simple inline comments for quick directives
2. **Long format**: Structured JSDoc-style comments with JSON metadata for complex documentation

## Short Format

Use the short format for simple, direct instructions or warnings.

### Syntax

```typescript
// @ai: <message>
```

### Examples

```typescript
// @ai: Never modify this file. It is auto-generated.
// @ai: This function must remain synchronous for performance reasons.
// @ai: Do not refactor this without consulting the team lead.
```

### When to Use

- Simple warnings or constraints
- Auto-generated file markers
- Performance-critical code sections
- Temporary workarounds that should not be refactored

### Respecting AI Comments

AI tools must respect all AI comments unless explicitly instructed by the user to ignore a specific comment type or context. For example:
- If a file has `// @ai: Never modify this file.`, AI should not modify it unless the user explicitly says "ignore the 'never modify' comment in this file" or similar explicit instruction
- AI comments are directives that should be followed by default
- Only override AI comments when the user provides explicit, context-specific permission to do so

## Long Format

Use the long format for comprehensive documentation including architectural decisions, complex logic explanations, and structured metadata.

### Syntax

```typescript
/**
 * @ai {
 *   "decision": "ADR-XXX: <Title>",
 *   "context": "<Background and problem statement>",
 *   "consequences": {
 *     "pros": ["<advantage 1>", "<advantage 2>"],
 *     "cons": ["<disadvantage 1>", "<disadvantage 2>"]
 *   },
 *   "alternatives": ["<alternative 1>", "<alternative 2>"],
 *   "category": "<category>",
 *   "complexity": "<low|medium|high>",
 *   "dependencies": ["<dependency1>", "<dependency2>"],
 *   "sideEffects": ["<side effect 1>", "<side effect 2>"],
 *   "errorHandling": "<error handling strategy>",
 *   "performance": "<performance characteristics>"
 * }
 */
```

### Field Specifications

#### Required Fields

- **`decision`** (string): Architectural Decision Record (ADR) reference and title. Format: `"ADR-XXX: <Title>"`. If no ADR exists, use format: `"Decision: <Title>"`.

#### Optional Fields

- **`context`** (string): Background information, problem statement, and rationale for the decision. Explain the "why" behind the code.

- **`consequences`** (object): Trade-offs and impacts of the decision.
  - `pros` (array of strings): List of advantages
  - `cons` (array of strings): List of disadvantages

- **`alternatives`** (array of strings): Alternative approaches that were considered and why they were rejected.

- **`category`** (string): Functional category of the code. Examples:
  - `"authentication"`
  - `"database"`
  - `"api"`
  - `"business-logic"`
  - `"infrastructure"`

- **`complexity`** (string): Complexity level. One of: `"low"`, `"medium"`, `"high"`.

- **`dependencies`** (array of strings): List of components, services, or modules this code depends on. Use descriptive names like `"FirebaseStrategy"`, `"UserService"`, `"DatabaseModule"`.

- **`sideEffects`** (array of strings): Side effects this code produces. Examples:
  - `"creates_user"`
  - `"creates_session"`
  - `"sends_email"`
  - `"updates_cache"`
  - `"triggers_webhook"`

- **`errorHandling`** (string): Description of how errors are handled. Examples:
  - `"throws AuthError on invalid token"`
  - `"returns null on failure"`
  - `"retries 3 times on network failure"`

- **`performance`** (string): Performance characteristics. Use Big O notation or descriptive text. Examples:
  - `"O(1) database lookup, O(n) claims sync"`
  - `"Constant time operation"`
  - `"Linear time complexity based on input size"`

### Complete Example

```typescript
/**
 * Authenticates a user using Firebase ID token and creates/updates user session.
 * 
 * @ai {
 *   "decision": "ADR-001: Separate Auth Credentials from User Profile",
 *   "context": "Need to support multiple authentication providers without schema changes. Separating auth credentials from user profile allows adding new providers without modifying the user table.",
 *   "consequences": {
 *     "pros": ["Easy to add new auth providers", "Clear separation of concerns", "Better queryability"],
 *     "cons": ["Additional join required", "Slightly more complex queries"]
 *   },
 *   "alternatives": [
 *     "Single table with JSON column - rejected due to poor queryability",
 *     "Polymorphic associations - rejected due to TypeORM limitations"
 *   ],
 *   "category": "authentication",
 *   "complexity": "high",
 *   "dependencies": ["FirebaseStrategy", "UserService", "FirebaseAdmin"],
 *   "sideEffects": ["creates_user", "creates_session", "syncs_custom_claims"],
 *   "errorHandling": "throws AuthError on invalid token, returns 401 on expired token",
 *   "performance": "O(1) token validation, O(1) user lookup, O(n) claims sync where n is number of claims"
 * }
 * 
 * @param idToken - Firebase ID token from the client
 * @returns Authentication result with user and session information
 * @throws {AuthError} When the token is invalid or expired
 */
async authenticateWithFirebase(idToken: string): Promise<AuthResult> {
  // Implementation...
}
```

### Minimal Example

You don't need to include all fields. Include only what's relevant:

```typescript
/**
 * User entity following the "Entity Extends Domain Type" pattern.
 * 
 * @ai {
 *   "decision": "ADR-002: Entity Extends Domain Type Pattern",
 *   "context": "Separate domain types from database entities to keep business logic database-agnostic",
 *   "category": "database",
 *   "complexity": "low"
 * }
 */
@Entity('users')
export class UserEntity implements User {
  // Implementation...
}
```

## Integration with TSDoc/JSDoc

AI comments complement, but do not replace, standard TSDoc/JSDoc comments. Use both together:

```typescript
/**
 * Authenticates a user using Firebase ID token.
 * 
 * @remarks
 * This method performs server-side token validation for security.
 * The user is created if they don't exist (upsert pattern).
 * 
 * @ai {
 *   "decision": "ADR-001: Separate Auth Credentials from User Profile",
 *   "context": "Need to support multiple authentication providers",
 *   "category": "authentication",
 *   "complexity": "high"
 * }
 * 
 * @param idToken - Firebase ID token from the client
 * @returns Authentication result containing user and session information
 * @throws {AuthError} When the token is invalid or expired
 */
async authenticateWithFirebase(idToken: string): Promise<AuthResult> {
  // Implementation...
}
```

## Best Practices

1. **Use short format sparingly**: Only for critical constraints or warnings
2. **Use long format for architectural decisions**: When documenting design patterns, ADRs, or complex logic
3. **Keep JSON valid**: Ensure all JSON in `@ai` blocks is valid JSON
4. **Be concise but complete**: Include enough context for AI tools to understand the code
5. **Update when code changes**: Keep AI comments in sync with code changes
6. **Combine with TSDoc**: Use AI comments to supplement, not replace, standard documentation
7. **Focus on "why"**: AI comments should explain reasoning and decisions, not just what the code does
8. **Respect AI comments by default**: AI tools must follow all AI comments unless the user explicitly instructs to ignore a specific comment type or context

## When to Use Each Format

### Use Short Format (`// @ai:`) When:
- Marking auto-generated files
- Warning about performance-critical code
- Indicating code that shouldn't be refactored
- Simple constraints or directives

### Use Long Format (`@ai { ... }`) When:
- Documenting architectural decisions (ADRs)
- Explaining complex business logic
- Describing design patterns
- Documenting trade-offs and alternatives
- Providing context for non-obvious code
- Explaining performance characteristics
- Documenting error handling strategies

## JSON Schema Validation

The JSON in `@ai` blocks should follow this schema:

```json
{
  "type": "object",
  "required": ["decision"],
  "properties": {
    "decision": { "type": "string" },
    "context": { "type": "string" },
    "consequences": {
      "type": "object",
      "properties": {
        "pros": { "type": "array", "items": { "type": "string" } },
        "cons": { "type": "array", "items": { "type": "string" } }
      }
    },
    "alternatives": { "type": "array", "items": { "type": "string" } },
    "category": { "type": "string" },
    "complexity": { "type": "string", "enum": ["low", "medium", "high"] },
    "dependencies": { "type": "array", "items": { "type": "string" } },
    "sideEffects": { "type": "array", "items": { "type": "string" } },
    "errorHandling": { "type": "string" },
    "performance": { "type": "string" }
  }
}
```

## Notes

- AI comments are parsed by AI tools to provide better context and understanding
- These comments should be maintained alongside code changes
- Invalid JSON in `@ai` blocks may cause parsing issues
- Always validate JSON syntax before committing
- Use standard TSDoc/JSDoc for API documentation, use AI comments for architectural context

