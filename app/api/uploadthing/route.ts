import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ...config },
});

// export async function DELETE(request: Request) {
//   try {
//     const data = await request.json();
//     const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
//     const utapi = new UTApi();
//     await utapi.deleteFiles(newUrl);

//     return new Response(JSON.stringify({ message: "OK" }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
