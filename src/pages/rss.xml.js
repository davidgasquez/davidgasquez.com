import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const blog = await getCollection('blog');
    return rss({
        title: 'David Gasquez',
        description: 'David Gasquez\'s Blog',
        site: context.site,
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            link: `/${post.id}/`,
        })),
        customData: `<language>en-us</language>`,
    });
}
