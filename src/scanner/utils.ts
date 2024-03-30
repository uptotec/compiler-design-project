import { TOKEN_TYPES } from './types';

export function checkIdentifierType(currentToken: string) {
  switch (currentToken) {
    case 'read':
      return { type: TOKEN_TYPES.READ, value: currentToken };
    case 'write':
      return { type: TOKEN_TYPES.WRITE, value: currentToken };
    case 'if':
      return { type: TOKEN_TYPES.IF, value: currentToken };
    case 'else':
      return { type: TOKEN_TYPES.ELSE, value: currentToken };
    case 'then':
      return { type: TOKEN_TYPES.THEN, value: currentToken };
    case 'end':
      return { type: TOKEN_TYPES.END, value: currentToken };
    case 'repeat':
      return { type: TOKEN_TYPES.REPEAT, value: currentToken };
    case 'until':
      return { type: TOKEN_TYPES.UNTIL, value: currentToken };
    default:
      return {
        type: TOKEN_TYPES.Identifier,
        value: currentToken,
      };
  }
}
