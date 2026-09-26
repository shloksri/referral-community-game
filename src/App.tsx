import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'
import reactHydLogo from './assets/ReactHydLandscapeLogo.jpg'
import communityLogo from './assets/ref community.png'
import { Icon } from './icons'
import { allTechnologies, demoPeople, experienceBands, industries, technologyCategories, type Person } from './data'

type Route = 'home' | 'register' | 'graph' | 'challenge' | 'admin' | 'team'
const getRoute = (): Route => { const value = window.location.pathname.slice(1); return (['register', 'graph', 'challenge', 'admin', 'team'].includes(value) ? value : 'home') as Route }

const teamMembers = [
  { name: 'Shlok Srivastava', designation: 'Senior Software Engineer', linkedin: 'https://www.linkedin.com/in/shloksri/' },
  { name: 'Samhita Vetcha', designation: 'Senior Software Engineer', linkedin: 'https://www.linkedin.com/in/samhita-vetcha/' },
  { name: 'Dilip Kumar', designation: 'Software Engineer', linkedin: 'https://www.linkedin.com/in/dilip-kashyap/' },
  { name: 'Imtiyaz Alam', designation: 'Package Designer', linkedin: 'https://www.linkedin.com/in/imtiyaz865/' },
]

function Logo() {
  return <a className="brand" href="/" data-link><img className="brand-logo" src={communityLogo} alt="Referral Community" style={{width:48,height:48,objectFit:'contain',borderRadius:9}}/><span>Find your <strong>connections</strong></span></a>
}

function Shell({ children, route }: { children: ReactNode; route: Route }) {
  const [open, setOpen] = useState(false)
  return <div className="app-shell">
    <header className="topbar"><Logo /><button className="menu-button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
      <nav className={open ? 'nav open' : 'nav'}>{[['home', 'Home'], ['graph', 'Live graph'], ['challenge', 'Challenges']].map(([path, label]) => <a key={path} className={route === path ? 'active' : ''} href={path === 'home' ? '/' : `/${path}`} data-link>{label}</a>)}<a className="nav-cta" href="/register" data-link>Join the graph <Icon name="arrow" /></a></nav>
    </header>
    <div className="app-content">{children}</div>
    <footer className="site-footer">
      <p><span>Built with ❤️ by the <a href="/team" data-link>React Hyderabad Team</a></span></p>
    </footer>
  </div>
}

function NetworkArt({ compact = false }: { compact?: boolean }) {
  const nodes: [number, number, string, string][] = [[112,98,'React','tech'],[268,160,'Aarav','person'],[402,74,'GraphRAG','interest'],[548,150,'Maya','person'],[650,78,'Python','tech'],[184,300,'Neo4j','tech'],[354,278,'Kabir','person'],[502,328,'AI Agents','interest'],[92,445,'Cypher','tech'],[294,466,'Diya','person'],[476,470,'AWS','tech'],[640,438,'Arjun','person']]
  return <div className={compact ? 'network-art compact' : 'network-art'} aria-hidden="true"><svg viewBox="0 0 720 560"><g className="edges"><path d="M112 98 268 160 402 74 548 150 650 78M268 160 184 300 354 278 502 328 548 150M184 300 92 445 294 466 354 278 476 470 502 328 640 438"/><path d="M112 98 184 300M402 74 354 278M650 78 502 328M294 466 502 328"/></g>{nodes.map(([x,y,label,type], i) => <g key={label} className={`node ${type}`} transform={`translate(${x} ${y})`} style={{animationDelay:`${i * -.33}s`}}><circle r={type === 'person' ? 27 : 34}/>{type === 'person' && <path className="avatar-glyph" d="M0-13a7 7 0 1 1 0 14 7 7 0 0 1 0-14ZM-13 16c1-8 5.4-12 13-12s12 4 13 12"/>}<text y={type === 'person' ? 47 : 55}>{label}</text></g>)}</svg></div>
}

function Home() {
  return <main><section className="hero-section"><div className="hero-copy"><div className="eyebrow"><span /> Referral Community experience</div><h1>Don’t just meet people.<br/><em>See how you connect.</em></h1><p>Join the live developer graph. Add your stack, discover shared interests, and find the people you should talk to next.</p><div className="hero-actions"><a className="button primary" href="/register" data-link>Join the graph <Icon name="arrow" /></a><a className="button ghost" href="/graph" data-link><Icon name="graph" /> Explore live graph</a></div><div className="mini-stats"><div><strong>100+</strong><span>developers</span></div><div><strong>60+</strong><span>technologies</span></div><div><strong>∞</strong><span>possibilities</span></div></div></div><div className="hero-visual"><NetworkArt/><div className="live-pill"><span/> LIVE · THE GRAPH IS GROWING</div></div></section>
    <section className="how-it-works"><div><span className="section-index">01</span><h2>Become a node.<br/>Find your people.</h2></div><div className="steps"><article><span>01</span><h3>Add your stack</h3><p>Tell us what you build with and what you’re curious to learn.</p></article><article><span>02</span><h3>Watch it connect</h3><p>Your profile becomes part of the live developer community graph.</p></article><article><span>03</span><h3>Start a conversation</h3><p>Search, take a challenge, and meet someone relevant—not random.</p></article></div></section></main>
}

function TechPicker({ label, selected, onChange }: { label: string; selected: string[]; onChange: (next: string[]) => void }) {
  const [search, setSearch] = useState('')
  const toggle = (tech: string) => onChange(selected.includes(tech) ? selected.filter(x => x !== tech) : [...selected, tech])
  return <fieldset className="picker-field"><legend>{label} <small>{selected.length} selected</small></legend>{selected.length > 0 && <div className="chips">{selected.map(tech => <button type="button" key={tech} onClick={() => toggle(tech)}>{tech}<Icon name="close"/></button>)}</div>}<label className="search-input"><Icon name="search"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search technologies"/></label><div className="category-list">{technologyCategories.map(category => { const choices = category.technologies.filter(t => t.toLowerCase().includes(search.toLowerCase())); return choices.length ? <details key={category.id} open={search.length > 0 || category.id === 'frontend'}><summary>{category.name}<span>{choices.length}</span><Icon name="chevron"/></summary><div className="tech-options">{choices.map(tech => <button type="button" className={selected.includes(tech) ? 'selected' : ''} key={tech} onClick={() => toggle(tech)}><span>{selected.includes(tech) && <Icon name="check"/>}</span>{tech}</button>)}</div></details> : null })}</div></fieldset>
}

function useMediaQuery(query: string) {
  const [matches,setMatches]=useState(()=>window.matchMedia(query).matches)
  useEffect(()=>{const media=window.matchMedia(query);const update=()=>setMatches(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[query])
  return matches
}

function Register() {
  const [uses, setUses] = useState<string[]>([]), [interests, setInterests] = useState<string[]>([]), [submitted, setSubmitted] = useState(false), [busy, setBusy] = useState(false), [submitError, setSubmitError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<{ state: 'checking' | 'connected' | 'error'; message: string }>({ state: 'checking', message: 'Checking the database connection…' })
  useEffect(() => {
    const controller = new AbortController()
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health', { signal: controller.signal })
        const body: unknown = await response.json().catch(() => null)
        if (!response.ok) {
          const message = typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string' ? body.error : 'Could not connect to the database. Check the server configuration.'
          throw new Error(message)
        }
        setConnectionStatus({ state: 'connected', message: 'You are Connected... Please fill the form' })
      } catch (error) {
        if (controller.signal.aborted) return
        setConnectionStatus({ state: 'error', message: error instanceof Error ? error.message : 'Could not connect.' })
      }
    }
    void checkConnection()
    return () => controller.abort()
  }, [])
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setSubmitError('')
    const form = new FormData(event.currentTarget)
    const payload = { name: form.get('name'), email: form.get('email'), linkedin: form.get('linkedin'), role: form.get('role'), experience: form.get('experience'), industry: form.get('industry'), uses, interests }
    try {
      const response = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null)
        const message = typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string' ? body.error : `Registration failed (${response.status}). Please try again.`
        throw new Error(message)
      }
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save your registration. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  if (submitted) return <main className="success-page"><div className="success-orbit"><Icon name="check"/></div><p className="eyebrow">YOU’RE IN</p><h1>You’re part of the graph.</h1><p>Your node is now connected to the community. Head to the live graph to see where you fit.</p><div><a className="button primary" href="/graph" data-link>Find my connections <Icon name="arrow"/></a></div></main>
  return <main className="register-page"><aside><p className="eyebrow">JOIN THE COMMUNITY GRAPH</p><h1>Your stack.<br/><em>Your interests.</em><br/>Your connections.</h1><p>It takes less than a minute. Your email is only used to prevent duplicate entries and is never shown publicly.</p><NetworkArt compact/></aside><form className="registration-form" onSubmit={submit}><div className="form-head"><span>01</span><div><h2>About you</h2><p>Only your name and email are required.</p></div></div>

  <p className={`connection-status ${connectionStatus.state}`} role={connectionStatus.state === 'error' ? 'alert' : 'status'}>{connectionStatus.message}</p>
  
  <div className="two-col"><label>Name<input required name="name" placeholder="Your name"/></label><label>Email<input required type="email" name="email" placeholder="you@example.com"/></label></div><div className="two-col"><label>LinkedIn (optional)<input type="url" name="linkedin" placeholder="https://linkedin.com/in/your-profile"/></label><label>Role (optional)<input name="role" maxLength={100} placeholder="e.g. Full stack engineer"/></label></div><div className="two-col"><label>Work experience (optional)<select name="experience" defaultValue=""><option value="">Select range</option>{experienceBands.map(x => <option key={x}>{x}</option>)}</select></label><label>Industry (optional)<select name="industry" defaultValue=""><option value="">Select industry</option>{industries.map(x => <option key={x}>{x}</option>)}</select></label></div><div className="form-head"><span>02</span><div><h2>Your toolkit</h2><p>Select any technologies you actively use.</p></div></div><TechPicker label="Technologies I use (optional)" selected={uses} onChange={setUses}/><div className="form-head"><span>03</span><div><h2>What’s next?</h2><p>Choose any technologies you want to learn.</p></div></div><TechPicker label="Learning interests (optional)" selected={interests} onChange={setInterests}/>{submitError&&<p className="form-error" role="alert">{submitError}</p>}<button className="button primary submit" disabled={busy}>{busy ? 'Connecting…' : 'Add me to the graph'} <Icon name="arrow"/></button></form></main>
}

function GraphCanvas({ people, selected, onSelect }: { people: Person[]; selected?: string; onSelect: (id?: string) => void }) {
  const compact=useMediaQuery('(max-width: 600px)'), width=compact?420:860, height=compact?680:600, cx=width/2, cy=height/2
  const techs=Array.from(new Set(people.flatMap(p=>p.uses))).slice(0,12), personRadiusX=compact?155:235, personRadiusY=compact?280:210, techRadiusX=compact?72:110, techRadiusY=compact?145:95
  const persons=people.map((p,i)=>({...p,x:cx+Math.cos(i/people.length*Math.PI*2)*personRadiusX,y:cy+Math.sin(i/people.length*Math.PI*2)*personRadiusY})),techPoints=techs.map((name,i)=>({name,x:cx+Math.cos(i/techs.length*Math.PI*2+.22)*techRadiusX,y:cy+Math.sin(i/techs.length*Math.PI*2+.22)*techRadiusY}))
  const personNodes=persons.map(p=>{const node=<g className={`graph-person ${selected===p.id?'selected':''}`} transform={`translate(${p.x} ${p.y})`} onClick={e=>{e.stopPropagation();if(!p.linkedin)onSelect(p.id)}}><circle r="22"/><path className="avatar-glyph" d="M0-11a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM-10 13c.8-6.5 4.2-9.5 10-9.5s9.2 3 10 9.5"/><text y="38">{p.name.split(' ')[0]}</text></g>;return p.linkedin?<a key={p.id} href={p.linkedin} target="_blank" rel="noreferrer" aria-label={`Open ${p.name}'s LinkedIn profile`}>{node}</a>:<g key={p.id}>{node}</g>})
  return <svg className="graph-canvas" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" onClick={()=>onSelect()}><g className="graph-lines">{persons.flatMap(p=>p.uses.map(tech=>{const t=techPoints.find(x=>x.name===tech); return t?<line key={`${p.id}-${tech}`} x1={p.x} y1={p.y} x2={t.x} y2={t.y}/>:null}))}</g>{techPoints.map(t=><g className="graph-tech" transform={`translate(${t.x} ${t.y})`} key={t.name}><circle r="28"/><text y="45">{t.name}</text></g>)}{personNodes}</svg>
}

function LiveGraph() {
  const [people,setPeople]=useState<Person[]>([]), [loading,setLoading]=useState(true), [graphError,setGraphError]=useState(''), [technology,setTechnology]=useState('All technologies'), [experience,setExperience]=useState('Any experience'), [relationship,setRelationship]=useState('Uses'), [selected,setSelected]=useState<string>()
  useEffect(()=>{
    const controller=new AbortController()
    const loadGraph=async()=>{try{const response=await fetch('/api/graph',{cache:'no-store',signal:controller.signal});const data:unknown=await response.json().catch(()=>null);if(!response.ok){const message=typeof data==='object'&&data!==null&&'error'in data&&typeof data.error==='string'?data.error:'Could not load the community graph.';throw new Error(message)}if(typeof data!=='object'||data===null||!('people'in data)||!Array.isArray(data.people))throw new Error('The server returned an invalid community graph response.');setPeople(data.people)}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError')){setGraphError(error instanceof Error?error.message:'Could not load the community graph.');setPeople([])}}finally{if(!controller.signal.aborted)setLoading(false)}}
    void loadGraph()
    return()=>controller.abort()
  },[])
  const filtered=useMemo(()=>people.filter(p=>(technology==='All technologies'||(relationship==='Interested in'?p.interests:p.uses).includes(technology))&&(experience==='Any experience'||p.experience===experience)),[people,technology,experience,relationship]), person=people.find(p=>p.id===selected), techCount=new Set(people.flatMap(p=>p.uses)).size, connectionCount=people.reduce((n,p)=>n+p.uses.length+p.interests.length+1,0)
  return <main className="graph-page"><section className="graph-header"><div><div className="eyebrow"><span/> LIVE COMMUNITY MAP</div><h1>Explore the room.</h1><p>Search by technology, experience, or intent. No Cypher required.</p></div><div className="graph-stats"><div><strong>{loading?'—':people.length}</strong><span>developers</span></div><div><strong>{loading?'—':techCount}</strong><span>technologies</span></div><div><strong>{loading?'—':connectionCount}</strong><span>connections</span></div></div></section><section className="query-builder"><div className="query-label"><Icon name="search"/><span>Find people who</span></div><select disabled={loading} value={relationship} onChange={e=>setRelationship(e.target.value)}><option>Uses</option><option>Interested in</option></select><select disabled={loading} value={technology} onChange={e=>setTechnology(e.target.value)}><option>All technologies</option>{allTechnologies.map(t=><option key={t}>{t}</option>)}</select><select disabled={loading} value={experience} onChange={e=>setExperience(e.target.value)}><option>Any experience</option>{experienceBands.map(x=><option key={x}>{x}</option>)}</select><span className="result-count">{loading?'Loading…':graphError?'Unavailable':`${filtered.length} matches`}</span></section><section className="graph-workspace"><div className="graph-legend"><span><i className="person-dot"/> Person</span><span><i className="tech-dot"/> Technology</span><span><i className="interest-dot"/> Learning interest</span></div>{loading?<div className="network-loader" role="status"><span className="loader-network"><i/><i/><i/></span><h2>Your network loading....</h2><p>Finding your community connections</p></div>:graphError?<div className="empty-state" role="alert"><Icon name="close"/><h2>Could not load connections</h2><p>{graphError}</p></div>:<GraphCanvas people={filtered} selected={selected} onSelect={setSelected}/>} {!loading&&!graphError&&person&&<aside className="person-panel"><button onClick={()=>setSelected(undefined)}><Icon name="close"/></button><div className="person-avatar">{person.name.split(' ').map(x=>x[0]).join('')}</div><p className="eyebrow">COMMUNITY MEMBER</p><h2>{person.name}</h2><p>{[person.role,person.experience,person.industry].filter(Boolean).join(' · ')||'Community member'}</p><dl>{person.uses.length>0&&<><dt>Uses</dt><dd>{person.uses.join(' · ')}</dd></>}{person.interests.length>0&&<><dt>Learning</dt><dd>{person.interests.join(' · ')}</dd></>}</dl></aside>}{!loading&&!graphError&&!filtered.length&&<div className="empty-state"><Icon name="search"/><h2>No connections found</h2><p>Try removing a filter or choosing another technology.</p></div>}</section></main>
}

function Team() {
  return <main className="team-page">
    <a className="team-logo" href="https://www.linkedin.com/company/reacthyderabad/" target="_blank" rel="noreferrer" aria-label="React Hyderabad on LinkedIn">
      <img src={reactHydLogo} alt="React Hyderabad" width={420} height={210} />
    </a>
    {/* <p className="eyebrow"><span /> The organizers</p> */}
    <h1>React Hyderabad<br /><em>Team</em></h1>
    <p></p>
    <ul className="team-grid">
      {teamMembers.map(member => <li key={member.name}>
        {/* <div className="person-avatar" aria-hidden="true">{member.name.split(' ').map(part => part[0]).join('')}</div> */}
        <h2>{member.name}</h2>
        <p>{member.designation}</p>
        <a href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </li>)}
    </ul>
    <a className="button primary" href="/" data-link>Back to Home</a>
  </main>
}

function Challenges() {
  const missions=[{level:'01',title:'Find your overlap',text:'Meet someone who uses one of your learning interests.',tag:'Warm-up',color:'cyan'},{level:'02',title:'Cross the stack',text:'Find someone who works with a different technology stack.',tag:'Explorer',color:'purple'},{level:'03',title:'Leave your bubble',text:'Find someone who shares one of your technologies but works in another industry.',tag:'Connector',color:'orange'},{level:'04',title:'Trace the path',text:'Find the shortest connection between React and GraphRAG.',tag:'Graph thinker',color:'pink'}]
  return <main className="challenge-page"><section><p className="eyebrow">NETWORKING MISSIONS</p><h1>Turn the graph into<br/><em>real conversations.</em></h1><p>Four missions. One room full of possible connections. Pick a challenge and go find your person.</p></section><div className="challenge-grid">{missions.map((m,i)=><article key={m.level} className={m.color}><div><span>LEVEL {m.level}</span><small>{m.tag}</small></div><h2>{m.title}</h2><p>{m.text}</p><a href="/graph" data-link>Start challenge <Icon name="arrow"/></a><b>0{i+1}</b></article>)}</div></main>
}

function Admin() {
  const [unlocked,setUnlocked]=useState(false), [error,setError]=useState('')
  const authenticate=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setError('');const password=String(new FormData(e.currentTarget).get('password')||'');try{const response=await fetch('/api/admin/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});if(!response.ok)throw new Error();setUnlocked(true)}catch{setError('That password did not match. Please try again.')}}
  if(!unlocked)return <main className="admin-login"><div className="admin-icon"><Icon name="graph"/></div><p className="eyebrow">EVENT CONTROL</p><h1>Admin access</h1><p>Enter the event password to manage registrations.</p><form onSubmit={authenticate}><input name="password" type="password" placeholder="Event password" required/><button className="button primary">Continue <Icon name="arrow"/></button></form>{error&&<p className="form-error" role="alert">{error}</p>}</main>
  return <main className="admin-page"><div className="admin-heading"><div><p className="eyebrow">EVENT CONTROL</p><h1>Good evening.</h1><p>Your community graph is live and growing.</p></div><span className="status-badge"><i/> Registration open</span></div><div className="admin-cards"><article><Icon name="users"/><strong>8</strong><span>Registered attendees</span></article><article><Icon name="graph"/><strong>17</strong><span>Active technologies</span></article><article><Icon name="spark"/><strong>34</strong><span>Learning interests</span></article></div><section className="admin-table"><div><h2>Recent registrations</h2><button className="button ghost"><Icon name="filter"/> Filter</button></div>{demoPeople.slice(0,5).map(p=><article key={p.id}><span className="table-avatar">{p.name[0]}</span><div><strong>{p.name}</strong><small>{p.name.toLowerCase().replace(' ','.')}@example.com</small></div><span>{p.uses[0]??'—'}</span><span>{p.experience??'—'}</span><button>•••</button></article>)}</section></main>
}

export default function App() {
  const [route,setRoute]=useState<Route>(getRoute())
  useEffect(()=>{const click=(e:MouseEvent)=>{const anchor=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-link]');if(!anchor||anchor.target)return;e.preventDefault();history.pushState({},'',anchor.href);setRoute(getRoute());window.scrollTo(0,0)};const pop=()=>setRoute(getRoute());document.addEventListener('click',click);window.addEventListener('popstate',pop);return()=>{document.removeEventListener('click',click);window.removeEventListener('popstate',pop)}},[])
  return <Shell route={route}>{route==='home'?<Home/>:route==='register'?<Register/>:route==='graph'?<LiveGraph/>:route==='challenge'?<Challenges/>:route==='team'?<Team/>:<Admin/>}</Shell>
}
