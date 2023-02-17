const { request, gql } = require('graphql-request')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
const port = 3001
const token = 'web-test-20230216Rtgto'
const endpoint = 'https://dropmail.me/api/graphql/' + token

app.get('/', async (req, res) => {
  const email = await main().catch((error) => console.error(error))
  res.json(email)
})

app.get('/:id', async (req, res) => {
  const id = req.params.id
  const specificEmail = await specificQuery(id).catch((error) => console.error(error))
  res.json(specificEmail)
})

async function main() {
  const query = gql`
    mutation {introduceSession {id, expiresAt, addresses {address}, mails {rawSize, fromAddr, toAddr, downloadUrl, text, headerSubject}}}
  `
  const data = await request(endpoint, query)
  console.log('foi porra')
  return data
}

async function specificQuery(requestId) {
  const query = gql`
    query ($id: ID!) {session(id:$id) { addresses {address}, mails{rawSize, fromAddr, toAddr, downloadUrl, text, headerSubject}} }
  `
  const variables = {"id": requestId}

  const data = await request(endpoint, query, variables)
  return data
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})