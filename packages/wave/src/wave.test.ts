import { expect, it } from "bun:test";
import dedent from "dedent";
import { wave } from "./wave";

const sanitize = (template: TemplateStringsArray) =>
  dedent(template).replace(/\s\s+/g, "").replace(/\n/, "");

it("renders a template without attributes", () => {
  const component = wave.div();
  expect(component).toEqual("<div></div>");
});

it("renders a template without attributes, but with inner text", () => {
  const component = wave.div("Test");
  expect(component).toEqual("<div>Test</div>");
});

it("renders a template without nesting", () => {
  const component = wave.div({ class: "flex" });
  expect(component).toEqual('<div class="flex"></div>');
});

it("renders a template with inner text", () => {
  const component = wave.div({ class: "flex" }, "Wave");
  expect(component).toEqual('<div class="flex">Wave</div>');
});

it("renders a template with nested component", () => {
  const child = wave.div({ class: "flex" }, "Wave");
  const parent = wave.div({ class: "flex" }, child);
  expect(parent).toEqual(
    sanitize`
      <div class="flex">
        <div class="flex">Wave</div>
      </div>
    `,
  );
});

it("renders a template with multiple nested component", () => {
  const child1 = wave.div({ class: "flex" }, "Wave 1");
  const child2 = wave.div({ class: "flex" }, "Wave 2");
  const parent = wave.div({ class: "flex" }, [child1, child2]);
  expect(parent).toEqual(
    sanitize`
      <div class="flex">
        <div class="flex">Wave 1</div>
        <div class="flex">Wave 2</div>
      </div>
    `,
  );
});

it("renders a template with multiple nested component as a loop result", () => {
  const output = wave.div({ class: "flex" }, (div) => {
    for (let i = 0; i < 5; i++) {
      div.p("Test");
    }
  });
  expect(output).toEqual(
    sanitize`
      <div class="flex">
        <p>Test</p>
        <p>Test</p>
        <p>Test</p>
        <p>Test</p>
        <p>Test</p>
      </div>
    `,
  );
});

it("allows nesting with just function", () => {
  const output = wave.body((body) => {
    body.button({ type: "submit" }, "Submit");
  });
  expect(output).toEqual(
    sanitize`
      <body>
        <button type="submit">Submit</button>
      </body>
    `,
  );
});

it("renders a template with deep nesting", () => {
  const output = wave.body({ class: "flex flex-col" }, (body) => {
    body.div({ class: "flex flex-col" }, (div) => {
      div.form({ class: "flex flex-col" }, (form) => {
        form.input({ name: "username", required: true });
        form.button({ type: "submit" }, "Submit");
      });
    });
  });
  expect(output).toEqual(
    sanitize`
      <body class="flex flex-col">
        <div class="flex flex-col">
          <form class="flex flex-col">
            <input name="username" required></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      </body>
    `,
  );
});
