import { getEmojiAvgColors, getEmojis, type EmojiInfo } from '$lib/server/emoji_data';
import { getAverageColorsGrid } from '$lib/server/process_images';
import type { RequestEvent } from '@sveltejs/kit';

export const actions = {
	default: convertImageToEmojisAction
};

async function convertImageToEmojisAction({ request }: RequestEvent) {
	const data = await request.formData();
	const imageFile = data.get('image') as File;
	const pixels = await getAverageColorsGrid(imageFile);

	const avgColors = await getEmojiAvgColors();
  const result = { text: pixels.map((row) => row.map((pixel) => findClosestEmoji(pixel, avgColors)).join('')) };
	// console.log(result);
	return result;
}

function findClosestEmoji(pixel: number[], avgColors: Map<string, number[]>): string {
	let minDist = Number.MAX_VALUE;
	let minEmoji = '';
	avgColors.forEach((emojiPixel, emoji) => {
		const dist = euclideanDistance(pixel, emojiPixel);
		if (dist < minDist) {
			minDist = dist;
			minEmoji = emoji;
		}
	});
	// console.log(minEmoji)
	return minEmoji;
}

function euclideanDistance(vector1: number[], vector2: number[]): number {
	return Math.sqrt(
		vector1
			.map((val1, index) => {
				const val2 = vector2[index];
				return (val1 - val2) ** 2;
			})
			.reduce((sum, squaredDiff) => sum + squaredDiff, 0)
	);
}


