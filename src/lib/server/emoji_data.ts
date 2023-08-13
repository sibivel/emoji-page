import axios from 'axios';

export interface EmojiInfo {
  path: string,
  emoji: string,
}

export const API_URL =
	'https://api.github.com/repos/googlefonts/noto-emoji/git/trees/41ea616c8b71bcceb552013ad260b6bfc1803491';

let emojis: Array<EmojiInfo> = [];

export async function getEmojis() {
  if (emojis.length === 0) {
    console.log("Making Request for emoji list")
    emojis = await axios.get<{ tree: Array<{ path: string }> }>(API_URL).then((response) => response.data.tree.map((blob) => {
      const path = blob.path;
		  const codepoints = blob.path.slice(7, blob.path.length - 4).split('_').map((code) => parseInt(code, 16));
      return { path, emoji: String.fromCodePoint(...codepoints) };
    }));
  }
  return emojis;
}


