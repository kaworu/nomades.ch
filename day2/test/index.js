/*
 * YABE mocha tests.
 */
"use strict";

const chai    = require("chai");
const expect  = chai.expect;
const request = require("supertest");

const app = require("../app");

describe("blogging", () => {

    const valid_post_id   = 1;
    const invalid_post_id = 42;
    beforeEach(() => {
        /* setup code copied from app.js. This ensure that before any tests,
           our fake database is in the initial state. */
        app.locals.posts = [
            {_id: 1, title: "Bacon Avocado Salad", body: "Place bacon in a large..."},
            {_id: 2, title: "Crispy Orange Beef", body: "Lay beef strips out in..."},
            {_id: 3, title: "Simple BBQ Ribs", body: "Place ribs in a large..."},
        ];
    });

    describe("create a post", () => {
        const post_to_create = {
            _id: 4,
            title: "Awesome BBQ Ribs",
            body: "it takes time but it worth it...",
        };
        it("should return 201 Created", (done) => {
            request(app).post('/api/posts').send(post_to_create).end((err, res) => {
                expect(res.status).to.eql(201);
                return done();
            });
        });
        it("should return the newly created post", (done) => {
            request(app).post('/api/posts').send(post_to_create).end((err, res) => {
                expect(res.body).to.eql(post_to_create);
                return done();
            });
        });
        it("should have been added to the database", (done) => {
            request(app).post('/api/posts').send(post_to_create).end((err, res) => {
                const created = app.locals.posts.find(p => p._id == post_to_create._id);
                expect(created).to.be.eql(post_to_create);
                return done();
            });
        });
    });

    describe("read all the posts", () => {
        it("should return 200 OK", (done) => {
            request(app).get('/api/posts').end((err, res) => {
                expect(res.status).to.eql(200);
                return done();
            });
        });
        it("should return the posts from the database", (done) => {
            request(app).get('/api/posts').end((err, res) => {
                expect(res.body).to.eql(app.locals.posts);
                return done();
            });
        });
    });

    describe("read one post", () => {
        context("when the post id is invalid", () => {
            it("should return 404 Not Found", (done) => {
                request(app).get(`/api/posts/${invalid_post_id}`).end((err, res) => {
                    expect(res.status).to.eql(404);
                    return done();
                });
            });
            it("should return an empty body", (done) => {
                request(app).get(`/api/posts/${invalid_post_id}`).end((err, res) => {
                    expect(res.body).to.be.empty;
                    return done();
                });
            });
        });
        context("when the post id is valid", () => {
            it("should return 200 OK", (done) => {
                request(app).get(`/api/posts/${valid_post_id}`).end((err, res) => {
                    expect(res.status).to.eql(200);
                    return done();
                });
            });
            it("should return the post from the database", (done) => {
                request(app).get(`/api/posts/${valid_post_id}`).end((err, res) => {
                const expected = app.locals.posts.find(p => p._id == valid_post_id);
                    expect(res.body).to.eql(expected);
                    return done();
                });
            });
        });
    });

    describe("update a post", () => {
        const updated = {
            _id: 1,
            title: "Bacon Salad without Avocado", // changed
            body: "Place bacon in a large..."
        };
        context("when the post id is invalid", () => {
            it("should return 404 Not Found", (done) => {
                request(app).put(`/api/posts/${invalid_post_id}`).send(updated).end((err, res) => {
                    expect(res.status).to.eql(404);
                    return done();
                });
            });
            it("should return an empty body", (done) => {
                request(app).put(`/api/posts/${invalid_post_id}`).send(updated).end((err, res) => {
                    expect(res.body).to.be.empty;
                    return done();
                });
            });
        });
        context("when the post id doesn't match", () => {
            it("should return 400 Bad Request", (done) => {
                request(app).put(`/api/posts/${updated._id + 1}`).send(updated).end((err, res) => {
                    expect(res.status).to.eql(400);
                    return done();
                });
            });
            it("should return an empty body", (done) => {
                request(app).put(`/api/posts/${updated._id + 1}`).send(updated).end((err, res) => {
                    expect(res.body).to.be.empty;
                    return done();
                });
            });
        });
        context("when the post id is valid", () => {
            it("should return 200 OK", (done) => {
                request(app).put(`/api/posts/${updated._id}`).send(updated).end((err, res) => {
                    expect(res.status).to.eql(200);
                    return done();
                });
            });
            it("should return the post from the database", (done) => {
                request(app).put(`/api/posts/${updated._id}`).send(updated).end((err, res) => {
                    const expected = app.locals.posts.find(p => p._id == updated._id);
                    expect(res.body).to.eql(expected);
                    return done();
                });
            });
        });
    });

    describe("partial update", () => {
        const partial = {
            _id: 1,
            title: "Bacon Salad without Avocado", // changed
        };
        context("when the post id is invalid", () => {
            it("should return 404 Not Found", (done) => {
                request(app).patch(`/api/posts/${invalid_post_id}`).send(partial).end((err, res) => {
                    expect(res.status).to.eql(404);
                    return done();
                });
            });
            it("should return an empty body", (done) => {
                request(app).patch(`/api/posts/${invalid_post_id}`).send(partial).end((err, res) => {
                    expect(res.body).to.be.empty;
                    return done();
                });
            });
        });
        context("when the post id doesn't match", () => {
            it("should return 400 Bad Request", (done) => {
                request(app).patch(`/api/posts/${partial._id + 1}`).send(partial).end((err, res) => {
                    expect(res.status).to.eql(400);
                    return done();
                });
            });
            it("should return an empty body", (done) => {
                request(app).patch(`/api/posts/${partial._id + 1}`).send(partial).end((err, res) => {
                    expect(res.body).to.be.empty;
                    return done();
                });
            });
        });
        context("when the post id is valid", () => {
            it("should return 200 OK", (done) => {
                request(app).patch(`/api/posts/${partial._id}`).send(partial).end((err, res) => {
                    expect(res.status).to.eql(200);
                    return done();
                });
            });
            it("should return the post from the database", (done) => {
                request(app).patch(`/api/posts/${partial._id}`).send(partial).end((err, res) => {
                    const expected = app.locals.posts.find(p => p._id == partial._id);
                    expect(res.body).to.eql(expected);
                    return done();
                });
            });
        });
    });

    describe("delete a post", () => {
        context("when the post id is invalid", () => {
            it("should return 404 Not Found", (done) => {
                request(app).delete(`/api/posts/${invalid_post_id}`).end((err, res) => {
                    expect(res.status).to.eql(404);
                    return done();
                });
            });
            it("should return an empty body", (done) => {
                request(app).delete(`/api/posts/${invalid_post_id}`).end((err, res) => {
                    expect(res.body).to.be.empty;
                    return done();
                });
            });
        });
        context("when the post id is valid", () => {
            it("should return 200 OK", (done) => {
                request(app).delete(`/api/posts/${valid_post_id}`).end((err, res) => {
                    expect(res.status).to.eql(200);
                    return done();
                });
            });
            it("should return the post from the database", (done) => {
                // fetch the expected post before deleting it
                const expected = app.locals.posts.find(p => p._id == valid_post_id);
                request(app).delete(`/api/posts/${valid_post_id}`).end((err, res) => {
                    expect(res.body).to.eql(expected);
                    return done();
                });
            });
            it("should remove the post from the database");
        });
    });
});
