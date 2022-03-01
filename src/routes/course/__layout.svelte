<main class="bg-gray-100 min-h-screen grid grid-cols-[350px_auto]">
  <section class="h-screen p-4">
    <nav class="p-5 bg-white rounded-3xl shadow-xl max-h-full space-y-5 overflow-y-auto">
      <h1 class="font-black text-xl">{course.title}</h1>
      <div class="border-b"></div>

      <section class="space-y-5 text-sm">
        {#each course.chapters as chapter}
          <h2 class="font-bold text-black/50">{chapter.title}</h2>
          <ol class="space-y-5">
            {#each chapter.children as lesson, index}
              <li>
                <a class="font-bold flex items-center space-x-4" href={"/course" + lesson.path}>
                  <div class="text-3xl">
                    {index + 1}
                  </div>
                  <div class="flex-grow space-y-2">
                    <div>{lesson.title}</div>
                    <div class="text-black/50">01:35</div>
                  </div>
                  {#if $doneCourses.has(lesson.videoID)}
                  <div>
                    <svg class="h-7 rounded-full p-1 fill-white bg-green-500" viewBox="0 0 24 24">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                  </div>
                    {/if}
                </a>
              </li>
            {/each}
          </ol>
        {/each}
      </section>

    </nav>
  </section>
  <section class="p-4 h-screen overflow-y-scroll">
    <slot/>
  </section>

</main>

<script lang="ts">

import { doneCourses } from "../../stores/courseProgress";
import type { Course } from "../../utils/getCourses";

export let course: Course;
</script>

<script lang="ts" context="module">
import type { Load } from "@sveltejs/kit";

export const load: Load = async ({ fetch, url }) => {
  const { pathname } = url;
  // use the regex /^\/course\/([a-zA-Z0-9\-\.]+)\/.*$/g in pathname and extract group 1
  const regex = new RegExp(/^\/course\/([a-zA-Z0-9\-\.]+)\/.*$/g);
  const match = regex.exec(pathname);
  const course = match && match[1];
  const body = await fetch(`/course/${ course }/chapters.json`).then(value => value.json());
  return {
    props: {
      course: body
    }
  };
};
</script>
