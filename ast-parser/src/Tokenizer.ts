export enum TokenType {
  Let = "Let",
  Const = "Const",
  Var = "Var",
  Assign = "Assign",
  Function = "Function",
  Number = "Number",
  Operator = "Operator",
  Identifier = "Identifier",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  LeftCurly = "LeftCurly",
  RightCurly = "RightCurly",
  Comma = "Comma",
  Dot = "Dot",
  Semicolon = "Semicolon",
  StringLiteral = "StringLiteral",
  Return = "Return",
  Import = "Import",
  Export = "Export",
  Default = "Default",
  From = "From",
  As = "As",
  Asterisk = "Asterisk",
}

export type Token = {
  type: TokenType;
  value?: string;
  start: number;
  end: number;
  raw?: string;
};

const TOKENS_GENERATOR: Record<string, (...args: any[]) => Token> = {
  let(start: number) {
    return { type: TokenType.Let, value: 'let', start, end: start + 3 }
  },
  const(start: number) {
    return { type: TokenType.Const, value: "const", start, end: start + 5 };
  },
  var(start: number) {
    return { type: TokenType.Var, value: "var", start, end: start + 3 };
  },
  assign(start: number) {
    return { type: TokenType.Assign, value: "=", start, end: start + 1 };
  },
  import(start: number) {
    return {
      type: TokenType.Import,
      value: "import",
      start,
      end: start + 6,
    };
  },
  export(start: number) {
    return {
      type: TokenType.Export,
      value: "export",
      start,
      end: start + 6,
    };
  },
  from(start: number) {
    return {
      type: TokenType.From,
      value: "from",
      start,
      end: start + 4,
    };
  },
  as(start: number) {
    return {
      type: TokenType.As,
      value: "as",
      start,
      end: start + 2,
    };
  },
  asterisk(start: number) {
    return {
      type: TokenType.Asterisk,
      value: "*",
      start,
      end: start + 1,
    };
  },
  default(start: number) {
    return {
      type: TokenType.Default,
      value: "default",
      start,
      end: start + 7,
    };
  },
  number(start: number, value: string) {
    return {
      type: TokenType.Number,
      value,
      start,
      end: start + value.length,
      raw: value,
    };
  },
  function(start: number) {
    return {
      type: TokenType.Function,
      value: "function",
      start,
      end: start + 8,
    };
  },
  return(start: number) {
    return {
      type: TokenType.Return,
      value: "return",
      start,
      end: start + 6,
    };
  },
  operator(start: number, value: string) {
    return {
      type: TokenType.Operator,
      value,
      start,
      end: start + value.length,
    };
  },
  comma(start: number) {
    return {
      type: TokenType.Comma,
      value: ",",
      start,
      end: start + 1,
    };
  },
  leftParen(start: number) {
    return { type: TokenType.LeftParen, value: "(", start, end: start + 1 };
  },
  rightParen(start: number) {
    return { type: TokenType.RightParen, value: ")", start, end: start + 1 };
  },
  leftCurly(start: number) {
    return { type: TokenType.LeftCurly, value: "{", start, end: start + 1 };
  },
  rightCurly(start: number) {
    return { type: TokenType.RightCurly, value: "}", start, end: start + 1 };
  },
  dot(start: number) {
    return { type: TokenType.Dot, value: ".", start, end: start + 1 };
  },
  semicolon(start: number) {
    return { type: TokenType.Semicolon, value: ";", start, end: start + 1 };
  },
  stringLiteral(start: number, value: string, raw: string) {
    return {
      type: TokenType.StringLiteral,
      value,
      start,
      end: start + value.length + 2,
      raw,
    };
  },
  identifier(start: number, value: string) {
    return {
      type: TokenType.Identifier,
      value,
      start,
      end: start + value.length,
    };
  },
}

type SingleCharTokens = "(" | ")" | "{" | "}" | "." | ";" | "," | "*" | "=";


// 单字符到Token生成器的映射
const KNOWN_SINGLE_CHAR_TOKENS = new Map<
  SingleCharTokens,
  typeof TOKENS_GENERATOR[keyof typeof TOKENS_GENERATOR]
>([
  ["(", TOKENS_GENERATOR.leftParen],
  [")", TOKENS_GENERATOR.rightParen],
  ["{", TOKENS_GENERATOR.leftCurly],
  ["}", TOKENS_GENERATOR.rightCurly],
  [".", TOKENS_GENERATOR.dot],
  [";", TOKENS_GENERATOR.semicolon],
  [",", TOKENS_GENERATOR.comma],
  ["*", TOKENS_GENERATOR.asterisk],
  ["=", TOKENS_GENERATOR.assign],
]);

const QUOTATION_TOKENS = ["'", '"', "`"];

const OPERATOR_TOKENS = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "&",
  "|",
  "~",
  "<<",
  ">>",
];

export class Tokenizer {
  private _tokens: Token[] = [];
  private _currentIndex: number = 0;
  private _source: string;
  constructor(input: string) {
    this._source = input
  }

  tokenize(): Token[] {
    while (this._currentIndex < this._source.length) {
      let currentChar = this._source[this._currentIndex];
      const startIndex = this._currentIndex;
      
      // 根据语法规则进行 token 分组
      const isAlpha = (char: string): boolean => {
        return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
      }

      // 1. 处理空格
      if (currentChar === ' ') {
        this._currentIndex++;
        continue;
      }
      // 2. 处理字母
      else if (isAlpha(currentChar)) {
        let identifier = '';
        while(isAlpha(currentChar)) {
          identifier += currentChar;
          this._currentIndex ++;
          currentChar = this._source[this._currentIndex];
        }
        let token: Token;
        if (identifier in TOKENS_GENERATOR) {
          // 如果是关键字
          token = TOKENS_GENERATOR[identifier as keyof typeof TOKENS_GENERATOR](startIndex)
        } else {
          // 如果是普通标识符
          token = TOKENS_GENERATOR["identifier"](startIndex, identifier);
        }
        this._tokens.push(token);
        continue;
      }
      // 3. 处理单字符
      else if (KNOWN_SINGLE_CHAR_TOKENS.has(currentChar as SingleCharTokens)) {
        const token = KNOWN_SINGLE_CHAR_TOKENS.get(
          currentChar as SingleCharTokens
        )!(startIndex);
        this._tokens.push(token);
        this._currentIndex++;
        continue;
      }
    }
    return this._tokens;
  }
}