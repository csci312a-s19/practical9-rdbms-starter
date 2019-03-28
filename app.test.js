/* eslint-disable arrow-body-style */
const request = require('supertest');
const { app, articles } = require('./app');

const article = {
  title: 'John P. Lucas',
  extract:
    'Major General John Porter Lucas (January 14, 1890 – December 24, 1949) was a senior officer of the United States Army who saw service in World War I and World War II. He is most notable for being the commander of the U.S. VI Corps during the Battle of Anzio (Operation Shingle) in the Italian Campaign of World War II.',
  edited: '2016-11-19T22:57:32.639Z'
};

describe('Simplepedia API', () => {
  beforeEach(() => {
    // Delete all previous keys and add in article
    Object.keys(articles).forEach(prop => {
      delete articles[prop];
    });
    // Although we are using an integer as a key, internally Javascript converts the
    // object properties to strings, e.g. we can access this article with
    // articles["1"]
    articles[1] = Object.assign({ id: 1 }, article);
  });

  // SuperTest has several helpful methods for conveniently testing responses
  // that we can use to make the tests more concise

  test('GET /api/articles should return all movies (mostly SuperTest)', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([Object.assign({ id: 1 }, article)]);
  });

  describe('POST operations', () => {
    test('Should create new article', () => {
      const newArticle = {
        title: 'A new article',
        extract: 'Article body',
        edited: '2016-11-19T22:57:32.639Z'
      };
      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(Object.assign({ id: 2 }, newArticle));
    });

    test('Should reject article with duplicate title', () => {
      return request(app)
        .post('/api/articles')
        .send(article)
        .expect(400);
    });

    test('Should reject article with no title', () => {
      return request(app)
        .post('/api/articles')
        .send({})
        .expect(400);
    });

    test('Should reject article with a null title', () => {
      return request(app)
        .post('/api/articles')
        .send({ title: null })
        .expect(400);
    });

    test('Should reject article with no edited time', () => {
      return request(app)
        .post('/api/articles')
        .send({ title: 'A title' })
        .expect(400);
    });

    test('Should create a default extract', () => {
      const newArticle = {
        title: 'A title',
        edited: '2016-11-19T22:57:32.639Z'
      };
      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(Object.assign({ id: 2, extract: '' }, newArticle));
    });
  });

  describe('DELETE operations', () => {
    test('Should delete article', () => {
      return request(app)
        .delete('/api/articles/1')
        .expect(200)
        .then(() => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .expect([]);
        });
    });
  });

  describe('PUT operations', () => {
    test('Should update article', () => {
      const newArticle = Object.assign({ id: 1 }, article, {
        extract: 'New extract'
      });
      return request(app)
        .put('/api/articles/1')
        .send(newArticle)
        .expect(200)
        .expect(newArticle);
    });

    test('Should reject article when id is different than URL', () => {
      const newArticle = Object.assign({ id: 2 }, article, {
        extract: 'New extract'
      });
      return request(app)
        .put('/api/articles/1')
        .send(newArticle)
        .expect(400);
    });

    test('Should reject article with missing id', () => {
      const { id, ...newArticle } = Object.assign({}, article, {
        // eslint-disable-line no-unused-vars
        extract: 'New extract'
      });
      return request(app)
        .put('/api/articles/1')
        .send(newArticle)
        .expect(400);
    });

    test('Should reject article with extra fields', () => {
      const newArticle = Object.assign({ id: 1 }, article, { junk: 'Junk' });
      return request(app)
        .put('/api/articles/1')
        .send(newArticle)
        .expect(400);
    });
  });
});
