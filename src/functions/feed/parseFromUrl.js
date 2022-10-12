import Parser from 'rss-parser';

export async function getFeed(url) {
  let parser = new Parser();
  let feed = await parser.parseURL(url);
  return feed;
}