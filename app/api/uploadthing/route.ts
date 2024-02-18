import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

const config = {};
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ...config },
});
