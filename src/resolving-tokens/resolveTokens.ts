type TokenDict = { [name: string]: Token };

interface Token {
  resolve(theme: any): void;
  value: any;
  isResolvable: boolean;
  isResolved: boolean;
}

class StringToken implements Token {
  public isResolvable = true;
  public isResolved = true;

  constructor(
    private tokens: TokenDict,
    public name: string,
    public value: string
  ) {}
  resolve(theme: any): void {}
}

class FunctionToken implements Token {
  private _isResolved: boolean = false;

  static fromFunction(tokens: TokenDict, name: string, rawToken: any): Token {
    return new FunctionToken(tokens, name, rawToken, []);
  }

  static fromObject(tokens: TokenDict, name: string, rawToken: any): Token {
    return new FunctionToken(
      tokens,
      name,
      rawToken.resolve,
      rawToken.dependsOn
    );
  }

  constructor(
    private tokens: TokenDict,
    public name: string,
    public valueFn: (theme: any, tokenVals?: any[]) => any,
    public deps: string[]
  ) {}

  public value: any;

  resolve(theme: any): void {
    this.value = this.valueFn(theme, this.deps.map(d => this.tokens[d]));
    this._isResolved = true;
  }

  get isResolvable(): boolean {
    return this.deps.every(e => this.tokens[e].isResolved);
  }

  get isResolved(): boolean {
    return this._isResolved;
  }
}

class TokenFactory {
  static from(tokens: TokenDict, rawToken: any, name: string): Token {
    if (typeof rawToken === "string") {
      return new StringToken(tokens, name, rawToken);
    }
    if (typeof rawToken === "function") {
      return FunctionToken.fromFunction(tokens, name, rawToken);
    }
    if (typeof rawToken === "object") {
      return FunctionToken.fromObject(tokens, name, rawToken);
    }
    throw new Error("Unknown token type");
  }
}

export const resolveTokens = (theme: any, sourceTokens: any) => {
  const tokens: TokenDict = {};

  for (let tokenName in sourceTokens) {
    tokens[tokenName] = TokenFactory.from(
      tokens,
      sourceTokens[tokenName],
      tokenName
    );
  }

  while (true) {
    let allResolved = true;
    let progressed = false;

    for (let tokenName in tokens) {
      const token = tokens[tokenName];
      if (token.isResolved) {
        continue;
      }
      allResolved = false;
      if (!token.isResolvable) {
        continue;
      }
      token.resolve(theme);
      progressed = true;
    }
    if (allResolved) {
      break;
    }
    if (!progressed) {
      throw new Error("Token deadlock");
    }
  }

  const result: any = {};
  for (let tokenName in tokens) {
    result[tokenName] = tokens[tokenName].value;
  }

  return result;
};
