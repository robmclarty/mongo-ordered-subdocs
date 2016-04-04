# How to Manage an Ordered List in MongoDB

This is a simple experiment to create a Mongoose model that contains an array
of subdocuments (another Mongoose model schema) and uses an API endpoint to
allow users to change the position of one of the subdocuments in the main
container's array of subdocuments.

For example, sending `{position:3}` in the body JSON body of a request to the endpoint
`http://localhost:3000/containers/:container_id/subdocs/:id/position`
would change the position of the subdocument with id `:id` on the container with
id `:container_id` to the position of `3` (of a zero-indexed array) in the
container's `subdocs` array.
