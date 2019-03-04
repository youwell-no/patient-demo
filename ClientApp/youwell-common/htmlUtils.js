// Logic adapted from CKEditor
// https://github.com/ckeditor/ckeditor5-media-embed

// const oembedRegex = /<oembed (?:url="([^"]*)".*?)><\/oembed>/g;
const oembedRegex = /<oembed .*?><\/oembed>/g;
const urlRegex = /url="([^"]*)".*?/;
const figureRegex = /<figure .*?><\/figure>/g;
const srcRegex = /src="([^"]*)".*?/;

const providers = [
    {
        name: 'dailymotion',
        url: /^dailymotion\.com\/video\/(\w+)/,
        html: url => '<div style="position: relative; padding-bottom: 100%; height: 0; ">'
                        + `<iframe src="https://www.dailymotion.com/embed/video/${url}" `
                            + 'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" '
                            + 'frameborder="0" width="480" height="270" allowfullscreen allow="autoplay">'
                        + '</iframe>'
                    + '</div>'
        ,
    },
    {
        name: 'youtube',
        url: [
            /^youtube\.com\/watch\?v=([\w-]+)/,
            /^youtube\.com\/v\/([\w-]+)/,
            /^youtube\.com\/embed\/([\w-]+)/,
            /^youtu\.be\/([\w-]+)/,
        ],
        html: url => '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">'
                        + `<iframe src="https://www.youtube.com/embed/${url}" `
                            + 'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" '
                            + 'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>'
                        + '</iframe>'
                    + '</div>'
        ,
    },
    {
        name: 'vimeo',
        url: [
            /^vimeo\.com\/(\d+)/,
            /^vimeo\.com\/[^/]+\/[^/]+\/video\/(\d+)/,
            /^vimeo\.com\/album\/[^/]+\/video\/(\d+)/,
            /^vimeo\.com\/channels\/[^/]+\/(\d+)/,
            /^vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
            /^vimeo\.com\/ondemand\/[^/]+\/(\d+)/,
            /^player\.vimeo\.com\/video\/(\d+)/,
        ],
        html: url => '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">'
                        + `<iframe src="https://player.vimeo.com/video/${url}" `
                            + 'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" '
                            + 'frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>'
                        + '</iframe>'
                    + '</div>'
        ,
    },
    // {
    //     name: 'spotify',
    //     url: [
    //         /^open\.spotify\.com\/(artist\/\w+)/,
    //         /^open\.spotify\.com\/(album\/\w+)/,
    //         /^open\.spotify\.com\/(track\/\w+)/,
    //     ],
    //     html: url => '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 126%;">'
    //                     + `<iframe src="https://open.spotify.com/embed/${url}" `
    //                         + 'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" '
    //                         + 'frameborder="0" allowtransparency="true" allow="encrypted-media">'
    //                     + '</iframe>'
    //                 + '</div>'
    //     ,
    // },
    // {
    //     name: 'instagram',
    //     url: /^instagram\.com\/p\/(\w+)/,
    // },
    // {
    //     name: 'twitter',
    //     url: /^twitter\.com/,
    // },
    // {
    //     name: 'googleMaps',
    //     url: /^google\.com\/maps/,
    // },
    // {
    //     name: 'flickr',
    //     url: /^flickr\.com/,
    // },
    // {
    //     name: 'facebook',
    //     url: /^facebook\.com/,
    // },
];

/**
 * Tries to match `url` to `pattern`.
 *
 * @param {String} url The URL of the media.
 * @param {RegExp} pattern The pattern that should accept the media URL.
 * @returns {Array|null}
 */
const getUrlMatches = (url, pattern) => {
    // 1. Try to match without stripping the protocol and "www" subdomain.
    let match = url.match(pattern);

    if (match) {
        return match;
    }

    // 2. Try to match after stripping the protocol.
    let rawUrl = url.replace(/^https?:\/\//, '');
    match = rawUrl.match(pattern);

    if (match) {
        return match;
    }

    // 3. Try to match after stripping the "www" subdomain.
    rawUrl = rawUrl.replace(/^www\./, '');
    match = rawUrl.match(pattern);

    if (match) {
        return match;
    }

    return null;
};

export const detectPattern = (patterns, url) => {
    for (let i = 0; i < patterns.length; i++) {
        const match = getUrlMatches(url, patterns[i]);

        if (match) {
            return match;
        }
    }
    return null;
};

export const replaceEmbedContent = (html) => {
    const match = html.match(oembedRegex);

    if (!match || !match[1]) {
        return html;
    }

    let replaced = html;

    for (let m = 0; m < match.length; m++) {
        const urlMatch = match[m].match(urlRegex);
        const url = urlMatch && urlMatch[1].trim();

        for (let i = 0; i < providers.length; i++) {
            let pattern = providers[i].url;

            if (!Array.isArray(pattern)) {
                pattern = [pattern];
            }

            const patternMatch = detectPattern(pattern, url);
            if (patternMatch) {
                replaced = replaced.replace(match[m], providers[i].html(patternMatch[1]));
            }
        }
    }


    return replaced;
};

export const isEmptyHtml = html => !html || html.trim() === '<p>&nbsp;</p>';

export const findImageUrl = (html) => {
    if (!html) {
        return null;
    }

    const match = html.match(figureRegex);
    if (!match || !match[0]) {
        return null;
    }

    for (let m = 0; m < match.length; m++) {
        const urlMatch = match[m].match(srcRegex);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1].trim();
        }
    }
    return null;
};

export const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};
