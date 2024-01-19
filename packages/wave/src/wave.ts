export type Attributes = { [key: string]: string | boolean };
type ChildCallback = ((element: HTMLElementProxy) => void) | string | string[];

export interface HTMLElementProxy {
  [key: string]: {
    (attributes: Attributes, child?: ChildCallback): string;
    (child: ChildCallback): string; // Overload for just a ChildCallback
    (text?: string): string;
  };
}

const createElement = <T extends Attributes = Attributes>(
  tag: string,
  attributesOrChild?: T | ChildCallback,
  child?: ChildCallback,
): string => {
  let attributes: T | undefined;
  let content = "";

  if (typeof attributesOrChild === "function") {
    const childElements: string[] = [];
    const proxy: HTMLElementProxy = new Proxy(
      {},
      {
        get:
          (_, childTag) =>
          (childAttributes?: Attributes, grandChild?: ChildCallback) => {
            const element = createElement(
              childTag as string,
              childAttributes,
              grandChild,
            );
            childElements.push(element);
            return element;
          },
      },
    );
    attributesOrChild(proxy);
    content = childElements.join("");
  } else if (typeof attributesOrChild === "string") {
    content = attributesOrChild;
  } else if (
    typeof attributesOrChild === "object" &&
    !Array.isArray(attributesOrChild)
  ) {
    attributes = attributesOrChild;
  }

  if (typeof child === "function") {
    const childElements: string[] = [];
    const proxy: HTMLElementProxy = new Proxy(
      {},
      {
        get:
          (_, childTag) =>
          (childAttributes?: Attributes, grandChild?: ChildCallback) => {
            const element = createElement(
              childTag as string,
              childAttributes,
              grandChild,
            );
            childElements.push(element);
            return element;
          },
      },
    );
    child(proxy);
    content += childElements.join("");
  } else if (typeof child === "string") {
    content += child;
  } else if (Array.isArray(child)) {
    content += child.join("");
  }

  const attrs = attributes
    ? Object.entries(attributes)
        .map(([key, value]) =>
          typeof value === "boolean" && value ? key : `${key}="${value}"`,
        )
        .join(" ")
    : "";

  return `<${tag}${attrs ? " " + attrs : ""}>${content}</${tag}>`;
};

export const buildWave = <
  T extends Attributes = Attributes,
>(): HTMLElementProxy =>
  new Proxy(
    {},
    {
      get:
        (_, tag) =>
        (attributesOrChild?: T | ChildCallback, child?: ChildCallback) =>
          createElement<T>(tag as string, attributesOrChild, child),
    },
  );

export const wave: HTMLElementProxy = buildWave<Attributes>();
