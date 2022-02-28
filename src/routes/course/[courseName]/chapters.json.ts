import type { RequestHandler } from "@sveltejs/kit";
import fs from "fs";
import matter from 'gray-matter';
import path, { join } from "path";
import { fileURLToPath } from 'url';

export const get: RequestHandler = async ({ params }) => {

  // Import all .svx files in the directory
  const { courseName } = params;
  console.log(import.meta.url);
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  console.log(dirname);
  const chapters = fs.readdirSync(join(dirname, `../${ courseName }`) ).map(chapterName => {
    let chapterFullName = chapterName;
    let lessons = [];

    fs.readdirSync(join(dirname, `../${ courseName }/${ chapterName }`)).forEach(lessonFile => {
      if (lessonFile === "_index.md") {
        const post = fs.readFileSync(
          join(dirname, `../${ courseName }/${ chapterName }/${ lessonFile }`),
          "utf-8"
        );
        const { data } = matter(post)
        chapterFullName = data.title;
        return;
      }
      const post = fs.readFileSync(
        join(dirname, `../${ courseName }/${ chapterName }/${ lessonFile }`),
        "utf-8"
      );
      lessons.push({
        ...matter(post).data,
        path: `${ courseName }/${ chapterName }/${ path.basename(lessonFile, ".md") }`
      });
    });

    lessons.sort((a, b) => a.weight - b.weight);

    return { chapterName: chapterFullName, lessons };
  });


  return {
    body: { chapters }
  };
};
