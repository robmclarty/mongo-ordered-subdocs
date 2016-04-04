# Usage

Example requests and response data using cUrl commands.

## Root

Simply displays a welcome message.

### Request

```shell
curl \
  -X GET \
  http://localhost:3000
```

### Response

```json
{
  "message":"Welcome to the ordered subdoc app."
}
```


## List Containers

List all containers in the database.

### Request

```shell
curl \
  -X GET \
  http://localhost:3000/containers
```

### Response

```json
{
  "message":"Listing all containers",
  "containers": [
    {
      "name": "Container 1",
      "description": "First container description.",
      "isActive": true,
      "subdocs": [],
      "createdAt": "2016-04-04T17:52:39.762Z"
    },
    {
      "name": "Container 2",
      "description": "Second container description.",
      "isActive": true,
      "subdocs": [],
      "createdAt": "2016-04-04T17:52:39.762Z"
    },
    {
      "name": "Container 3",
      "description": "Third container description.",
      "isActive": true,
      "subdocs": [],
      "createdAt": "2016-04-04T17:52:39.762Z"
    },
    ...
  ]
}
```

## Create New Container

Add a new, empty (i.e., has no subdocs), container to the database.

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Example Container", "description":"Just for show.", "isActive":true}' \
  http://localhost:3000/containers
```

### Response

```json
{
  "message":"New container created.",
  "container":{
    "__v":0,
    "name":"Example Container",
    "description":"Just for show.",
    "_id":"5702a8c2c575722c095bfbf4",
    "createdAt":"2016-04-04T17:47:46.946Z",
    "subdocs":[],
    "isActive":true
  }
}
```

## Create New Subdoc

Add a new subdoc to a container.

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"My Subdoc", "value":"Something special."}' \
  http://localhost:3000/containers/5702a8c2c575722c095bfbf4/subdocs
```

### Response

```json
{
  "message":"New subdoc created.",
  "subdoc":{
    "name":"My Other Subdoc",
    "_id":"5702bb39b2526daa09a4b6e3",
    "createdAt":"2016-04-04T19:06:33.250Z",
    "value":"Something special."
  },
  "container":{
    "_id":"5702a8c2c575722c095bfbf4",
    "name":"Example Container",
    "description":"Just for show.",
    "__v":7,
    "createdAt":"2016-04-04T17:47:46.946Z",
    "subdocs":[
      {
        "_id":"5702a9d6c575722c095bfbf5",
        "name":"My Subdoc",
        "createdAt":"2016-04-04T17:52:22.103Z",
        "value":"0"
      },{
        "_id":"5702aa09c575722c095bfbf7",
        "name":"Yet Another Subdoc",
        "createdAt":"2016-04-04T17:53:13.408Z",
        "value":"0"
      },{
        "_id":"5702aa1dc575722c095bfbf8",
        "name":"Subdoc Something or Other",
        "createdAt":"2016-04-04T17:53:33.756Z",
        "value":"0"
      },{
        "_id":"5702aa36c575722c095bfbf9",
        "name":"The Fifth Subdoc Added.",
        "createdAt":"2016-04-04T17:53:58.662Z",
        "value":"0"
      },{
        "_id":"5702bb39b2526daa09a4b6e3",
        "name":"My Other Subdoc",
        "createdAt":"2016-04-04T19:06:33.250Z",
        "value":"Something special."
      }
    ],
    "isActive":true
  }
}
```

## Reposition Subdoc

Change the position of a subdoc within the container's array of subdocs.

### Request

```shell
curl \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"position":3}' \
  http://localhost:3000/containers/5702a8c2c575722c095bfbf4/subdocs/5702a9d6c575722c095bfbf5/position
```

### Response

```json
{
  "message":"Subdoc updated.",
  "container":{
    "_id":"5702a8c2c575722c095bfbf4",
    "name":"Example Container",
    "description":"Just for show.",
    "__v":9,
    "createdAt":"2016-04-04T17:47:46.946Z",
    "subdocs":[
      {
        "_id":"5702aa1dc575722c095bfbf8",
        "name":"Subdoc Something or Other",
        "createdAt":"2016-04-04T17:53:33.756Z",
        "value":"0"
      },{
        "_id":"5702aa36c575722c095bfbf9",
        "name":"The Fifth Subdoc Added.",
        "createdAt":"2016-04-04T17:53:58.662Z",
        "value":"0"
      },{
        "name":"Yet Another Subdoc",
        "_id":"5702aa09c575722c095bfbf7",
        "createdAt":"2016-04-04T17:53:13.408Z",
        "value":"0"
      },{
        "_id":"5702bb39b2526daa09a4b6e3",
        "name":"My Other Subdoc",
        "createdAt":"2016-04-04T19:06:33.250Z",
        "value":"Something special."
      }
    ],
    "isActive":true
  },
  "subdoc":{
    "_id":"5702a9d6c575722c095bfbf5",
    "name":"My Subdoc",
    "createdAt":"2016-04-04T17:52:22.103Z",
    "value":"0"
  }
}
```
