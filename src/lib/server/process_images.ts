import { IMG_DIR } from './file_paths';
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import * as fs from 'fs/promises';

export async function getAverageColors(paths: string[]): Promise<Map<string, number[]>> {
	const avgColors = new Map();
	for (const path of paths) {
		const image = await loadImage(Buffer.from(await fs.readFile(`${IMG_DIR}/${path}`)));
		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, image.width, image.height);
		const avgColor = averageColor(ctx, image.width, image.height);
		avgColors.set(path, avgColor);
	}
	return avgColors;
}

function averageColor(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
): number[] {
	const rgba = [0, 0, 0, 0];
	const imgData = ctx.getImageData(0, 0, width, height).data;

	for (let i = 0; i < imgData.length; i += 4) {
		for (let channel = 0; channel < 4; channel++) {
			rgba[channel] += imgData[i + channel];
		}
	}

	const count = width * height;
	return rgba.map((sum) => Math.round(sum / count));
}