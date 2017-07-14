YABE API Documentation
======================

This API is a JSON RESTful API. The client is expected to send
`application/json` as `Content-Type` HTTP Header and JSON formatted bodies.

Overview
--------
The YABE API is a Blog. Thus, "Post" is the main resource.

Create one Post
---------------
Add a new Post object into the system.

### Request
`POST /api/posts`  
The Post object must be provided in the body.
##### Example
```
curl --request POST --data '{"title": "Tomato sauce", "body": "take 4 tomatoes..."}' https://example.tld/api/posts
```

### Response
#### 201 Created
The Post has been successfully created, the response body contains the saved version.
##### Example
```
{
    "__v": 0,
    "title": "Tomato sauce",
    "body": "take 4 tomatoes...",
    "_id": "59664afc9d9bbc071bddfa08"
}
```

Read all the posts
------------------
Read all the Posts in the database.

### Request
`GET /api/posts`
##### Example
```
curl --request GET https://example.tld/api/posts
```

### Response
#### 200 OK
The response body is an array of Post objects.
##### Example
```
[
    {
        "_id": "59664afc9d9bbc071bddfa08",
        "title": "Tomato sauce",
        "body": "take 4 tomatoes...",
        "__v": 0
    }
]
```

Read one post
-------------
Read a Post given its `_id`.

### Request
`GET /api/posts/:post_id`
##### Example
```
curl --request GET https://example.tld/api/posts/59664afc9d9bbc071bddfa08
```

### Response
#### 200 OK
The response body is a Post object.
##### Example
```
{
    "_id": "59664afc9d9bbc071bddfa08",
    "title": "Tomato sauce",
    "body": "take 4 tomatoes...",
    "__v": 0
}
```
#### 404 Not Found
No Post could be found matching the requested `_id`.

Replace a post
--------------
Replace a Post with a complete Post object provided in the request.

### Request
`PUT /api/posts/:post_id`
The Post object must be provided in the body.
##### Example
```
curl --request PUT --data '{"title": "Avocado Salad", "__v": 0}' https://example.tld/api/posts/59664afc9d9bbc071bddfa08
```

### Response
#### 200 OK
The response body is the new version of the Post object.
##### Example
```
{
    "_id": "59664afc9d9bbc071bddfa08",
    "__v": 0,
    "title": "Avocado Salad"
}
```
#### 404 Not Found
No Post could be found matching the requested `_id`.

Update a post
-------------
Update a Post with a partial Post object provided in the request.

### Request
`PATCH /api/posts/:post_id`
The partial Post object must be provided in the body.
##### Example
```
curl --request PATCH --data '{"body": "take as much avocado as you can, then..."}' https://example.tld/api/posts/59664afc9d9bbc071bddfa08
```

### Response
#### 200 OK
The response body is the new version of the Post object.
##### Example
```
{
    "_id": "59664afc9d9bbc071bddfa08",
    "__v": 0,
    "title": "Avocado Salad",
    "body": "take as much avocado as you can, then..."
}
```
#### 404 Not Found
No Post could be found matching the requested `_id`.

Delete a post
-------------
Delete a Post from the database.

### Request
`DELETE /api/posts/:post_id`
##### Example
```
curl --request DELETE https://example.tld/api/posts/59664afc9d9bbc071bddfa08
```

### Response
#### 200 OK
The response body is the removed Post object.
##### Example
```
{
    "_id": "59664afc9d9bbc071bddfa08",
    "__v": 0,
    "title": "Avocado Salad",
    "body": "take as much avocado as you can, then..."
}
```
#### 404 Not Found
No Post could be found matching the requested `_id`.
