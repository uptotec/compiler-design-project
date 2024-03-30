const tokens = {
  Begin: 1,
  Call: 1,
  Declare: 1,
  End: 1,
  Do: 1,
  Else: 1,
  EndIf: 1,
  EndUntil: 1,
  EndWhile: 1,
  If: 1,
  Integer: 1,
  Parameters: 1,
  Procedure: 1,
  Program: 1,
  Read: 1,
  Real: 1,
  Set: 1,
  Then: 1,
  Until: 1,
  While: 1,
  Write: 1,
  Dot: '.',
  Semicolon: ';',
  Comma: ',',
  LParanthesis: '(',
  RParanthesis: ')',
  EqualOp: '=',
  LessThanOp: '<',
  GreaterThanOp: '>',
  NotEqualOp: '!=',
  PlusOp: '+',
  MinusOp: '-',
  MultiplyOp: '*',
  DivideOp: '/',
  Identifier: 1,
  Var: 1,
  Constant: 1,
  Undefined: 1,
};
const inputCode = 'Begin      Var hello hello2 + + = While';
const lexemesAndTokensTable = {};
for (const token in tokens) lexemesAndTokensTable[token] = [];

cleanedInputCode = inputCode.split(' ');
cleanedInputCode = cleanedInputCode.filter(
  (lexeme) => ![' ', ''].includes(lexeme)
);

for (const [i, lexeme] of cleanedInputCode.entries()) {
  if (tokens[lexeme] === 1) {
    lexemesAndTokensTable[lexeme].push(lexeme);
    continue;
  }
  let foundToken = false;
  for (const token in tokens) {
    if (tokens[token] === lexeme) {
      lexemesAndTokensTable[token].push(lexeme);
      foundToken = true;
    }
    if (foundToken) break;
  }
  if (foundToken) continue;
  if (cleanedInputCode?.[i - 1] === 'Var') {
    lexemesAndTokensTable.Identifier.push(lexeme);
  } else lexemesAndTokensTable.Undefined.push(lexeme);
}
console.log(lexemesAndTokensTable);
