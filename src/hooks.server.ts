import { getEmojis, type EmojiInfo } from '$lib/server/emoji_data';
import axios from 'axios';
import * as fs from 'fs/promises';

const IMG_DIR = './images';

async function startUp() {
  const emojis = await getEmojis();
  // 1. Download all images to assets folder.
  if (!(await checkPathExists(IMG_DIR))) {
    await fs.mkdir(IMG_DIR);
  }
  await downloadAllEmojiImages(emojis);
}
startUp();


async function downloadAllEmojiImages(emojis: EmojiInfo[]) {
  const imageDownloads: Promise<number>[] = [];
  const start = new Date();
  for (const emoji of emojis) {
    imageDownloads.push(downloadEmojiImage(emoji));
  }
  const completedImageDownloads = await Promise.all(imageDownloads);
  const sum = completedImageDownloads.reduce((acc, num) => acc + num, 0);
  const end = new Date();
  console.log(`Downloaded ${sum} images in ${(end.getTime() - start.getTime()) / 1000} seconds.`);
}

async function downloadEmojiImage(emoji: EmojiInfo): Promise<number> {
	const imagePath = `${IMG_DIR}/${emoji.path}`;
	// only download image if it doesn't exist.
	if (!(await checkPathExists(imagePath))) {
		const url = `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/72/${emoji.path}`;
		const response = await axios.get(url, { responseType: 'arraybuffer' });
		const imageData = response.data;
		console.log(`Downloaded ${emoji.path}`);
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
