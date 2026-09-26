import { allowedExperience, allowedIndustries, getDriver, type ApiRequest, type ApiResponse } from './_lib/neo4j.js'
import type { Session } from 'neo4j-driver'
type Registration = { name?: string; email?: string; role?: string; experience?: string; industry?: string; primary?: string; uses?: string[]; interests?: string[] }
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Invalid registration details' })
  const data = req.body as Registration
  if (typeof data.name !== 'string' || typeof data.email !== 'string' || typeof data.role !== 'string' || !Array.isArray(data.uses) || !data.uses.every(item => typeof item === 'string') || !Array.isArray(data.interests) || !data.interests.every(item => typeof item === 'string')) return res.status(400).json({ error: 'Invalid registration details' })
  const name = data.name.trim(), email = data.email.trim().toLowerCase(), role = data.role.trim(), uses = [...new Set(data.uses)], interests = [...new Set(data.interests)]
  if (!name || name.length > 80 || !email || !/^\S+@\S+\.\S+$/.test(email) || !role || role.length > 100 || !data.experience || !allowedExperience.has(data.experience) || !data.industry || !allowedIndustries.has(data.industry) || !data.primary || !uses.includes(data.primary) || uses.length < 1 || interests.length < 1) return res.status(400).json({ error: 'Invalid registration details' })
  let session: Session | undefined
  try {
    session = getDriver().session()
    const result = await session.executeWrite(tx => tx.run(`MERGE (p:Person {email: $email}) ON CREATE SET p.id = randomUUID(), p.registeredAt = datetime() SET p.name = $name, p.role = $role, p.experience = $experience, p.primaryTechnology = $primary, p.updatedAt = datetime() WITH p OPTIONAL MATCH (p)-[old:USES|INTERESTED_IN|WORKS_IN]->() DELETE old WITH DISTINCT p MERGE (industry:Industry {name: $industry}) MERGE (p)-[:WORKS_IN]->(industry) WITH p UNWIND $uses AS techName MERGE (tech:Technology {name: techName}) MERGE (p)-[:USES {primary: techName = $primary}]->(tech) WITH DISTINCT p UNWIND $interests AS interestName MERGE (interest:Technology {name: interestName}) MERGE (p)-[:INTERESTED_IN]->(interest) RETURN p.id AS id, p.name AS name`, { name, email, role, experience: data.experience, industry: data.industry, primary: data.primary, uses, interests }))
    if (!result.records[0]) return res.status(500).json({ error: 'Registration was not saved. Please try again.' })
    return res.status(200).json(result.records[0]?.toObject())
  } catch (error) { console.error('Registration failed', error); return res.status(500).json({ error: 'Could not save your registration. Check the database connection and try again.' }) } finally { await session?.close() }
}
