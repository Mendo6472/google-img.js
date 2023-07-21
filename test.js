'use strict';

const nock = require('nock');
const test = require('ava');
const {Client} = require('./index.js');



const fakeResponse = JSON.stringify({
	items: [{
		link: 'http://steveangello.com/boss.jpg',
		mime: 'image/jpeg',
		snippet: 'Steve Angello',
		image: {
			contextLink: 'http://steveangello.com',
			width: 1024,
			height: 768,
			byteSize: 1000,
			thumbnailLink: 'http://steveangello.com/thumbboss.jpg',
			thumbnailWidth: 512,
			thumbnailHeight: 512
		}
	}]
});

const fakeImages = [{
	url: 'http://steveangello.com/boss.jpg',
	type: 'image/jpeg',
	width: 1024,
	height: 768,
	size: 1000,
	thumbnail: {
		url: 'http://steveangello.com/thumbboss.jpg',
		width: 512,
		height: 512
	},
	description: 'Steve Angello',
	parentPage: 'http://steveangello.com'
}];

test('fail when cse id is missing', async t => {
	const error = await t.throws(() => new Client());
	t.is(error.message, 'Expected a Custom Search Engine ID')
});

test('fail when api key is missing', async t => {
	const error = await t.throws(() => new Client('id'));
	t.is(error.message, 'Expected an API key')
});

test('fail when query is missing', async t => {
	const client = new Client('id', 'key');
	const error = await t.throws(() => client.search());
	t.is(error.message, 'Expected a query')
});

test('no results', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'somethingmadeup',
			searchType: 'image',
			cx: 'id',
			key: 'key'
		})
		.reply(200, {items: []});

	const images = await client.search('somethingmadeup');
	t.deepEqual(images, []);
	t.true(req.isDone());
});

test('query', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key'
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello');
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});

test('page option', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key',
			start: 1
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello', {page: 1});
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});

test('size option', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key',
			imgSize: 'large'
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello', {size: 'large'});
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});

test('type option', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key',
			imgType: 'clipart'
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello', {type: 'clipart'});
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});

test('dominant color option', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key',
			imgDominantColor: 'green'
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello', {dominantColor: 'green'});
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});

test('color type option', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key',
			imgColorType: 'gray'
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello', {colorType: 'gray'});
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});

test('safe option', async t => {
	const client = new Client('id', 'key');

	const req = nock('https://www.googleapis.com')
		.get('/customsearch/v1')
		.query({
			q: 'steve+angello',
			searchType: 'image',
			cx: 'id',
			key: 'key',
			safe: 'medium'
		})
		.reply(200, fakeResponse);

	const images = await client.search('steve angello', {safe: 'medium'});
	t.deepEqual(images, fakeImages);
	t.true(req.isDone());
});
