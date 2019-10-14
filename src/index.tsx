import { exampleTheme } from "./exampleTheme";
import { resolveTokens } from "./resolveTokens";

console.log(
  resolveTokens(exampleTheme, exampleTheme.components.Checkbox.tokens)
);
