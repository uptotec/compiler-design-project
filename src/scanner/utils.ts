import { TOKEN_TYPES } from './types';

export function checkIdentifierType(currentToken: string) {
  if (currentToken === 'read') {
    return { type: TOKEN_TYPES.READ, value: currentToken };
  } else if (currentToken === 'write') {
    return { type: TOKEN_TYPES.WRITE, value: currentToken };
  } else if (currentToken === 'if') {
    return { type: TOKEN_TYPES.IF, value: currentToken };
  } else if (currentToken === 'else') {
    return { type: TOKEN_TYPES.ELSE, value: currentToken };
  } else if (currentToken === 'then') {
    return { type: TOKEN_TYPES.THEN, value: currentToken };
  } else if (currentToken === 'end') {
    return { type: TOKEN_TYPES.END, value: currentToken };
  } else if (currentToken === 'repeat') {
    return { type: TOKEN_TYPES.REPEAT, value: currentToken };
  } else if (currentToken === 'until') {
    return { type: TOKEN_TYPES.UNTIL, value: currentToken };
  } else {
    return {
      type: TOKEN_TYPES.Identifier,
      value: currentToken,
    };
  }
}
