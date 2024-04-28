import { ParseNode, Token, TOKEN_TYPES } from './types';

export function Parser(tokens: Token[]): ParseNode {
  let currentIndex = 0;

  function match(expectedType: TOKEN_TYPES): boolean {
    if (currentIndex >= tokens.length) {
      return false;
    }

    if (tokens[currentIndex].type === expectedType) {
      currentIndex++;
      return true;
    }

    return false;
  }

  function parseProgram(): ParseNode {
    const programNode = new ParseNode('Program');

    while (currentIndex < tokens.length) {
      programNode.children.push(parseStatement());
    }

    return programNode;
  }

  function parseStatement(): ParseNode {
    if (match(TOKEN_TYPES.IF)) {
      return parseIfStatement();
    } else if (match(TOKEN_TYPES.REPEAT)) {
      return parseRepeatStatement();
    } else if (match(TOKEN_TYPES.Identifier)) {
      return parseAssignmentStatement();
    } else if (match(TOKEN_TYPES.READ)) {
      return parseReadStatement();
    } else if (match(TOKEN_TYPES.WRITE)) {
      return parseWriteStatement();
    } else {
      throw new Error(
        `Unexpected token at index ${currentIndex}: ${tokens[currentIndex].type}`
      );
    }
  }

  function parseIfStatement(): ParseNode {
    const ifNode = new ParseNode(TOKEN_TYPES.IF);

    ifNode.children.push(parseExpression());

    if (!match(TOKEN_TYPES.THEN)) {
      throw new Error(`Expected THEN token at index ${currentIndex}`);
    }

    ifNode.children.push(...parseStatements());

    if (match(TOKEN_TYPES.ELSE)) {
      ifNode.children.push(...parseStatements());
    }

    if (!match(TOKEN_TYPES.END)) {
      throw new Error(`Expected END token at index ${currentIndex}`);
    }

    return ifNode;
  }

  function parseRepeatStatement(): ParseNode {
    const repeatNode = new ParseNode(TOKEN_TYPES.REPEAT);

    repeatNode.children.push(...parseStatements());

    if (!match(TOKEN_TYPES.UNTIL)) {
      throw new Error(`Expected UNTIL token at index ${currentIndex}`);
    }

    repeatNode.children.push(parseExpression());

    if (!match(TOKEN_TYPES.SIMICOLON)) {
      throw new Error(`Expected semicolon at index ${currentIndex}`);
    }

    return repeatNode;
  }

  function parseStatements(): ParseNode[] {
    const statements: ParseNode[] = [];

    while (
      currentIndex < tokens.length &&
      tokens[currentIndex].type !== TOKEN_TYPES.UNTIL &&
      tokens[currentIndex].type !== TOKEN_TYPES.ELSE &&
      tokens[currentIndex].type !== TOKEN_TYPES.END
    ) {
      statements.push(parseStatement());
    }

    return statements;
  }

  function parseAssignmentStatement(): ParseNode {
    const assignmentNode = new ParseNode(TOKEN_TYPES.AssignOperator);

    assignmentNode.children.push(
      new ParseNode(TOKEN_TYPES.Identifier, tokens[currentIndex - 1].value)
    );

    if (!match(TOKEN_TYPES.AssignOperator)) {
      throw new Error(`Expected assignment operator at index ${currentIndex}`);
    }

    assignmentNode.children.push(parseExpression());

    if (!match(TOKEN_TYPES.SIMICOLON)) {
      throw new Error(`Expected semicolon at index ${currentIndex}`);
    }

    return assignmentNode;
  }

  function parseReadStatement(): ParseNode {
    const readNode = new ParseNode(TOKEN_TYPES.READ);

    if (!match(TOKEN_TYPES.Identifier)) {
      throw new Error(
        `Expected identifier after READ keyword at index ${currentIndex}`
      );
    }

    readNode.children.push(
      new ParseNode('Identifier', tokens[currentIndex - 1].value)
    );

    if (!match(TOKEN_TYPES.SIMICOLON)) {
      throw new Error('Expected semicolon');
    }

    return readNode;
  }

  function parseWriteStatement(): ParseNode {
    const writeNode = new ParseNode(TOKEN_TYPES.WRITE);

    writeNode.children.push(parseExpression());

    if (!match(TOKEN_TYPES.SIMICOLON)) {
      throw new Error('Expected semicolon');
    }

    return writeNode;
  }

  function parseExpression(): ParseNode {
    let node = parseSimpleExpression();

    while (
      currentIndex < tokens.length &&
      (match(TOKEN_TYPES.EqualOperator) ||
        match(TOKEN_TYPES.LessThanOperator) ||
        match(TOKEN_TYPES.LessThanOrEqualOperator) ||
        match(TOKEN_TYPES.GreaterThanOperator) ||
        match(TOKEN_TYPES.GreaterThanOrEqualOperator))
    ) {
      const operatorNode = new ParseNode(tokens[currentIndex - 1].type);
      const rightNode = parseSimpleExpression();
      operatorNode.children.push(node, rightNode);
      node = operatorNode;
    }

    return node;
  }

  function parseSimpleExpression(): ParseNode {
    let node = parseTerm();

    while (
      currentIndex < tokens.length &&
      (match(TOKEN_TYPES.PlusOperator) || match(TOKEN_TYPES.MinusOperator))
    ) {
      const operatorNode = new ParseNode(
        tokens[currentIndex - 1].type,
        tokens[currentIndex - 1].value
      );
      const rightNode = parseTerm();
      operatorNode.children.push(node, rightNode);
      node = operatorNode;
    }

    return node;
  }

  function parseTerm(): ParseNode {
    let node = parseFactor();

    while (
      currentIndex < tokens.length &&
      (match(TOKEN_TYPES.MultiplyOperator) || match(TOKEN_TYPES.DivideOperator))
    ) {
      const operatorNode = new ParseNode(
        tokens[currentIndex - 1].type,
        tokens[currentIndex - 1].value
      );
      const rightNode = parseFactor();
      operatorNode.children.push(node, rightNode);
      node = operatorNode;
    }

    return node;
  }

  function parseFactor(): ParseNode {
    if (match(TOKEN_TYPES.Number)) {
      return new ParseNode(TOKEN_TYPES.Number, tokens[currentIndex - 1].value);
    } else if (match(TOKEN_TYPES.Identifier)) {
      return new ParseNode(
        TOKEN_TYPES.Identifier,
        tokens[currentIndex - 1].value
      );
    } else if (match(TOKEN_TYPES.LeftParen)) {
      const exprNode = parseExpression();

      if (!match(TOKEN_TYPES.RightParen)) {
        throw new Error(`Expected right parenthesis at index ${currentIndex}`);
      }

      return exprNode;
    } else {
      throw new Error(
        `Unexpected token at index ${currentIndex}: ${tokens[currentIndex].type}`
      );
    }
  }

  return parseProgram();
}
