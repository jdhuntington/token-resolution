export type TokenDefinition = any;

export type ResolvedTokens = { [name: string]: any };

export type TokenSet = TokenDefinition[];

export type TokenFn = (
  theme: any,
  tokens: ResolvedTokens,
  next: TokenCallback
) => ResolvedTokens;

export type TokenCallback = (resolvedTokens: ResolvedTokens) => ResolvedTokens;

export const resolveTokens = (
  theme: any,
  tokenSet: TokenSet
): ResolvedTokens => {
  const tokenFns = extractTokenCallbacks(tokenSet);

  let index = tokenFns.length - 1;

  const nextFactory = (tokens: ResolvedTokens): ResolvedTokens => {
    index--;
    const nextFn: TokenFn =
      index >= 0
        ? tokenFns[index]
        : (_0: any, resolvedTokens: ResolvedTokens, _2: any): ResolvedTokens =>
            resolvedTokens;
    return nextFn(theme, tokens, nextFactory);
  };
  return tokenFns[index](theme, {}, nextFactory);
};

function extractTokenCallbacks(tokenSet: any[]) {
  return tokenSet.map(
    (x: TokenDefinition): TokenFn => {
      if (typeof x === "object") {
        return (theme: any, tokens: ResolvedTokens, next: TokenCallback) => {
          const baseTokens = next({});
          return {
            ...baseTokens,
            ...x
          };
        };
      }
      if (typeof x === "function") {
        if (x.length === 1 || x.length === 2) {
          return (theme: any, tokens: ResolvedTokens, next: TokenCallback) => {
            const resolvedTokens = next(tokens);
            console.log({ resolvedTokens, tokens });
            return {
              ...resolvedTokens,
              ...x(theme, resolvedTokens)
            };
          };
        }
        if (x.length === 3) {
          return x;
        }
      }
      throw new Error("Unknown token type.");
    }
  );
}
