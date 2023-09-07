import sharp, { type Metadata } from 'sharp';
import { IMG_DIR } from './file_paths';


export async function getAverageColors(paths: string[]): Promise<Map<string, number[]>> {
	const avgColors = new Map();
	for (const path of paths) {
		const image = sharp(`${IMG_DIR}/${path}`).toFormat('png').ensureAlpha().raw();
		const buffer = await image.toBuffer();
		const metadata = await image.metadata();
		const avgColor = averageColor(buffer, metadata);
		avgColors.set(path, avgColor);
	}
	return avgColors;
}

export async function getAverageColorsGrid(
	imageFile: File,
	multiplier = 1,
): Promise<number[][][]> {
	const image = sharp(await imageFile.arrayBuffer()).toFormat('png').ensureAlpha().raw();
	const buffer = await image.toBuffer();
	const metadata = await image.metadata();
	const width = Math.floor(metadata.width!/16) * multiplier;
	const height = Math.floor(metadata.height!/metadata.width!*width);
	const pixelWidth = Math.floor(metadata.width!/width);
	const pixelHeight = Math.floor(metadata.height!/height);
	const result: number[][][] = [];
	for (let r = 0; r < metadata.height!; r += pixelHeight) {
		result.push([]);
		for (let c = 0; c < metadata.width!; c += pixelWidth) {
			const avgColor = averageColor(buffer, metadata, r, c, Math.min(r + pixelHeight,  metadata.height!), Math.min(c + pixelWidth, metadata.width!));
			result[r/pixelHeight].push(avgColor);
		}
	}
	return result;
}

/** expects an alpha channel */
function averageColor(
	buffer: Buffer,
	metadata: Metadata,
	startR = 0,
	startC = 0,
	endR?: number,
	endC?: number
): number[] {
	if (endC == undefined) {
		endC = metadata.width! - startC;
	}
	if (endR == undefined) {
		endR = metadata.height! - startR;
	}
	const rgba = [0, 0, 0, 0];
	for (let r = startR; r < endR; r++) {
		for (let c = startC; c < endC; c++) {
			const pixelIndex = (r * metadata.width! + c) * 4;
			for (let channel = 0; channel < 4; channel++) {
				rgba[channel] += buffer.readUInt8(pixelIndex + channel);
			}
		}
	}
	const count = (endC - startC) * (endR - startR);
	return rgba.map((sum) => Math.round(sum / count));
}
