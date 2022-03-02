export interface Child {
	videoID: string;
	title: string;
	weight: number;
	path: string;
}

export interface Chapter {
	title: string;
	path: string;
	children: Child[];
	id: string;
	weight: number;
}

export interface Course {
	title: string;
	chapters: Chapter[];
	id: string;
}

export default async function getCourses(): Promise<Course[]> {
	const postPromises = [];
	const modules = import.meta.glob(`../routes/course/**/*.md`);
	for (let [path, resolver] of Object.entries(modules)) {
		const promise = resolver().then((post) => ({
			...post.metadata,
			path
		}));

		postPromises.push(promise);
	}

	const videos = await Promise.all(postPromises);

	let resultObj: Record<
		string,
		{ chapters: Record<string, {
				weight: number;
				children: any[]; title: string }>; title: string }
	> = {};

	videos.forEach((value) => {
		//split path with "/"
		const pathArray: string[] = value.path.split('/');

		const fileName = pathArray[pathArray.length - 1].split('.', 2)[0];

		const courseName = pathArray[3];
		const chapterName = pathArray[4];

		if (resultObj[courseName] === undefined) {
			resultObj[courseName] = {
				chapters: {},
				title: ''
			};
		}

		if (pathArray.length === 5) {
			resultObj[courseName].title = value.title;
			return;
		}

		if (resultObj[courseName]['chapters'][chapterName] === undefined) {
			resultObj[courseName]['chapters'][chapterName] = { children: [], title: '', weight: 0 };
		}
		if (fileName === '_index' || fileName === 'index') {
			resultObj[courseName]['chapters'][chapterName].title = value.title;
			resultObj[courseName]['chapters'][chapterName].weight = value.weight;
			return;
		}

		resultObj[courseName]['chapters'][chapterName].children.push({
			videoID: value.videoID,
			title: value.title,
			weight: value.weight,
			videoLength: value.videoLength,
			path: `/${courseName}/${chapterName}/${fileName}`
		});
	});




	let parts = [];
	for (let resultObjKey in resultObj) {
		let chaptersInParts = [];
		for (let chaptersKey in resultObj[resultObjKey].chapters) {
			chaptersInParts.push({
				title: resultObj[resultObjKey].chapters[chaptersKey].title,
				path: `/${resultObjKey}/${chaptersKey}`,
				children: resultObj[resultObjKey].chapters[chaptersKey].children,
				weight: resultObj[resultObjKey].chapters[chaptersKey].weight,
				id: chaptersKey
			});
		}

		//sort chapters par weight
		chaptersInParts.sort((a, b) => a.weight - b.weight);

		//sort videos per weight
		chaptersInParts.forEach((chapter) => {
			chapter.children.sort((a, b) => a.weight - b.weight);
		});

		parts.push({
			title: resultObj[resultObjKey].title,
			chapters: chaptersInParts,
			id: resultObjKey
		});
	}
	return parts;
}
