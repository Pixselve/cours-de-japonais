type Course = {
	id: string;
	title?: string;
	videoURL?: string;
	content?: string;
	children: Course[];
};

const courses: Course[] = [
	{
		id: 'f89bc4c5-b3d3-4771-b4aa-a6df5b401397',
		title: 'L’écriture de la langue japonaise',
		videoURL: '2v_CM-uEmmU',
		children: [
			{
				id: '600d3d30-5f66-4b4e-9b60-76dc58dea0cd',
				title: 'Présentations générales',
				children: [
					{
						id: '636d5a84-bc91-43e7-98f6-6875c1451d60',
						title: 'Présentation des hiragana',
						videoURL: '_PCJnq_-oT8',
						children: []
					},
					{
						id: 'f2e00a15-bbeb-47ba-bed4-443b3fc21503',
						title: 'Présentation des katakana',
						videoURL: 'xnjpl0mNQOQ',
						children: []
					}
				]
			}
		]
	}
];

const courses2 = new Map([
	[
		'f89bc4c5-b3d3-4771-b4aa-a6df5b401397',
		{
			id: 'f89bc4c5-b3d3-4771-b4aa-a6df5b401397',
			title: 'L’écriture de la langue japonaise',
			videoURL: '2v_CM-uEmmU'
		}
	]
]);

export default courses2;
