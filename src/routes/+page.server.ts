import { getEmojis } from '$lib/server/emoji_data';

export async function load() {
	return { emojis: await getEmojis()};
}
