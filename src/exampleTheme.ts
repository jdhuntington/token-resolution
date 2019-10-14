export const exampleTheme = {
  colors: {
    brand: {
      median: 5, // index to median
      values: [
        "#F4F4FC", // siteVariables.brand16, same as prev
        "#E5E5F1", // brand15
        "#E2E2F6", // 100, light brand14, dark theme brand02
        "#BDBDE6", // 200, light brand12, dark theme brand04
        "#A6A7DC", // dark theme brand06 (dark06)
        "#9EA2FF",
        "#8B8CC7", // light08, dark08
        "#6264A7", // 500, siteVariables.brand, siteVariables.brand06, dark theme brand, brand12
        "#585A96", // light05
        "#464775", // light04, dark14
        "#33344A", // siteVariables.brand02, dark theme brand16, same as 900 prev
        "#373644"
      ]
    }
  },

  colorDeltas: {
    hovered: 4,
    pressed: 5,
    disabled: -2
  },

  sizing: {
    base: 4,
    scale: 1,
    unit: "px"
  },

  components: {
    Checkbox: {
      tokens: {
        background: {
          type: "color",
          value: "brand"
        },

        gap: {
          type: "sizing",
          value: 3
        },

        hover: "#123",

        valueFromTheme: {
          type: "color",
          value: "brand",
          delta: "hovered"
        },

        boxSize: 16,

        iconSize: {
          type: "token",
          dependsOn: "boxSize",
          resolve: ({ value }) => value - 2
        }

        // // Literal value
        // boxSize: {
        //   type: 'sizing',
        //   value: 4
        // },

        // // Single lookup value.
        // single: {
        //   relativeTo: "relativeToBoxSize"
        // },

        // // Single lookup
        // singleInArray: {
        //   relativeTo: ["single"]
        // },

        // // With resolver
        // relativeToBoxSize: {
        //   type: "sizing",
        //   dependsOn: ["boxSize"],
        //   resolve: (theme, value, [boxSize]) => boxSize - 2
        // },
      }
    }
  }
};
