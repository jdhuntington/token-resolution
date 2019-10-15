export type TokenDefinition = any;

export type ResolvedTokens = { [name: string]: any };

export type TokenSet = TokenDefinition[];

export const resolveTokens = (
  theme: any,
  tokenSet: TokenSet
): ResolvedTokens => {
  return tokenSet[0];
};
