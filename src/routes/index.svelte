<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, url }) => {
		const data = await fetch('/course.json').then((value) => value.json());
		console.log(data);
		return {
			props: {
				courses: data
			}
		};
	};
</script>

<script lang="ts">
	import type { Course } from '../utils/getCourses';

	export let courses: Course[];
</script>

<h1 class="font-bold">Liste des cours WIP 👷‍</h1>

<ol class="list-decimal">
	{#each courses as course}
		<li>
			{course.title}
			<ul class="ml-5">
				{#each course.chapters as chapter}
					<li>
						{chapter.title}
						<ul class="ml-5">
							{#each chapter.children as child}
								<li>
									<a class="text-blue-600 hover:underline" href={`course${child.path}`}
										>{child.title}</a
									>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ol>
