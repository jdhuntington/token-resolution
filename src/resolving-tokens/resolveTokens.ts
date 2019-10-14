const firstDefined = (...args: any[]) => {
  for (let arg of args) {
    if (typeof arg !== "undefined") {
      return arg;
    }
  }
  return undefined;
};

const resolveToken = (tokenDefinition: any, theme: any, tokens: any) => {};

const isTokenResolved = (tokenValue: any) => {
  const tokenType = typeof tokenValue;

  return tokenType === "number" || tokenType === "string";
};

export const resolveTokens = (theme: any, sourceTokens: any) => {
  const resolvedTokens = {};

  for (let i = 0; i < 10; i++) {
    let anyUnresolved = false;

    // Iterate through source tokens.
    for (let tokenName in sourceTokens) {
      const sourceValue = sourceTokens[tokenName];

      if (!(resolvedTokens as any)[tokenName]) {
      }

      let tokenValue = ((resolvedTokens as any)[tokenName] = firstDefined(
        (resolvedTokens as any)[tokenName],
        sourceTokens[tokenName]
      ));
      const tokenType = typeof tokenValue;

      // If we have literal, copy it to the resolved set.
      if (tokenType === "object") {
        (resolvedTokens as any)[tokenName] = resolveToken(
          tokenValue,
          theme,
          resolvedTokens
        );
      } else if (tokenType === "function") {
        (resolvedTokens as any)[tokenName] = tokenValue(theme, resolvedTokens);
      }

      anyUnresolved =
        anyUnresolved || !isTokenResolved((resolvedTokens as any)[tokenName]);
    }

    if (!anyUnresolved) {
      return resolvedTokens;
    }
  }

  return resolvedTokens;
};

const color = (value: any) => ({
  type: "color",
  value
});

const hoverOn = (value: any) => ({});

const textColor = (value: any) => ({
  type: "color",
  value
});
