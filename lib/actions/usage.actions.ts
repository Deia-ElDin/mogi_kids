import { connectToDb } from "../database";
import { handleError } from "../utils";
import Usage from "../database/models/usage.model";

export async function getUsage() {
  try {
    await connectToDb();

    const usage = await Usage.findOne();
    return JSON.parse(JSON.stringify(usage));
  } catch (error) {
    handleError(error);
  }
}
