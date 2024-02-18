import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ...config },
});

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method === "DELETE") {
//       // Parse the request body
//       const data = req.body;
//       // Extract the file URL from the request body
//       const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
//       // Initialize UTApi
//       const utapi = new UTApi();
//       // Call deleteFiles method
//       await utapi.deleteFiles(newUrl);
//       // Send a success response
//       res.status(200).json({ message: "ok" });
//     } else {
//       // If the HTTP method is not DELETE, send an error response
//       res.status(405).json({ message: "Method Not Allowed" });
//     }
//   } catch (error) {
//     // If an error occurs, send an error response
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
