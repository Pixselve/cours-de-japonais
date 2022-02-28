import type { RequestHandler } from "@sveltejs/kit";
import fs from "fs";
import matter from 'gray-matter';
import path from "path";

export const get: RequestHandler = async ({ params }) => {

  // Import all .svx files in the directory
  const { courseName } = params;
  const chapters = fs.readdirSync(`src/routes/course/${ courseName }`).map(chapterName => {
    let chapterFullName = chapterName;
    let lessons = [];

    fs.readdirSync(`src/routes/course/${ courseName }/${ chapterName }`).forEach(lessonFile => {
      if (lessonFile === "_index.md") {
        const post = fs.readFileSync(
          `src/routes/course/${ courseName }/${ chapterName }/${ lessonFile }`,
          "utf-8"
        );
        const { data } = matter(post)
        chapterFullName = data.title;
        return;
      }
      const post = fs.readFileSync(
        `src/routes/course/${ courseName }/${ chapterName }/${ lessonFile }`,
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
