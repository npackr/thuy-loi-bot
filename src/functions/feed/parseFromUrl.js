import Parser from 'rss-parser';

export async function getFeed(url) {
  let parser = new Parser();
  (async () => {
    let feed = await parser.parseURL(url);
    return feed;
  })();
}