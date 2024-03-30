import { Token, TOKEN_TYPES, ScannerStates } from './types';
import { checkIdentifierType } from './utils';

export function Scanner(code: string) {
  const tokens: Token[] = [];
  const errors: string[] = [];

  const line = code
    .split('\n')
    .map((line) => line.trim())
    .join(' ');

  const cleanedLine = line.trim();

  let currentToken = '';
  let currentState: ScannerStates = ScannerStates.Start;

  for (let i = 0; i < cleanedLine.length; i++) {
    const char = cleanedLine[i];
    switch (currentState) {
      case ScannerStates.Start:
        if (char === ' ') {
          continue;
        } else if (char.match(/[a-zA-Z]/)) {
          currentState = ScannerStates.Identifier;
          currentToken += char;
        } else if (char.match(/[0-9]/)) {
          currentState = ScannerStates.Number;
          currentToken += char;
        } else if (char === ':') {
          currentState = ScannerStates.AssignOperator;
          currentToken += char;
        } else if (char === '{') {
          currentState = ScannerStates.Comment;
        } else if (char === '(') {
          tokens.push({ type: TOKEN_TYPES.LeftParen, value: '(' });
        } else if (char === ')') {
          tokens.push({ type: TOKEN_TYPES.RightParen, value: ')' });
        } else if (char === '+') {
          tokens.push({ type: TOKEN_TYPES.PlusOperator, value: '+' });
        } else if (char === '-') {
          tokens.push({ type: TOKEN_TYPES.MinusOperator, value: '-' });
        } else if (char === '*') {
          tokens.push({ type: TOKEN_TYPES.MultiplyOperator, value: '*' });
        } else if (char === '/') {
          tokens.push({ type: TOKEN_TYPES.DivideOperator, value: '/' });
        } else if (char === '=') {
          tokens.push({ type: TOKEN_TYPES.EqualOperator, value: '=' });
        } else if (char === ';') {
          tokens.push({ type: TOKEN_TYPES.SIMICOLON, value: ';' });
        } else if (char === '<') {
          currentState = ScannerStates.LessThanOrEqualOperator;
          currentToken += char;
        } else if (char === '>') {
          currentState = ScannerStates.GreaterThanOrEqualOperator;
          currentToken += char;
        } else {
          errors.push(`Invalid token: ${char}`);
        }
        break;

      case ScannerStates.Identifier:
        if (char.match(/[a-zA-Z0-9]/)) {
          currentToken += char;
        } else {
          tokens.push(checkIdentifierType(currentToken));
          currentToken = '';
          currentState = ScannerStates.Start;
          i--;
        }
        break;

      case ScannerStates.Number:
        if (char.match(/[0-9]/)) {
          currentToken += char;
        } else {
          tokens.push({ type: TOKEN_TYPES.Number, value: currentToken });
          currentToken = '';
          currentState = ScannerStates.Start;
          i--;
        }
        break;

      case ScannerStates.AssignOperator:
        if (char === '=') {
          tokens.push({ type: TOKEN_TYPES.AssignOperator, value: ':=' });
        } else {
          errors.push('Invalid token ":"');
        }
        currentState = ScannerStates.Start;
        currentToken = '';
        break;

      case ScannerStates.Comment:
        if (char === '}') {
          currentState = ScannerStates.Start;
        }
        break;

      case ScannerStates.LessThanOrEqualOperator:
        if (char === '=') {
          tokens.push({
            type: TOKEN_TYPES.LessThanOrEqualOperator,
            value: '<=',
          });
          currentState = ScannerStates.Start;
          currentToken = '';
        } else {
          tokens.push({ type: TOKEN_TYPES.LessThanOperator, value: '<' });
          currentState = ScannerStates.Start;
          currentToken = '';
          i--;
        }
        break;

      case ScannerStates.GreaterThanOrEqualOperator:
        if (char === '=') {
          tokens.push({
            type: TOKEN_TYPES.GreaterThanOrEqualOperator,
            value: '>=',
          });
          currentState = ScannerStates.Start;
          currentToken = '';
        } else {
          tokens.push({ type: TOKEN_TYPES.GreaterThanOperator, value: '>' });
          currentState = ScannerStates.Start;
          currentToken = '';
          i--;
        }
        break;
    }
  }

  if (currentState === ScannerStates.Identifier) {
    tokens.push(checkIdentifierType(currentToken));
  }

  if (currentState === ScannerStates.Number) {
    tokens.push({ type: TOKEN_TYPES.Number, value: currentToken });
  }

  if (currentState === ScannerStates.AssignOperator) {
    errors.push('Invalid token ":"');
  }

  if (currentState === ScannerStates.LessThanOrEqualOperator) {
    tokens.push({ type: TOKEN_TYPES.LessThanOperator, value: '<' });
  }

  if (currentState === ScannerStates.GreaterThanOrEqualOperator) {
    tokens.push({ type: TOKEN_TYPES.GreaterThanOperator, value: '>' });
  }

  if (currentState === ScannerStates.Comment) {
    errors.push('Invalid comment');
  }

  return { tokens, errors };
}
