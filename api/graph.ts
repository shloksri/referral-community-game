import { getDriver, type ApiRequest, type ApiResponse } from './_lib/neo4j.js'
import type { Session } from 'neo4j-driver'
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  let session: Session | undefined
  try {
    session = getDriver().session({ defaultAccessMode: 'READ' })
    const result = await session.executeRead(tx => tx.run(`MATCH (p:Person) OPTIONAL MATCH (p)-[:USES]->(used:Technology) OPTIONAL MATCH (p)-[:INTERESTED_IN]->(interest:Technology) OPTIONAL MATCH (p)-[:WORKS_IN]->(industry:Industry) RETURN p.id AS id, p.name AS name, p.linkedin AS linkedin, p.role AS role, p.experience AS experience, p.registeredAt AS registeredAt, industry.name AS industry, collect(DISTINCT used.name) AS uses, collect(DISTINCT interest.name) AS interests ORDER BY registeredAt DESC LIMIT 250`))
    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=5')
    return res.status(200).json({ people: result.records.map(record => record.toObject()) })
  } catch (error) { console.error('Graph fetch failed', error); return res.status(500).json({ error: 'Could not load the community graph. Check the database connection and try again.' }) } finally { await session?.close() }
}
