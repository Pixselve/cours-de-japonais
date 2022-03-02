<script>
	import PlayerFactory from 'youtube-player';
	import { onMount } from 'svelte';
	import { doneCourses } from '../stores/courseProgress';
	import { beforeNavigate } from '$app/navigation';

	export let videoID;
	export let title;

	let playerElement;

	let player;
	let videoDuration = 0;
	let checkIfCompletedTimeout;
	onMount(async () => {
		player = PlayerFactory(playerElement);
		videoDuration = await player.getDuration();
		player.on('stateChange', (event) => {
			if ($doneCourses.has(videoID)) return;
			switch (event.data) {
				case 0:
					markVideoAsWatched();
					clearInterval(checkIfCompletedTimeout);
					break;
				case 1:
					checkIfCompletedTimeout = setInterval(async () => {
						try {
							if (await checkIfCompleted()) {
								markVideoAsWatched();
								clearInterval(checkIfCompletedTimeout);
							}
						} catch (e) {
							clearInterval(checkIfCompletedTimeout);
						}
					}, 10000);
					break;
				case 2:
					clearInterval(checkIfCompletedTimeout);
					break;
				default:
					clearInterval(checkIfCompletedTimeout);
					break;
			}
		});
	});

	beforeNavigate(async () => {
		clearInterval(checkIfCompletedTimeout);
		if (await checkIfCompleted()) {
			markVideoAsWatched();
		}
	});

	/**
	 * Check if the user has watch at least 85% of the video
	 */
	const checkIfCompleted = async () => {
		const currentTime = await player.getCurrentTime();
		const percentage = (currentTime / videoDuration) * 100;
		console.log(`⏳ ${Math.round(percentage)}% watched`);
		return percentage >= 85;
	};
	/**
	 * Mark the video as watched
	 */
	const markVideoAsWatched = () => {
		doneCourses.update((value) => value.add(videoID));
	};
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main>
	<iframe
		bind:this={playerElement}
		class="aspect-video w-full rounded-3xl overflow-hidden block shadow-xl"
		src={`https://www.youtube-nocookie.com/embed/${videoID}?enablejsapi=1`}
		title="YouTube video player"
		frameborder="0"
		allowfullscreen
	/>

	<div class="flex items-center space-x-2 mt-5">
		<img
			class="h-14 aspect-square rounded-full"
			src="https://pbs.twimg.com/profile_images/777901438039166976/1LHJraAk.jpg"
			alt=""
		/>
		<div>
			<div class="font-medium">Julien Fontanier</div>
			<div class="text-black/50">@JulienFontanier</div>
		</div>
	</div>

	<main class="space-y-5 mt-10">
		<h1 class="text-4xl font-bold">{title}</h1>
		<div class="prose-sm max-w-full">
			<slot />
		</div>
	</main>
</main>
