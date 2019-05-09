'use strict';

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
  })

const TequilaType = new GraphQLObjectType({
  name: "Tequila",
  fields: {
    id: {type: GraphQLString},
    nombre: {type: GraphQLString},
    tequilera: {type: GraphQLString},
    contenido: {type: GraphQLString},
    fabrica: {type: GraphQLString},
    fechaCompra: {type: GraphQLString},
    fechaProduccion: {type: GraphQLString},
    tipo: {type: GraphQLString},
    username: {type: GraphQLString},
  }
})

const getTequila = id => promisify(callback =>
  dynamoDb.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
  }, callback))
  .then((result) => {
    return {
      "id": result.Item.id,
      "nombre": result.Item.nombre,
      "tequilera": result.Item.tequilera,
      "contenido": result.Item.contenido,
      "fabrica":result.Item.fabrica,
      "fechaCompra": result.Item.fechaCompra,
      "fechaProduccion": result.Item.fechaProduccion,
      "tipo":result.Item.tipo,
      "username":result.Item.username,
    };
  });

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      fields: {
        alumno: {
          args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLString) } },
          type: TequileraType,
          resolve: (parent, args) => getTequilera(args.id)
        }
      }
    })
  })
  
  module.exports.getTequila = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
    .then(
      result => callback(null, { statusCode: 200, body: JSON.stringify(result)}),
      err => callback(err))
