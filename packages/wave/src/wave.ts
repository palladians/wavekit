type Attributes = { [key: string]: string | boolean };
type ChildCallback = ((element: HTMLElementProxy) => void) | string | string[];

interface HTMLElementProxy {
  [key: string]: (attributes: Attributes, child?: ChildCallback) => string;
}

const createElement = (
  tag: string,
  attributes: Attributes,
  child?: ChildCallback,
): string => {
  const attrs = Object.entries(attributes)
    .map(([key, value]) =>
      typeof value === "boolean" && value ? key : `${key}="${value}"`,
    )
    .join(" ");

  let content = "";
  if (typeof child === "function") {
    const childElements: string[] = [];
    const proxy: HTMLElementProxy = new Proxy(
      {},
      {
        get:
          (_, childTag) =>
          (childAttributes: Attributes, grandChild?: ChildCallback) => {
            childElements.push(
              createElement(childTag as string, childAttributes, grandChild),
            );
            return "";
          },
      },
    );
    child(proxy);
    content = childElements.join("");
  } else if (typeof child === "string") {
    content = child;
  } else if (Array.isArray(child)) {
    content = child.join("");
  }

  return `<${tag} ${attrs}>${content}</${tag}>`;
};

export const wave: HTMLElementProxy = new Proxy(
  {},
  {
    get: (_, tag) => (attributes: Attributes, child?: ChildCallback) =>
      createElement(tag as string, attributes, child),
  },
);
