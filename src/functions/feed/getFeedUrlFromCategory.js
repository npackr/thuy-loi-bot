import { getFeed } from "./parseFromUrl.js";

export async function getFeedFromCategory(category) {
  const feed = await getFeed(category.url);
  return feed;
}