import { getEmojis, type EmojiInfo, getEmojiAvgColors } from '$lib/server/emoji_data';
import { IMG_DIR } from '$lib/server/file_paths';
import { time } from '$lib/util';
import axios from 'axios';
import * as fs from 'fs/promises';


async function startUp() {
  const emojis = await getEmojis();
  // 1. Download all images to assets folder.
  if (!(await checkPathExists(IMG_DIR))) {
    await fs.mkdir(IMG_DIR);
  }
  await time("download emojis", () => downloadAllEmojiImages(emojis));
  // 2. Get color info for each emoji.
  await time("process emojis", () => getEmojiAvgColors());
}
await startUp();

console.log("Startup Complete");


async function downloadAllEmojiImages(emojis: EmojiInfo[]) {
  const imageDownloads: Promise<number>[] = [];
  for (const emoji of emojis) {
    imageDownloads.push(downloadEmojiImage(emoji));
  }
  const completedImageDownloads = await Promise.all(imageDownloads);
  const sum = completedImageDownloads.reduce((acc, num) => acc + num, 0);
  console.log(`Downloaded ${sum} images.`);
}

async function downloadEmojiImage(emoji: EmojiInfo): Promise<number> {
	const imagePath = `${IMG_DIR}/${emoji.path}`;
	// only download image if it doesn't exist.
	if (!(await checkPathExists(imagePath))) {
		const url = `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/72/${emoji.path}`;
		const response = await axios.get(url, { responseType: 'arraybuffer' });
		const imageData = response.data;
		await fs.writeFile(imagePath, imageData);
		return Promise.resolve(1);
	}
	return Promise.resolve(0);
}

async function checkPathExists(directoryPath: string) {
	try {
		await fs.access(directoryPath);
		return true;
	} catch (error) {
		return false;
	}
}
