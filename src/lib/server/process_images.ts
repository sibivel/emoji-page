import sharp, { type Metadata} from 'sharp';

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
    const avgColor = averageColor(path, buffer, metadata);
    avgColors.set(path, avgColor)
  }
  // console.log(avgColors);
  return avgColors;
}

/** expects an alpha channel */
function averageColor(path: string, buffer: Buffer, metadata: Metadata,  startR = 0, startC = 0, endC?: number, endR?: number) {
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
  return rgba.map(sum => Math.round(sum/count));

}