export type TokenDefinition = any;

export type ResolvedTokens = { [name: string]: any };

export type TokenSet = TokenDefinition[];

export const resolveTokens = (
  theme: any,
  tokenSet: TokenSet
): ResolvedTokens => {
  let resolvedTokens: ResolvedTokens = {};
  tokenSet.forEach(token => {
    if (typeof token === "function") {
      resolvedTokens = token(theme, resolvedTokens);
    } else {
      resolvedTokens = token;
    }
  });
  return resolvedTokens;
};
