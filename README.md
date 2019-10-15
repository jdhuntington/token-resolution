# How do we resolve tokens?

Tokens are a design-specific construct that enable implementers to override specific aspects
of a component's look and feel. It is expected that tokens will be layered on top of one another.

For example, a base design will establish the set of tokens and their default values. A team
building an application might set a token to a specific value for the entire application. Further,
a component of the application might further customize the component and override yet another aspect
of the look and feel. In this example, there are 3 discrete layers of tokens. It is desireable that
all 3 layers have the ability to affect one another.

This repository is an exploration of how layers might affect one another,
and how various APIs feel to use.

# What do tokens look like?

At the most basic level, tokens are an object literal, or a function that return values from a provided `theme`.
Some obvious implementations of tokens are...

```ts
// return a const set of tokens
const tokens = () => {
  return {
    baseColor: "#fff"
  };
};

// return a set of tokens based on a theme
const tokens = (theme: Theme) => {
  return {
    baseColor: theme.colors.base
  };
};

// return individual tokens based on a theme
const tokens = {
  baseColor: (theme: Theme) => theme.colors.base
};
```

As components are developed, individual layers become separated in time and space. For example, `baseColor` might
be defined in a basic design layer, then overridden in an application-specific implementation of the component.

The semantics of how layers interact and how tokens become dependent on one another is non-trivial, so multiple
prototypes exist to examine approaches.

# Approaches

There are 2 approaches in this repo, `resolving-tokens` and `middleware`. Qualitative "pros and cons" are put forth below.

## Implementation complexity

| Category       | Aspect                | `resolving-tokens`                           | `middleware`                   |
| -------------- | --------------------- | -------------------------------------------- | ------------------------------ |
| Ergonomics     | Feel                  | :x: ([ref](#resolving-tokens-feel))         | :x: ([ref](#middleware-feel)) |
| Functionality  | Interdependent tokens | :white_check_mark:                                         | :white_check_mark:                           |
| Functionality  | Object literals       | :white_check_mark:                                         | :white_check_mark:                           |
| Functionality  | Theme based values    | :white_check_mark:                                         | :white_check_mark:                           |
| Functionality  | Token modification    | :x: ([ref](#resolving-tokens-modification)) | :white_check_mark:                           |
| Implementation | Complexity            | :white_check_mark:                                         | :white_check_mark:                           |

### resolving-tokens-feel

The interface for a token is a bit fuzzy when it comes to the "dependency description". It does feel
similar in spirit to using react hooks, but prevents the use a type checker.

```ts
const t = { value: "abc" }; // constant

const t = { value: (t: any) => t.colors.brand.value[0] }; // lambda

const t = {
  // dependency description
  value2: {
    dependsOn: ["value"],
    resolve: (theme: any, [value]: any) => value.value + "def"
  }
};
```

### middleware-feel

Middleware pulls ideas from web server middleware, where each layer has the ability to influence the behavior
before and after layers "below" it in the stack.

It allows for more flexibility, but at the cost of higher complexity.

```ts
const t = { value: "abc" }; // constant;

const t = (theme: any) => {
  // function
  return {
    value: theme.colors.brand
  };
};

const t = (theme: any, baseTokens: ResolvedTokens, next: TokenCallback) => {
  // next is the token generator for the layer being composed.
  // with this, the "top" component gets the ability to modify tokens that
  // are used in computation in lower layers, as well as the ability to override
  // any results.
  const tokens = next(baseTokens);
  return {
    ...tokens,
    value2: tokens.value + "def"
  };
};
```

### resolving-tokens-modification

It is a reasonable scenario that for a given component, an implementer would want to define
a token's value as "some contstant larger than it was in a lower layer". For instance (in pseudocode): `fontSize: previousFontSize + 2px;`

In the `resolving-tokens` model, all layers are flattened into a single dictionary, **then** tokens are evaluated. This prevents a
component from seeing what value a token had before it was redefined.
