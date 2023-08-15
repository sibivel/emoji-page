import sharp, { type Metadata} from 'sharp';

export async function run() {
  const image = sharp(`images/emoji_u1f7e5.png`);
  const buffer = await image.raw().toBuffer();
  const metadata = await image.metadata();
  console.log(metadata);
  const avgColor = averageColor('emoji_u1f7e5.png', buffer, metadata);
  console.log(avgColor);
}


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
    return rgba.map(sum => sum/count);
  
  }