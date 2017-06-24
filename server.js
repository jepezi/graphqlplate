import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {schema} from './schema'

const PORT = 3000
const app = express()
app.use('/api/posts', (req, res) => {
  res.json([
    {title: 'Post 1', description: 'abc'},
    {title: 'Post 2', description: 'def'}
  ])
})
app.use('/api/graphql', bodyParser.json(), graphqlExpress({
  schema,
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/api/graphql',
}));

app.listen(PORT, function onAppListening(err) {
  if (err) {
    console.warn(err)
  } else {
    console.warn('==> 🚧  API server listening on port %s', PORT)
  }
})
