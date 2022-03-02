import getCourses from '../../utils/getCourses';

export async function get() {
	const courses = await getCourses();

	return {
		body: JSON.stringify(courses)
	};
}
