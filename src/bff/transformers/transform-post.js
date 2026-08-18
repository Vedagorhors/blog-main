// принимаем пост из базы данных dbpost и возвращаем уже снормальными полями
export const transformPost = (dbPost) => ({
	id: dbPost.id,
	title: dbPost.title,
	content: dbPost.content,
	imageUrl: dbPost.image_url,
	publishedAt: dbPost.published_at,
});
