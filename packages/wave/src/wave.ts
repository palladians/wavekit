export type Attributes = { [key: string]: string | boolean };
type ChildCallback = ((element: HTMLElementProxy) => void) | string | string[];

export interface HTMLElementProxy {
  [key: string]: {
    (attributes: Attributes, child?: ChildCallback): string;
    (text?: string): string;
  };
}

const createElement = <T extends Attributes = Attributes>(
  tag: string,
  attributesOrText?: T | string,
  child?: ChildCallback,
): string => {
  let attributes: T | undefined;
  if (typeof attributesOrText === "string") {
    child = attributesOrText;
  } else {
    attributes = attributesOrText;
  }

  const attrs =
    attributes &&
    Object.entries(attributes)
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
          (childAttributes?: Attributes, grandChild?: ChildCallback) => {
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

  return `<${tag}${attrs ? " " + attrs : ""}>${content}</${tag}>`;
};

export const buildWave = <
  T extends Attributes = Attributes,
>(): HTMLElementProxy =>
  new Proxy(
    {},
    {
      get: (_, tag) => (attributesOrText?: T | string, child?: ChildCallback) =>
        createElement<T>(tag as string, attributesOrText, child),
    },
  );

export const wave: HTMLElementProxy = buildWave<Attributes>();
