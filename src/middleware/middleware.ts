export type TokenDefinition = any;

export type ResolvedTokens = { [name: string]: any };

export type TokenSet = TokenDefinition[];

export const resolveTokens = (
  theme: any,
  tokenSet: TokenSet
): ResolvedTokens => {
  const thisToken = tokenSet[0];
  if (typeof thisToken === "function") {
    return thisToken(theme);
  }
  return tokenSet[0];
};
