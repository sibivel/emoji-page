import axios from 'axios';
import { getAverageColors } from './process_images';
import * as fs from 'fs/promises';
import { EMOJI_AVG_COLORS_JSON_PATH, EMOJI_JSON_PATH } from './file_paths';

export interface EmojiInfo {
	path: string;
	emoji: string;
}

export const API_URL =
	'https://api.github.com/repos/googlefonts/noto-emoji/git/trees/41ea616c8b71bcceb552013ad260b6bfc1803491';

let emojis: Array<EmojiInfo> = [];

export async function getEmojis() {
	if (emojis.length === 0) {
		console.log('Making Request for emoji list');
		try {
			emojis = await axios.get<{ tree: Array<{ path: string }> }>(API_URL).then((response) =>
				response.data.tree.map((blob) => {
					const path = blob.path;
					const codepoints = blob.path
						.slice(7, blob.path.length - 4)
						.split('_')
						.map((code) => parseInt(code, 16));
					return { path, emoji: String.fromCodePoint(...codepoints) };
				})
			);
			fs.writeFile(EMOJI_JSON_PATH, JSON.stringify(emojis));
		} catch (error) {
			emojis = JSON.parse((await fs.readFile(EMOJI_JSON_PATH)).toString());
		}
	}
	return emojis;
}

const emojiAvgColors: Map<string, number[]> = new Map();
export async function getEmojiAvgColors() {
	const emojis = await getEmojis();
	if (emojiAvgColors.size === 0) {
		const avgColorByPath = await getAverageColors(emojis.map((e) => e.path));
		for (const emoji of emojis) {
			emojiAvgColors.set(emoji.emoji, avgColorByPath.get(emoji.path)!);
		}
		fs.writeFile(EMOJI_AVG_COLORS_JSON_PATH, JSON.stringify(Object.fromEntries(emojiAvgColors)))
	}
	return emojiAvgColors;
}
