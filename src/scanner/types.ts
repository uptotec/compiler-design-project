export enum TOKEN_TYPES {
  LeftParen = 'T_LeftParen',
  RightParen = 'T_RightParen',
  PlusOperator = 'T_PlusOperator',
  MinusOperator = 'T_MinusOperator',
  MultiplyOperator = 'T_MultiplyOperator',
  DivideOperator = 'T_DivideOperator',
  EqualOperator = 'T_EqualOperator',
  AssignOperator = 'T_AssignOperator',
  SIMICOLON = 'T_Semicolon',
  LessThanOperator = 'T_LessThanOperator',
  LessThanOrEqualOperator = 'T_LessThanOrEqualOperator',
  GreaterThanOperator = 'T_GreaterThanOperator',
  GreaterThanOrEqualOperator = 'T_GreaterThanOrEqualOperator',
  Identifier = 'T_Identifier',
  Number = 'T_Number',
  READ = 'T_READ',
  WRITE = 'T_WRITE',
  IF = 'T_IF',
  ELSE = 'T_ELSE',
  THEN = 'T_THEN',
  END = 'T_END',
  REPEAT = 'T_REPEAT',
  UNTIL = 'T_UNTIL',
}

export type Token = {
  type: TOKEN_TYPES;
  value: string;
};

export enum ScannerStates {
  Start,
  Text,
  Number,
  AssignOperator,
  Comment,
  LessThanOrEqualOperator,
  GreaterThanOrEqualOperator,
}

export class ParseNode {
  public name: string;
  public attributes: Record<string, string | number | boolean>;
  public children: ParseNode[];

  constructor(
    public type: string,
    public value?: any,
    children: ParseNode[] = []
  ) {
    this.name = type;
    if (value) this.attributes = { lexeme: value };
    else this.attributes = {};
    this.children = children;
  }
}
