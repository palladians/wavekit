import { HandlerContext } from "@wavekit/kit";
import { wave } from "@wavekit/wave";

export const GET = (context: HandlerContext) => {
  return context.html(
    wave.body({ class: "flex flex-col" }, (body) => {
      body.div({ class: "flex flex-col" }, (div) => {
        div.form({ class: "flex flex-col" }, (form) => {
          form.input({ name: "username", required: true });
          form.button({ type: "submit" }, "Submit");
        });
      });
    }),
  );
};
