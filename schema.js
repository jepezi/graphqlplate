import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay'

const getUser = id => ({
  email: 'abc@abc.com',
  name: 'abc'
})

const getPosts = id => ([
  {
    id: 1,
    title: 'Post 1',
    description: 'abc'
  },
  {
    id: 2,
    title: 'Post 2',
    description: 'def'
  }
])

const types = {}

function registerType(type) {
  types[type.name] = type
  return type
}

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId, ctx) => {
    const {id, type} = fromGlobalId(globalId)

    let item
    if (type === 'Viewer' || type === 'User') {
      item = getUser(id)
    } else {
      item = null
    }

    return { type, ...item }
  },
  (obj) => types[obj.type]
)

const ViewerType = registerType(new GraphQLObjectType({
  name: 'Viewer',
  description: 'Viewer wrapper for root query',
  fields: () => ({
    id: globalIdField('Viewer'),
    email: {type: GraphQLString, description: 'email address'},
    name: {type: GraphQLString, description: 'name'},
    posts: {
      type: new GraphQLList(PostType),
      description: 'name',
      resolve: it => {
        return getPosts(it.id)
      },
    },
  }),
  interfaces: [nodeInterface],
}))

const PostType = registerType(new GraphQLObjectType({
  name: 'Post',
  description: 'Post',
  fields: () => ({
    id: globalIdField('Post'),
    title: {type: GraphQLString, description: 'Post Title'},
    description: {type: GraphQLString, description: 'Post description'},
  }),
  interfaces: [nodeInterface],
}))

// Root Query
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: ViewerType,
      resolve: (root, args) => {
        let viewer = getUser()
        return viewer
      },
    },
  }),
})

// Root Mutation
// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     newPost: NewPostMutation,
//   }),
// })

export const schema = new GraphQLSchema({
  query: Query,
  // mutation: Mutation,
})
