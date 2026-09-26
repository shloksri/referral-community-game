import { getDriver, type ApiRequest, type ApiResponse } from './_lib/neo4j.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await getDriver().verifyConnectivity()
    return res.status(200).json({ status: 'connected' })
  } catch (error) {
    console.error('Neo4j connectivity check failed', error)
    return res.status(503).json({ error: 'Could not connect to Neo4j. Check the server environment variables and database status.' })
  }
}
