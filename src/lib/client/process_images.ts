// import {kdTree} from 'kd-tree-javascript';

import type { kdTree } from 'kd-tree-javascript';

export interface ColorVector {
	name: string;
	r: number;
	g: number;
	b: number;
	a: number;
}
export async function getAverageColorsGrid(img: HTMLImageElement, width = 30) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	if (!ctx) {
		throw Error('no ctx');
	}
	ctx.drawImage(img, 0, 0, img.width, img.height);

	const height = Math.floor((img.height / img.width) * width);
	const pixelWidth = Math.floor(img.width / width);
	const pixelHeight = Math.floor(img.height / height);

	const result: number[][][] = [];

	for (let r = 0; r < img.height; r += pixelHeight) {
		result.push([]);
		for (let c = 0; c < img.width; c += pixelWidth) {
			const avgColor = averageColor(
				ctx,
				r,
				c,
				Math.min(r + pixelHeight, img.height),
				Math.min(c + pixelWidth, img.width)
			);
			result[Math.floor(r / pixelHeight)].push(avgColor);
		}
	}
	return result;
}

export function averageColor(
	ctx: CanvasRenderingContext2D,
	startR = 0,
	startC = 0,
	endR: number,
	endC: number
): number[] {
	const rgba = [0, 0, 0, 0];
	const imgData = ctx.getImageData(startC, startR, endC - startC, endR - startR).data;

	for (let i = 0; i < imgData.length; i += 4) {
		for (let channel = 0; channel < 4; channel++) {
			rgba[channel] += imgData[i + channel];
		}
	}

	const count = (endC - startC) * (endR - startR);
	return rgba.map((sum) => Math.round(sum / count));
}

export function findClosestEmoji(pixel: number[], tree: kdTree<ColorVector>): string {
	return tree.nearest(pixelToColorVector(pixel), 1)[0][0].name;
}

export function euclideanDistance(v1: ColorVector, v2: ColorVector): number {
	return Math.sqrt(
		(v1.r - v2.r) ** 2 + (v1.g - v2.g) ** 2 + (v1.b - v2.b) ** 2 + (v1.a - v2.a) ** 2
	);
}

export function pixelToColorVector(pixel: number[], name = '_'): ColorVector {
	return {
		name,
		r: pixel[0],
		g: pixel[1],
		b: pixel[2],
		a: pixel[3]
	};
}
