# Inventory Manager API

> The API definition files for the Inventory Manager

- [Inventory Manager API](#inventory-manager-api)
  - [GraphQL](#graphql)
  - [REST](#rest)
    - [Headers](#headers)
    - [Routes](#routes)
      - [Authorization](#authorization)
      - [Document](#document)
    - [Verbs](#verbs)
      - [GET](#get)
      - [POST](#post)
      - [PUT](#put)
      - [DELETE](#delete)
    - [JSON Schema](#json-schema)
      - [Layout](#layout)

## GraphQL
The GraphQL schema is released as schema.gql and can be used with any GraphQL client.
> The GraphQL definition supports Queries, Mutations, and Subscriptions.

>The Recommended client is (Apollo)[https://www.apollographql.com] or one of our own (Inventory Manager)[https://github.com/inventory-manager]

## REST

### Headers
- `Authorization`: Token gotten from [/token](#Authorization)

### Routes
All routes go from `api.inventorymanager.com`

#### Authorization
- `/token`
#### Document
- `/document/list`: Lists all 

### Verbs
#### GET
Get queries a resource.

#### POST
Updates a resource by merging the input with the internal data.

#### PUT
Create or replaces a resource in the database.

#### DELETE
Deletes a resource in the Database.

### JSON Schema
The JSON Schemas are released as a gzipped tarball in schemas.tar.gz

#### Layout
The tarball includes a folder schemas which includes all definitions.

Schemas are named `{resource}.{input,output,search}.json`.