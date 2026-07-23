import { describe, it, expect } from "vitest";
import { youtubeId, youtubeEmbed, youtubeThumb, youtubeThumbs } from "./youtube";

const ID = "dQw4w9WgXcQ"; // canonical 11-char id

describe("youtubeId", () => {
  it("returns null for empty / nullish input", () => {
    expect(youtubeId()).toBeNull();
    expect(youtubeId(null)).toBeNull();
    expect(youtubeId("")).toBeNull();
  });

  it("parses standard watch URLs", () => {
    expect(youtubeId(`https://www.youtube.com/watch?v=${ID}`)).toBe(ID);
    expect(youtubeId(`https://youtube.com/watch?v=${ID}&t=30s`)).toBe(ID);
  });

  it("parses youtu.be short links", () => {
    expect(youtubeId(`https://youtu.be/${ID}`)).toBe(ID);
    expect(youtubeId(`https://youtu.be/${ID}?si=abc`)).toBe(ID);
  });

  it("parses embed / shorts / v paths", () => {
    expect(youtubeId(`https://www.youtube.com/embed/${ID}`)).toBe(ID);
    expect(youtubeId(`https://www.youtube.com/shorts/${ID}`)).toBe(ID);
    expect(youtubeId(`https://www.youtube.com/v/${ID}`)).toBe(ID);
  });

  it("handles m.youtube.com host", () => {
    expect(youtubeId(`https://m.youtube.com/watch?v=${ID}`)).toBe(ID);
  });

  it("treats a bare 11-char id as the id", () => {
    expect(youtubeId(ID)).toBe(ID);
  });

  it("returns null for youtu.be with no path", () => {
    expect(youtubeId("https://youtu.be/")).toBeNull();
  });

  it("returns null for a watch URL without v param", () => {
    expect(youtubeId("https://www.youtube.com/watch?foo=bar")).toBeNull();
  });

  it("returns null for unknown youtube paths", () => {
    expect(youtubeId("https://www.youtube.com/feed/subscriptions")).toBeNull();
  });

  it("returns null for non-youtube URLs", () => {
    expect(youtubeId("https://vimeo.com/12345")).toBeNull();
  });

  it("returns null for non-URL strings that are not valid ids", () => {
    expect(youtubeId("not a url")).toBeNull();
    expect(youtubeId("short")).toBeNull();
    expect(youtubeId("way-too-long-to-be-an-id")).toBeNull();
  });
});

describe("youtubeEmbed", () => {
  it("builds an embed URL from a watch link", () => {
    expect(youtubeEmbed(`https://www.youtube.com/watch?v=${ID}`)).toBe(
      `https://www.youtube.com/embed/${ID}?rel=0&modestbranding=1`,
    );
  });

  it("returns null when no id can be parsed", () => {
    expect(youtubeEmbed("https://vimeo.com/1")).toBeNull();
    expect(youtubeEmbed()).toBeNull();
  });
});

describe("youtubeThumb", () => {
  it("builds an mqdefault thumbnail URL", () => {
    expect(youtubeThumb(ID)).toBe(`https://i.ytimg.com/vi/${ID}/mqdefault.jpg`);
  });

  it("returns null when no id can be parsed", () => {
    expect(youtubeThumb("nope")).toBeNull();
  });
});

describe("youtubeThumbs", () => {
  it("returns fallbacks ordered from highest quality", () => {
    const thumbs = youtubeThumbs(ID);
    expect(thumbs).toEqual([
      `https://i.ytimg.com/vi/${ID}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${ID}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${ID}/mqdefault.jpg`,
      `https://i.ytimg.com/vi/${ID}/0.jpg`,
    ]);
  });

  it("returns an empty array when no id can be parsed", () => {
    expect(youtubeThumbs()).toEqual([]);
    expect(youtubeThumbs("nope")).toEqual([]);
  });
});
