import { z, defineCollection } from "astro:content";
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

const handbookCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: "./src/content/handbook" }),
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  handbook: handbookCollection,
};
