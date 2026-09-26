import { allowedExperience, allowedIndustries, getDriver, type ApiRequest, type ApiResponse } from './_lib/neo4j.js'
import type { Session } from 'neo4j-driver'
type Registration = { name?: string; email?: string; linkedin?: string; role?: string; experience?: string; industry?: string; uses?: string[]; interests?: string[] }

function normalizeLinkedIn(value: string) {
  if (!value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    const hostname = url.hostname.toLowerCase()
    if (hostname !== 'linkedin.com' && hostname !== 'www.linkedin.com') return null
    return url.toString()
  } catch { return null }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Invalid registration details' })
  const data = req.body as Registration
  if (typeof data.name !== 'string' || typeof data.email !== 'string' || (data.linkedin !== undefined && typeof data.linkedin !== 'string') || (data.role !== undefined && typeof data.role !== 'string') || (data.experience !== undefined && typeof data.experience !== 'string') || (data.industry !== undefined && typeof data.industry !== 'string') || (data.uses !== undefined && (!Array.isArray(data.uses) || !data.uses.every(item => typeof item === 'string'))) || (data.interests !== undefined && (!Array.isArray(data.interests) || !data.interests.every(item => typeof item === 'string')))) return res.status(400).json({ error: 'Invalid registration details' })
  const name = data.name.trim(), email = data.email.trim().toLowerCase(), role = data.role?.trim() || null, linkedinInput = data.linkedin?.trim() || '', linkedin = normalizeLinkedIn(linkedinInput), experience = data.experience || null, industry = data.industry || null, uses = [...new Set(data.uses ?? [])], interests = [...new Set(data.interests ?? [])]
  if (!name || name.length > 80 || !email || !/^\S+@\S+\.\S+$/.test(email) || (role && role.length > 100) || (linkedinInput && !linkedin) || (experience && !allowedExperience.has(experience)) || (industry && !allowedIndustries.has(industry))) return res.status(400).json({ error: 'Invalid registration details' })
  let session: Session | undefined
  try {
    session = getDriver().session()
    const result = await session.executeWrite(tx => tx.run(`MERGE (p:Person {email: $email}) ON CREATE SET p.id = randomUUID(), p.registeredAt = datetime() SET p.name = $name, p.linkedin = $linkedin, p.role = $role, p.experience = $experience, p.updatedAt = datetime() REMOVE p.primaryTechnology WITH p OPTIONAL MATCH (p)-[old:USES|INTERESTED_IN|WORKS_IN]->() DELETE old WITH DISTINCT p FOREACH (_ IN CASE WHEN $industry IS NULL THEN [] ELSE [1] END | MERGE (industry:Industry {name: $industry}) MERGE (p)-[:WORKS_IN]->(industry)) FOREACH (techName IN $uses | MERGE (tech:Technology {name: techName}) MERGE (p)-[:USES]->(tech)) FOREACH (interestName IN $interests | MERGE (interest:Technology {name: interestName}) MERGE (p)-[:INTERESTED_IN]->(interest)) RETURN p.id AS id, p.name AS name`, { name, email, linkedin, role, experience, industry, uses, interests }))
    if (!result.records[0]) return res.status(500).json({ error: 'Registration was not saved. Please try again.' })
    return res.status(200).json(result.records[0]?.toObject())
  } catch (error) { console.error('Registration failed', error); return res.status(500).json({ error: 'Could not save your registration. Check the database connection and try again.' }) } finally { await session?.close() }
}
