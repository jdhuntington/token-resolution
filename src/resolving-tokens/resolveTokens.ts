interface Token {
  resolve(theme: any): void;
  value: any;
}

class StringToken implements Token {
  constructor(public name: string, public value: string) {}
  resolve(theme: any): void {}
}

class FunctionToken implements Token {
  public value: any;
  constructor(public name: string, public valueFn: (theme: any) => any) {}

  resolve(theme: any): void {
    this.value = this.valueFn(theme);
  }
}

class TokenFactory {
  static from(rawToken: any, name: string): Token {
    if (typeof rawToken === "string") {
      return new StringToken(name, rawToken);
    }
    if (typeof rawToken === "function") {
      return new FunctionToken(name, rawToken);
    }
    throw new Error("Unknown token type");
  }
}

type TokenDict = { [name: string]: Token };

export const resolveTokens = (theme: any, sourceTokens: any) => {
  const tokens: TokenDict = {};

  for (let tokenName in sourceTokens) {
    tokens[tokenName] = TokenFactory.from(sourceTokens[tokenName], tokenName);
  }

  for (let i = 0; i < 10; i++) {
    for (let tokenName in tokens) {
      tokens[tokenName].resolve(theme);
    }
  }

  const result: any = {};
  for (let tokenName in tokens) {
    result[tokenName] = tokens[tokenName].value;
  }

  return result;
};
