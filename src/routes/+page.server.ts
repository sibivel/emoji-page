
import { getAverageColorsGrid } from '$lib/server/process_images';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
    const imageFile = data.get('image') as File;
    const pixels = await getAverageColorsGrid(imageFile);
    console.log(pixels);
	}
};