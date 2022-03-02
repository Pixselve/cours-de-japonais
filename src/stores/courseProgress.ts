import { writable } from 'svelte/store';
import { browser } from '$app/env';

let initialValue = browser
	? new Set<string>(JSON.parse(window.localStorage.getItem('courseProgress')))
	: new Set<string>();
export const doneCourses = writable<Set<string>>(initialValue);

doneCourses.subscribe((value) => {
	if (browser) {
		localStorage.courseProgress = JSON.stringify(Array.from(value));
	}
});
