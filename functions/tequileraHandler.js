const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const AWS = require('aws-sdk')
const dynamoDB = new AWS.dynamoDB.DocumentClient()
/**
 * Add a Promisify handle
 */
const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });

const TequileraType = new GraphQLObjectType({
  name: "Tequilera",
  fields: {
    id: {type: GraphQLString},
    marca: {type: GraphQLString},
    submarca: {type: GraphQLString},
    direccion: {type: GraphQLString},
  }
})

const getTequileraMethod = id => promisify(callback =>
  dynamoDb.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
  }, callback))
  .then((result) => {
    return {
      "id": result.Item.id,
      "marca": result.Item.nombre,
      "submarca": result.Item.tequilera,
      "direccion": result.Item.contenido
    };
  });


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // an arbitrary name
    fields: {
      alumno: {
        // we need to know the user's name to greet them
        args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLString) } },
        type: TequileraType,
        resolve: (parent, args) => getTequilera(args.id)
      }
    }
  }),
})

module.exports.getTequilera = (event, context, callback) =>
  graphql(schema, event.queryStringParameters.query)
  .then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result)}),
    err => callback(err)
  )
