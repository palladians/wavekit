type Attributes = { [key: string]: string | boolean };
type ChildCallback = ((element: HTMLElementProxy) => void) | string | string[];

interface HTMLElementProxy {
  [key: string]: (attributes: Attributes, child?: ChildCallback) => string;
}

function createElement(
  tag: string,
  attributes: Attributes,
  child?: ChildCallback,
): string {
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
}

const html: HTMLElementProxy = new Proxy(
  {},
  {
    get: (_, tag) => (attributes: Attributes, child?: ChildCallback) =>
      createElement(tag as string, attributes, child),
  },
);

const component1 = html.div({ class: "p-2" }, "Div element 1");
const component2 = html.div({ class: "p-2" }, "Div element 2");

const output = html.body({ class: "flex flex-col" }, [component1, component2]);

console.log(output);

const output2 = html.body({ class: "flex flex-col" }, (body) => {
  body.div({ class: "flex flex-col" }, (div) => {
    div.form({ class: "flex flex-col" }, (form) => {
      form.input({ name: "username", required: true });
      form.button({ type: "submit" }, "Submit");
    });
  });
});

console.log(output2);
