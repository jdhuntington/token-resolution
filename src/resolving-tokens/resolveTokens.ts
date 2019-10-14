const firstDefined = (...args) => {
  for (let arg of args) {
    if (typeof arg !== "undefined") {
      return arg;
    }
  }
  return undefined;
};

const resolveToken = (tokenDefinition, theme, tokens) => {};

const isTokenResolved = tokenValue => {
  const tokenType = typeof tokenValue;

  return tokenType === "number" || tokenType === "string";
};

export const resolveTokens = (theme, sourceTokens) => {
  const resolvedTokens = {};

  for (let i = 0; i < 10; i++) {
    let anyUnresolved = false;

    // Iterate through source tokens.
    for (let tokenName in sourceTokens) {
      const sourceValue = sourceTokens[tokenName];

      if (!resolvedTokens[tokenName]) {
      }

      let tokenValue = (resolvedTokens[tokenName] = firstDefined(
        resolvedTokens[tokenName],
        sourceTokens[tokenName]
      ));
      const tokenType = typeof tokenValue;

      // If we have literal, copy it to the resolved set.
      if (tokenType === "object") {
        resolvedTokens[tokenName] = resolveToken(
          tokenValue,
          theme,
          resolvedTokens
        );
      } else if (tokenType === "function") {
        resolvedTokens[tokenName] = tokenValue(theme, resolvedTokens);
      }

      anyUnresolved =
        anyUnresolved || !isTokenResolved(resolvedTokens[tokenName]);
    }

    if (!anyUnresolved) {
      return resolvedTokens;
    }
  }

  return resolvedTokens;
};

const color = value => ({
  type: "color",
  value
});

const hoverOn = value => ({});

const textColor = value => ({
  type: "color",
  value
});
