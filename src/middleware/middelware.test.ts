import {
  resolveTokens,
  ResolvedTokens,
  TokenFn,
  TokenCallback
} from "./middleware";

const theme = {
  colors: {
    brand: {
      median: 1,
      value: ["#aaa", "#bbb", "#ccc"]
    }
  }
};
describe("resolveTokens", () => {
  it("can resolve a literal", () => {
    expect(resolveTokens({}, [{ value: "abc" }])).toEqual({ value: "abc" });
  });

  it("can resolve a color from the theme", () => {
    expect(
      resolveTokens(theme, [
        (t: any) => {
          return {
            value: t.colors.brand.value[t.colors.brand.median]
          };
        }
      ])
    ).toEqual({ value: "#bbb" });
  });
  it("can resolve a token with a late resolving dependency", () => {
    expect(
      resolveTokens({}, [
        {
          value: "abc"
        },
        (theme: any, baseTokens: ResolvedTokens, next: TokenCallback) => {
          const tokens = next(baseTokens);
          return {
            ...tokens,
            value2: tokens.value + "def"
          };
        }
      ])
    ).toEqual({ value: "abc", value2: "abcdef" });
  });

  it("can resolve a token with an early resolving dependency", () => {
    expect(
      resolveTokens(theme, [
        (theme: any, tokens: ResolvedTokens) => {
          console.log({ tokens });
          return {
            ...tokens,
            value2: tokens.value + "def"
          };
        },
        (t: any, tokens: ResolvedTokens, next: TokenCallback) => {
          return next({
            ...tokens,
            value: t.colors.brand.value[t.colors.brand.median]
          });
        }
      ])
    ).toEqual({ value: "#bbb", value2: "#bbbdef" });
  });
});
