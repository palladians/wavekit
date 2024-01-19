import { HandlerContext } from "@wavekit/kit";
import { wave } from "@wavekit/wave";

export const GET = (context: HandlerContext) => {
  return context.html(
    wave.body({ class: "flex flex-col" }, (body) => {
      body.div({ class: "flex flex-col" }, (div) => {
        div.form(
          {
            action: "?action=createUser",
            method: "POST",
            class: "flex flex-col",
          },
          (form) => {
            form.input({ name: "username", required: true });
            form.button({ type: "submit" }, "Submit");
          },
        );
      });
    }),
  );
};

export const POST = async (context: HandlerContext) => {
  const { searchParams } = new URL(context.req.url);
  const action = searchParams.get("action");
  switch (action) {
    case "createUser":
      const fakeNewUser = {
        id: 1,
        username: "squishy",
        email: "test@test.com",
      };
      console.log(fakeNewUser);
      return context.redirect(context.req.url, 302);
  }
};
