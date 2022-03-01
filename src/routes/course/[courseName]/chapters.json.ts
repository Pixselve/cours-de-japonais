import type { RequestHandler } from '@sveltejs/kit';
import getCourses from "../../../utils/getCourses";

export const get: RequestHandler = async ({ params }) => {
  const {courseName} = params;
  const parts = await getCourses();
  const part = parts.find(value => value.id === courseName);
  if (part === undefined) return {status: 404}


  return {
    body: JSON.stringify({ ...part })
  };
};
