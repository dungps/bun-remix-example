import { json } from "@remix-run/node";

export const ALL = (request: Request) => {
  return json({
    message: "Hello world",
  });
};
