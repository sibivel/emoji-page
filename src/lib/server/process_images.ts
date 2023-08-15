import sharp, { type Metadata } from 'sharp';

const IMG_DIR = './images';

export async function getAverageColors(paths: string[]): Promise<Map<string, number[]>> {
	const avgColors = new Map();
	for (const path of paths) {
		// if (!['🟦', '🟥'].includes(emoji.emoji)) {
		//   continue;
		// }
		const image = sharp(`${IMG_DIR}/${path}`);
		const buffer = await image.raw().toBuffer();
		const metadata = await image.metadata();
		const avgColor = averageColor(buffer, metadata);
		avgColors.set(path, avgColor);
	}
	// console.log(avgColors);
	return avgColors;
}

export async function getAverageColorsGrid(
	imageFile: File,
	pixelWidth = 10,
	pixelHeight = 10
) {
	const image = sharp(await imageFile.arrayBuffer());
	const buffer = await image.raw().toBuffer();
	const metadata = await image.metadata();
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
			const pixelIndex = (r * endC + c) * 4;
			for (let channel = 0; channel < 4; channel++) {
				rgba[channel] += buffer.readUInt8(pixelIndex + channel);
			}
		}
	}
	const count = (endC - startC) * (endR - startR);
  // console.log(count);
	return rgba.map((sum) => Math.round(sum / count));
}
