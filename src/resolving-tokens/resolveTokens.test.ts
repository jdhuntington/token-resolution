import { resolveTokens } from "./resolveTokens";

describe("resolveTokens", () => {
  it("can resolve a literal", () => {
    expect(resolveTokens({}, { value: "abc" })).toEqual({ value: "abc" });
  });

  it("can resolve a color from the theme", () => {
    expect(
      resolveTokens(
        {
          colors: {
            brand: {
              median: 1,
              value: ["#aaa", "#bbb", "#ccc"]
            }
          }
        },
        {
          value: (t: any) => t.colors.brand.value[t.colors.brand.median]
        }
      )
    ).toEqual({ value: "#bbb" });
  });

  it("can resolve a token related to another", () => {
    expect(
      resolveTokens(
        {},
        {
          value: "abc",
          value2: {
            dependsOn: ["value"],
            resolve: (theme: any, [value]: any) => value.value + "def"
          }
        }
      )
    ).toEqual({ value: "abc", value2: "abcdef" });
  });

  it("can resolve a token related to a late resolving dependency", () => {
    expect(
      resolveTokens(
        {
          colors: {
            brand: {
              median: 1,
              value: ["#aaa", "#bbb", "#ccc"]
            }
          }
        },
        {
          value2: {
            dependsOn: ["value"],
            resolve: (theme: any, [value]: any) => value.value + "def"
          },
          value: (t: any) => t.colors.brand.value[0]
        }
      )
    ).toEqual({ value: "#aaa", value2: "#aaadef" });
  });
});
