'use strict';
//	Recreating google-images npm using node-fetch instead of got because of a vulnerability
require("core-js/modules/web.url");

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

class Client {
	constructor(id, apiKey) {
		if (!id) {
			throw new TypeError('Expected a Custom Search Engine ID');
		}

		if (!apiKey) {
			throw new TypeError('Expected an API key');
		}

		this.endpoint = 'https://www.googleapis.com';
		this.apiKey = apiKey;
		this.id = id;
	}

	search(query, options) {
		if (!query) {
			throw new TypeError('Expected a query');
		}

		const url = `${this.endpoint}/customsearch/v1?${this.buildQuery(query, options)}`;
        const settings = { method: "Get" };

        return fetch(url, settings)
			.then(res => res.json())
			.then((json) => {
                const items = json.items || [];
                // do something with JSON
                return items.map(item => ({
				    type: item.mime,
	    			width: item.image.width,
    				height: item.image.height,
				    size: item.image.byteSize,
				    url: item.link,
				    thumbnail: {
					    url: item.image.thumbnailLink,
					    width: item.image.thumbnailWidth,
					    height: item.image.thumbnailHeight
				    },
				    description: item.snippet,
				    parentPage: item.image.contextLink
			    }));
            });
	}

	buildQuery(query, options) {
		options = options || {};

		const result = {
			q: query.replace(/\s/g, '+'),
			searchType: 'image',
			cx: this.id,
			key: this.apiKey
		};

		if (options.page) {
			result.start = options.page;
		}

		if (options.size) {
			result.imgSize = options.size;
		}

		if (options.type) {
			result.imgType = options.type;
		}

		if (options.dominantColor) {
			result.imgDominantColor = options.dominantColor;
		}

		if (options.colorType) {
			result.imgColorType = options.colorType;
		}

		if (options.safe) {
			result.safe = options.safe;
		}

		return new URLSearchParams(result).toString();
	}
}
module.exports = {
    Client,
};