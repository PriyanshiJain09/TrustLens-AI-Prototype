import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Code2,
  Compass,
  ExternalLink,
  FileSearch,
  Filter,
  Flag,
  Gift,
  GraduationCap,
  House,
  Lightbulb,
  Link2,
  ListFilter,
  LoaderCircle,
  LockKeyhole,
  Menu,
  MessageSquareWarning,
  MoreHorizontal,
  Network,
  PanelLeftClose,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRound,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react"

type Page = "dashboard" | "discover" | "saved" | "investigate" | "reports" | "profile"
type Opportunity = {
  id: number
  title: string
  org: string
  type: string
  compensation: string
  location: string
  deadline: string
  days: number
  match: number
  risk: number
  verified: boolean
  logo: string
  logoClass: string
  skills: string[]
  source: string
  description: string
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: "AI Product Intern",
    org: "Microsoft",
    type: "Internship",
    compensation: "₹80K / month",
    location: "Bengaluru · Hybrid",
    deadline: "May 28",
    days: 5,
    match: 96,
    risk: 6,
    verified: true,
    logo: "M",
    logoClass: "logo-microsoft",
    skills: ["Python", "Machine Learning", "Product"],
    source: "careers.microsoft.com",
    description:
      "Join the Copilot product team to prototype intelligent experiences, partner with engineers, and turn student insights into scalable product features.",
  },
  {
    id: 2,
    title: "Google Solution Challenge 2025",
    org: "Google Developer Student Clubs",
    type: "Hackathon",
    compensation: "$3,000 prize",
    location: "Global · Remote",
    deadline: "Jun 02",
    days: 10,
    match: 92,
    risk: 4,
    verified: true,
    logo: "G",
    logoClass: "logo-google",
    skills: ["React", "APIs", "Problem Solving"],
    source: "developers.google.com",
    description:
      "Build a solution for one of the UN Sustainable Development Goals using Google technologies and receive mentorship from industry experts.",
  },
  {
    id: 3,
    title: "Women in Tech Scholarship",
    org: "Adobe",
    type: "Scholarship",
    compensation: "₹1.5L grant",
    location: "India",
    deadline: "Jun 14",
    days: 22,
    match: 87,
    risk: 8,
    verified: true,
    logo: "A",
    logoClass: "logo-adobe",
    skills: ["Leadership", "Design", "Technology"],
    source: "adobe.com/scholarships",
    description:
      "A grant and mentoring program supporting high-potential women building careers at the intersection of technology and creativity.",
  },
  {
    id: 4,
    title: "Junior AI Engineer — Urgent",
    org: "NovaTech Global",
    type: "Job",
    compensation: "₹32L / year",
    location: "Remote",
    deadline: "Today",
    days: 0,
    match: 71,
    risk: 89,
    verified: false,
    logo: "N",
    logoClass: "logo-risk",
    skills: ["Python", "LLMs", "Prompting"],
    source: "novatech-careers.net",
    description:
      "Immediate remote opening promising unusually high compensation. Recruiter requests a refundable equipment deposit before interview scheduling.",
  },
]

const nav: { id: Page label: string icon: typeof House badge?: string }[] = [
  { id: "dashboard", label: "Overview", icon: House },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "saved", label: "Saved & Tracker", icon: Bookmark, badge: "4" },
  { id: "investigate", label: "AI Investigator", icon: FileSearch },
  { id: "reports", label: "Community", icon: Users },
  { id: "profile", label: "Profile & Goals", icon: CircleUserRound },
]

function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "danger"
  onClick?: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function RiskBadge({ risk }: { risk: number }) {
  const level =
    risk < 30 ? "Low risk" : risk < 70 ? "Moderate risk" : "High risk"
  const tone = risk < 30 ? "safe" : risk < 70 ? "warning" : "danger"
  return (
    <span className={`badge badge-${tone}`}>
      {risk < 30 ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
      {level}
    </span>
  )
}

function OpportunityCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: Opportunity
  saved: boolean
  onSave: () => void
  onOpen: () => void
}) {
  return (
    <article
      className={`opportunity-card ${item.risk > 70 ? "risk-card" : ""}`}
    >
      <div className="op-card-top">
        <div className={`company-logo ${item.logoClass}`}>{item.logo}</div>
        <button
          className={`icon-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          aria-label={saved ? "Remove bookmark" : "Bookmark opportunity"}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="op-heading">
        <div className="eyebrow-row">
          <span>{item.type}</span>
          <span>·</span>
          <span>{item.location}</span>
        </div>
        <h3>{item.title}</h3>
        <p className="org-line">
          {item.org}
          {item.verified && (
            <CheckCircle2 size={14} className="verified-icon" />
          )}
        </p>
      </div>
      <div className="skill-row">
        {item.skills.slice(0, 2).map((skill) => (
          <span className="skill-chip" key={skill}>
            {skill}
          </span>
        ))}
        <span className="skill-chip">+{item.skills.length}</span>
      </div>
      <div className="op-meta">
        <span>
          <Gift size={15} /> {item.compensation}
        </span>
        <span className={item.days <= 5 ? "deadline-urgent" : ""}>
          <Clock3 size={15} />{" "}
          {item.days === 0 ? "Closes today" : `${item.days} days left`}
        </span>
      </div>
      <div className="op-footer">
        <div className="score-lockup">
          <div className={`match-ring ${item.match < 80 ? "match-mid" : ""}`}>
            <span>{item.match}</span>
          </div>
          <div>
            <strong>{item.match}% match</strong>
            <small>Based on your profile</small>
          </div>
        </div>
        <div className="card-actions">
          <RiskBadge risk={item.risk} />
          <button
            className="round-arrow"
            onClick={onOpen}
            aria-label={`View ${item.title}`}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [page, setPage] = useState<Page>("dashboard")
  const [saved, setSaved] = useState<number[]>([1, 3, 4])
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [query, setQuery] = useState("")
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState("")

  const toggleSave = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
    setToast(
      saved.includes(id)
        ? "Removed from saved opportunities"
        : "Saved to your deadline tracker",
    )
  }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const navigate = (next: Page) => {
    setPage(next)
    setMobileNav(false)
    setSelected(null)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand" onClick={() => navigate("dashboard")}>
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>
          <div>
            <strong>
              Opportunity<span>AI</span>
            </strong>
            <small>Student intelligence</small>
          </div>
        </div>
        <button
          className="sidebar-close"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu"
        >
          <PanelLeftClose size={20} />
        </button>

        <div className="profile-mini" onClick={() => navigate("profile")}>
          <div className="avatar">AK</div>
          <div>
            <strong>Ananya Kapoor</strong>
            <small>CS Student · 84% complete</small>
          </div>
          <ChevronRight size={16} />
        </div>

        <nav className="main-nav">
          <p className="nav-label">Workspace</p>
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={page === item.id ? "active" : ""}
                onClick={() => navigate(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <em>{item.badge}</em>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-insight">
          <div className="insight-icon">
            <WandSparkles size={18} />
          </div>
          <strong>Your profile is getting noticed</strong>
          <p>You match 12 new opportunities this week.</p>
          <button onClick={() => navigate("discover")}>
            Explore matches <ArrowRight size={14} />
          </button>
        </div>

        <div className="sidebar-bottom">
          <button onClick={() => navigate("profile")}>
            <Settings size={18} /> Settings
          </button>
          <button>
            <MessageSquareWarning size={18} /> Help & feedback
          </button>
        </div>
      </aside>

      {mobileNav && (
        <button
          className="nav-scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
          <div className="global-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) =>
                event.key === "Enter" && navigate("discover")
              }
              placeholder="Search roles, skills, companies..."
            />
            <span className="key-hint">⌘ K</span>
          </div>
          <div className="top-actions">
            <button
              className="tinyfish-pill"
              onClick={() => navigate("investigate")}
            >
              <Zap size={14} /> Live web intelligence
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <i />
            </button>
            <button className="top-avatar" onClick={() => navigate("profile")}>
              AK
            </button>
          </div>
        </header>

        <div className="page-content">
          {page === "dashboard" && (
            <Dashboard
              saved={saved}
              onSave={toggleSave}
              onOpen={setSelected}
              onNavigate={navigate}
              onOnboard={() => setShowOnboarding(true)}
            />
          )}
          {page === "discover" && (
            <Discover
              query={query}
              setQuery={setQuery}
              saved={saved}
              onSave={toggleSave}
              onOpen={setSelected}
            />
          )}
          {page === "saved" && (
            <Saved saved={saved} onOpen={setSelected} onSave={toggleSave} />
          )}
          {page === "investigate" && <Investigator onOpen={setSelected} />}
          {page === "reports" && <Community />}
          {page === "profile" && (
            <Profile onOnboard={() => setShowOnboarding(true)} />
          )}
        </div>
      </main>

      {selected && (
        <OpportunityDrawer
          item={selected}
          saved={saved.includes(selected.id)}
          onSave={() => toggleSave(selected.id)}
          onClose={() => setSelected(null)}
          onInvestigate={() => {
            setSelected(null)
            navigate("investigate")
          }}
        />
      )}
      {showOnboarding && (
        <Onboarding
          step={onboardingStep}
          setStep={setOnboardingStep}
          onClose={() => {
            setShowOnboarding(false)
            setOnboardingStep(1)
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </div>
  )
}

function Dashboard({
  saved,
  onSave,
  onOpen,
  onNavigate,
  onOnboard,
}: {
  saved: number[]
  onSave: (id: number) => void
  onOpen: (item: Opportunity) => void
  onNavigate: (page: Page) => void
  onOnboard: () => void
}) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="kicker">TUESDAY, MAY 23</p>
          <h1>
            Good morning, Ananya <span className="wave">✦</span>
          </h1>
          <p>
            Your opportunity radar found <strong>12 new matches</strong> while
            you were away.
          </p>
        </div>
        <Button variant="secondary" onClick={onOnboard}>
          <UserRound size={17} /> Improve my profile
        </Button>
      </section>

      <section className="hero-grid">
        <div className="match-hero">
          <div className="hero-copy">
            <span className="hero-tag">
              <Sparkles size={14} /> AI-curated for you
            </span>
            <h2>
              Find the right opportunities.
              <br />
              <em>Avoid the wrong ones.</em>
            </h2>
            <p>
              Personalized discovery, explainable skill matching, and scam
              protection — all in one place.
            </p>
            <div className="hero-actions">
              <Button onClick={() => onNavigate("discover")}>
                Explore my matches <ArrowRight size={17} />
              </Button>
              <Button variant="ghost" onClick={() => onNavigate("investigate")}>
                <ShieldCheck size={17} /> Check a listing
              </Button>
            </div>
          </div>
          <div className="radar-visual">
            <div className="radar-circle radar-outer" />
            <div className="radar-circle radar-middle" />
            <div className="radar-circle radar-inner" />
            <div className="radar-sweep" />
            <div className="radar-center">
              <Target size={22} />
            </div>
            <span className="radar-dot dot-one">
              <BriefcaseBusiness size={14} />
            </span>
            <span className="radar-dot dot-two">
              <GraduationCap size={14} />
            </span>
            <span className="radar-dot dot-three">
              <Code2 size={14} />
            </span>
            <div className="radar-label">
              <strong>96%</strong>
              <span>top match</span>
            </div>
          </div>
        </div>
        <div className="profile-score-card">
          <div className="score-header">
            <div>
              <span className="section-kicker">PROFILE STRENGTH</span>
              <h3>Stand out more</h3>
            </div>
            <div className="profile-ring">
              <strong>84</strong>
              <small>%</small>
            </div>
          </div>
          <p>Add two details to unlock even better matches.</p>
          <div className="profile-task">
            <span>
              <Check size={14} />
            </span>
            <div>
              <strong>Core skills</strong>
              <small>8 skills added</small>
            </div>
          </div>
          <div className="profile-task pending">
            <span>
              <Lightbulb size={14} />
            </span>
            <div>
              <strong>Add a portfolio</strong>
              <small>Boost matches by up to 18%</small>
            </div>
            <ChevronRight size={16} />
          </div>
          <button className="text-link" onClick={onOnboard}>
            Complete profile <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-card blue">
          <span>
            <Sparkles size={18} />
          </span>
          <div>
            <strong>24</strong>
            <small>Strong matches</small>
          </div>
          <em>+12 new</em>
        </div>
        <div className="stat-card teal">
          <span>
            <Bookmark size={18} />
          </span>
          <div>
            <strong>{saved.length}</strong>
            <small>Saved opportunities</small>
          </div>
          <em>2 closing soon</em>
        </div>
        <div className="stat-card violet">
          <span>
            <CalendarDays size={18} />
          </span>
          <div>
            <strong>3</strong>
            <small>Applications active</small>
          </div>
          <em>On track</em>
        </div>
        <div className="stat-card coral">
          <span>
            <ShieldCheck size={18} />
          </span>
          <div>
            <strong>7</strong>
            <small>Scams avoided</small>
          </div>
          <em>Protected</em>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PERSONALIZED FOR YOU</span>
            <h2>Top opportunity matches</h2>
            <p>Ranked using your skills, goals, and experience.</p>
          </div>
          <button className="text-link" onClick={() => onNavigate("discover")}>
            View all 24 <ArrowRight size={15} />
          </button>
        </div>
        <div className="card-grid">
          {opportunities.slice(0, 3).map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              saved={saved.includes(item.id)}
              onSave={() => onSave(item.id)}
              onOpen={() => onOpen(item)}
            />
          ))}
        </div>
      </section>

      <section className="bottom-grid">
        <div className="deadline-card">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">DON'T MISS OUT</span>
              <h2>Upcoming deadlines</h2>
            </div>
            <button className="icon-button">
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="deadline-list">
            {opportunities.slice(0, 3).map((item, index) => (
              <button key={item.id} onClick={() => onOpen(item)}>
                <div className={`date-tile ${index === 0 ? "urgent" : ""}`}>
                  <strong>{item.deadline.split(" ")[1]}</strong>
                  <small>{item.deadline.split(" ")[0]}</small>
                </div>
                <div className="deadline-copy">
                  <strong>{item.title}</strong>
                  <small>
                    {item.org} · {item.type}
                  </small>
                </div>
                <span className={index === 0 ? "urgent-text" : ""}>
                  {item.days}d left
                </span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-orb">
            <ShieldCheck size={26} />
          </div>
          <span className="section-kicker">TRUST INTELLIGENCE</span>
          <h2>
            Before you apply,
            <br />
            know what’s real.
          </h2>
          <p>
            TinyFish checks recruiter identity, domain age, cross-source claims,
            and payment requests in real time.
          </p>
          <div className="trust-proof">
            <span>
              <Check size={13} /> 1,240 sources checked today
            </span>
            <span>
              <Zap size={13} /> Live verification
            </span>
          </div>
          <Button variant="secondary" onClick={() => onNavigate("investigate")}>
            Investigate any listing <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </>
  )
}

function Discover({
  query,
  setQuery,
  saved,
  onSave,
  onOpen,
}: {
  query: string
  setQuery: (value: string) => void
  saved: number[]
  onSave: (id: number) => void
  onOpen: (item: Opportunity) => void
}) {
  const [category, setCategory] = useState("All opportunities")
  const filtered = useMemo(
    () =>
      opportunities.filter(
        (item) =>
          (category === "All opportunities" || item.type === category) &&
          `${item.title} ${item.org} ${item.skills.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, category],
  )
  const categories = [
    "All opportunities",
    "Internship",
    "Job",
    "Hackathon",
    "Scholarship",
  ]
  return (
    <>
      <div className="page-title-row">
        <div>
          <span className="section-kicker">LIVE OPPORTUNITY GRAPH</span>
          <h1>Discover your next move</h1>
          <p>Fresh, verified listings ranked around your ambition.</p>
        </div>
        <div className="live-status">
          <span /> TinyFish scanning 186 sources
        </div>
      </div>
      <div className="discovery-search">
        <Search size={21} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “AI internship in Bengaluru”"
        />
        <Button>Search opportunities</Button>
      </div>
      <div className="category-tabs">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="discover-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <strong>
              <ListFilter size={17} /> Filters
            </strong>
            <button>Reset</button>
          </div>
          <FilterGroup title="Match score">
            <label>
              <input type="checkbox" defaultChecked /> 90% and above{" "}
              <span>8</span>
            </label>
            <label>
              <input type="checkbox" /> 75% and above <span>21</span>
            </label>
          </FilterGroup>
          <FilterGroup title="Work mode">
            <label>
              <input type="checkbox" /> Remote <span>32</span>
            </label>
            <label>
              <input type="checkbox" /> Hybrid <span>18</span>
            </label>
            <label>
              <input type="checkbox" /> On-site <span>12</span>
            </label>
          </FilterGroup>
          <FilterGroup title="Trust level">
            <label>
              <input type="checkbox" defaultChecked /> Verified only{" "}
              <span>54</span>
            </label>
            <label>
              <input type="checkbox" /> Include unverified <span>8</span>
            </label>
          </FilterGroup>
          <FilterGroup title="Deadline">
            <label>
              <input type="radio" name="deadline" /> This week
            </label>
            <label>
              <input type="radio" name="deadline" /> This month
            </label>
            <label>
              <input type="radio" name="deadline" defaultChecked /> Anytime
            </label>
          </FilterGroup>
        </aside>
        <div className="discover-results">
          <div className="results-toolbar">
            <p>
              <strong>{filtered.length || 0} opportunities</strong> curated for
              you
            </p>
            <button>
              <Filter size={15} /> Best match <ChevronDown size={15} />
            </button>
          </div>
          <div className="card-grid two-col">
            {filtered.map((item) => (
              <OpportunityCard
                key={item.id}
                item={item}
                saved={saved.includes(item.id)}
                onSave={() => onSave(item.id)}
                onOpen={() => onOpen(item)}
              />
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              <Search size={28} />
              <h3>No exact matches yet</h3>
              <p>Try a broader title, skill, or organization.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="filter-group">
      <strong>{title}</strong>
      {children}
    </div>
  )
}

function Saved({
  saved,
  onOpen,
  onSave,
}: {
  saved: number[]
  onOpen: (item: Opportunity) => void
  onSave: (id: number) => void
}) {
  const [view, setView] = useState<"list" | "calendar">("list")
  const [statuses, setStatuses] = useState<Record<number, string>>({
    1: "Planning",
    3: "Applied",
    4: "Reviewing",
  })
  const savedItems = opportunities.filter((item) => saved.includes(item.id))
  return (
    <>
      <div className="page-title-row">
        <div>
          <span className="section-kicker">YOUR PIPELINE</span>
          <h1>Saved & deadline tracker</h1>
          <p>Keep every application moving and never miss a date.</p>
        </div>
        <div className="segmented">
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            <ListFilter size={16} /> List
          </button>
          <button
            className={view === "calendar" ? "active" : ""}
            onClick={() => setView("calendar")}
          >
            <CalendarDays size={16} /> Calendar
          </button>
        </div>
      </div>
      {view === "list" ? (
        <div className="tracker-card">
          <div className="tracker-head">
            <span>Opportunity</span>
            <span>Deadline</span>
            <span>Status</span>
            <span>Match</span>
            <span />
          </div>
          {savedItems.map((item) => (
            <div className="tracker-row" key={item.id}>
              <button className="tracker-op" onClick={() => onOpen(item)}>
                <span className={`company-logo small ${item.logoClass}`}>
                  {item.logo}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.org} · {item.type}
                  </small>
                </span>
              </button>
              <div className={item.days <= 5 ? "urgent-text" : ""}>
                <strong>{item.deadline}</strong>
                <small>
                  {item.days === 0 ? "Today" : `${item.days} days left`}
                </small>
              </div>
              <select
                value={statuses[item.id] || "Saved"}
                onChange={(event) =>
                  setStatuses({ ...statuses, [item.id]: event.target.value })
                }
              >
                <option>Saved</option>
                <option>Planning</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Reviewing</option>
              </select>
              <span className="table-match">{item.match}%</span>
              <button className="icon-button" onClick={() => onSave(item.id)}>
                <Bookmark size={17} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <CalendarView onOpen={onOpen} />
      )}
      <div className="reminder-banner">
        <div>
          <Bell size={20} />
          <span>
            <strong>Smart reminders are on</strong>
            <small>
              We’ll alert you 7 days, 3 days, and 24 hours before each deadline.
            </small>
          </span>
        </div>
        <Button variant="secondary">Manage reminders</Button>
      </div>
    </>
  )
}

function CalendarView({ onOpen }: { onOpen: (item: Opportunity) => void }) {
  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button className="icon-button">
          <ArrowLeft size={18} />
        </button>
        <h2>May 2025</h2>
        <button className="icon-button">
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="calendar-grid">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
          <span className="calendar-day-name" key={day}>
            {day}
          </span>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 2
          return (
            <button
              className={`calendar-cell ${day === 23 ? "today" : ""}`}
              key={i}
            >
              <span>{day > 0 && day <= 31 ? day : ""}</span>
              {day === 28 && (
                <em onClick={() => onOpen(opportunities[0])}>
                  Microsoft deadline
                </em>
              )}
              {day === 23 && <em className="teal-event">Portfolio review</em>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Investigator({ onOpen }: { onOpen: (item: Opportunity) => void }) {
  const [url, setUrl] = useState(
    "https://novatech-careers.net/jobs/ai-engineer",
  )
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const run = () => {
    setRunning(true)
    setComplete(false)
    window.setTimeout(() => {
      setRunning(false)
      setComplete(true)
    }, 1800)
  }
  const steps = [
    ["Live web discovery", "14 related pages found", Search],
    ["Structured extraction", "Role, salary, identity parsed", Code2],
    ["Evidence collection", "29 claims captured", Network],
    ["Cross-source verification", "6 conflicts detected", ShieldCheck],
    ["RAG-grounded analysis", "Evidence synthesized", Sparkles],
  ] as const
  return (
    <>
      <div className="investigator-hero">
        <div className="investigator-copy">
          <span className="hero-tag">
            <Zap size={14} /> Powered by TinyFish
          </span>
          <h1>Investigate before you apply.</h1>
          <p>
            Paste any job, internship, scholarship, or hackathon link. We’ll
            trace the source, verify its claims, and surface risks with
            evidence.
          </p>
        </div>
        <div className="investigator-orbit">
          <ShieldCheck size={42} />
          <span className="orbit-dot one" />
          <span className="orbit-dot two" />
          <span className="orbit-dot three" />
        </div>
      </div>
      <div className="url-investigate">
        <Link2 size={19} />
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Paste an opportunity URL or listing text..."
        />
        <Button onClick={run} disabled={running}>
          {running ? (
            <>
              <LoaderCircle size={17} className="spin" /> Investigating
            </>
          ) : (
            <>
              <FileSearch size={17} /> Investigate now
            </>
          )}
        </Button>
      </div>
      <p className="privacy-note">
        <LockKeyhole size={13} /> Your investigation is private. We never
        contact the recruiter.
      </p>
      <div className="workflow-card">
        <div className="section-heading compact">
          <div>
            <span className="section-kicker">LIVE INTELLIGENCE WORKFLOW</span>
            <h2>How TinyFish verifies a listing</h2>
          </div>
          {running && (
            <span className="scanning-badge">
              <LoaderCircle size={14} className="spin" /> Scanning live web
            </span>
          )}
        </div>
        <div className="workflow">
          {steps.map(([title, detail, Icon], index) => (
            <div
              className={`workflow-step ${running || complete ? "done" : ""}`}
              key={title}
            >
              <div className="workflow-icon">
                <Icon size={20} />
              </div>
              <div>
                <strong>{title}</strong>
                <small>{running || complete ? detail : "Waiting to run"}</small>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight size={17} className="workflow-arrow" />
              )}
            </div>
          ))}
        </div>
      </div>
      {(complete || !running) && (
        <div className="risk-report">
          <div className="risk-summary">
            <span className="section-kicker">INVESTIGATION RESULT</span>
            <div className="risk-score-large">
              <strong>89</strong>
              <span>/100</span>
            </div>
            <div className="risk-label">
              <AlertTriangle size={17} /> High risk
            </div>
            <p>
              Multiple high-confidence fraud signals were found. Do not pay or
              share sensitive information.
            </p>
            <Button variant="danger" onClick={() => onOpen(opportunities[3])}>
              View full evidence <ArrowRight size={16} />
            </Button>
          </div>
          <div className="evidence-list">
            <h3>
              Key findings <span>6 signals</span>
            </h3>
            <EvidenceItem
              severity="Critical"
              title="Upfront payment requested"
              detail="Recruiter asks for a ₹4,999 refundable equipment fee before interview."
            />
            <EvidenceItem
              severity="High"
              title="Recruiter domain mismatch"
              detail="Email uses @novatech-hiring.co; official entity uses a different domain."
            />
            <EvidenceItem
              severity="High"
              title="Website created 12 days ago"
              detail="Domain age conflicts with the company’s claim of operating since 2014."
            />
            <EvidenceItem
              severity="Medium"
              title="Salary is an outlier"
              detail="Offer is 2.8× above comparable entry-level roles across 41 sources."
            />
          </div>
        </div>
      )}
    </>
  )
}

function EvidenceItem({
  severity,
  title,
  detail,
}: {
  severity: string
  title: string
  detail: string
}) {
  return (
    <div className="evidence-item">
      <span className={`severity-dot ${severity.toLowerCase()}`} />
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      <span className="severity-label">{severity}</span>
    </div>
  )
}

function Community() {
  const [reported, setReported] = useState(false)
  return (
    <>
      <div className="page-title-row">
        <div>
          <span className="section-kicker">COMMUNITY SHIELD</span>
          <h1>Students protecting students</h1>
          <p>Shared signals strengthen every trust assessment.</p>
        </div>
        <Button onClick={() => setReported(true)}>
          <Flag size={17} /> Report a listing
        </Button>
      </div>
      <div className="community-stats">
        <div>
          <Users size={20} />
          <strong>12,840</strong>
          <span>student contributors</span>
        </div>
        <div>
          <Flag size={20} />
          <strong>386</strong>
          <span>reports reviewed</span>
        </div>
        <div>
          <ShieldCheck size={20} />
          <strong>91</strong>
          <span>fraudulent listings removed</span>
        </div>
      </div>
      {reported && (
        <div className="success-banner">
          <CheckCircle2 size={20} />
          <div>
            <strong>Report started</strong>
            <p>
              Paste the suspicious listing in AI Investigator to attach
              evidence.
            </p>
          </div>
          <Button variant="secondary">Continue</Button>
        </div>
      )}
      <div className="reports-layout">
        <div className="reports-feed">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">RECENTLY VERIFIED</span>
              <h2>Community concerns</h2>
            </div>
            <button className="text-link">View guidelines</button>
          </div>
          <CommunityReport
            initials="RS"
            time="2h ago"
            title="Fake Infosys training offer on WhatsApp"
            body="Asked for a ₹2,500 registration fee and sent an offer letter from a non-company domain."
            count={28}
            status="Confirmed fraud"
          />
          <CommunityReport
            initials="MP"
            time="Yesterday"
            title="Questionable “campus ambassador” role"
            body="Listing promises a certificate but requires candidates to buy a starter package."
            count={12}
            status="Under review"
          />
          <CommunityReport
            initials="NK"
            time="May 20"
            title="Impersonation of UNICEF fellowship"
            body="Application form collects passport data before any eligibility screening."
            count={41}
            status="Confirmed fraud"
          />
        </div>
        <aside className="safety-guide">
          <div className="trust-orb small">
            <Lightbulb size={21} />
          </div>
          <span className="section-kicker">QUICK SAFETY CHECK</span>
          <h2>Pause before sharing</h2>
          <ul>
            <li>
              <Check size={15} /> Verify the recruiter’s email domain
            </li>
            <li>
              <Check size={15} /> Never pay to secure an interview
            </li>
            <li>
              <Check size={15} /> Cross-check the official careers page
            </li>
            <li>
              <Check size={15} /> Avoid sending ID documents early
            </li>
          </ul>
          <p>Unsure? Let TinyFish investigate first.</p>
        </aside>
      </div>
    </>
  )
}

function CommunityReport({
  initials,
  time,
  title,
  body,
  count,
  status,
}: {
  initials: string
  time: string
  title: string
  body: string
  count: number
  status: string
}) {
  return (
    <article className="community-report">
      <div className="report-avatar">{initials}</div>
      <div>
        <small>Anonymous student · {time}</small>
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="report-foot">
          <span
            className={status === "Confirmed fraud" ? "confirmed" : "review"}
          >
            {status === "Confirmed fraud" ? (
              <AlertTriangle size={13} />
            ) : (
              <Clock3 size={13} />
            )}
            {status}
          </span>
          <span>
            <Users size={14} /> {count} similar reports
          </span>
        </div>
      </div>
      <button className="icon-button">
        <MoreHorizontal size={18} />
      </button>
    </article>
  )
}

function Profile({ onOnboard }: { onOnboard: () => void }) {
  return (
    <>
      <div className="profile-cover">
        <div className="cover-glow" />
        <div className="profile-identity">
          <div className="profile-avatar">AK</div>
          <div>
            <h1>Ananya Kapoor</h1>
            <p>B.Tech Computer Science · Bengaluru, India</p>
            <span>
              <Sparkles size={13} /> Open to internships & hackathons
            </span>
          </div>
        </div>
        <Button variant="secondary" onClick={onOnboard}>
          <Settings size={16} /> Edit profile
        </Button>
      </div>
      <div className="profile-layout">
        <div className="profile-main">
          <section className="settings-card">
            <div className="settings-title">
              <div>
                <span className="section-kicker">MATCHING PROFILE</span>
                <h2>Skills & interests</h2>
              </div>
              <button className="text-link" onClick={onOnboard}>
                Edit
              </button>
            </div>
            <div className="tag-cloud">
              {[
                "Python",
                "React",
                "Machine Learning",
                "Product thinking",
                "UI/UX",
                "APIs",
                "Data analysis",
                "Social impact",
              ].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
          <section className="settings-card">
            <div className="settings-title">
              <div>
                <span className="section-kicker">CAREER DIRECTION</span>
                <h2>Goals & preferred roles</h2>
              </div>
              <button className="text-link" onClick={onOnboard}>
                Edit
              </button>
            </div>
            <div className="goal-grid">
              <div>
                <Target size={18} />
                <span>
                  <small>PRIMARY GOAL</small>
                  <strong>Build real-world AI products</strong>
                </span>
              </div>
              <div>
                <BriefcaseBusiness size={18} />
                <span>
                  <small>PREFERRED ROLES</small>
                  <strong>AI Product · Frontend · ML</strong>
                </span>
              </div>
              <div>
                <Compass size={18} />
                <span>
                  <small>WORK STYLE</small>
                  <strong>Remote or hybrid</strong>
                </span>
              </div>
              <div>
                <GraduationCap size={18} />
                <span>
                  <small>EDUCATION</small>
                  <strong>Graduating in 2026</strong>
                </span>
              </div>
            </div>
          </section>
        </div>
        <aside className="profile-sidebar-card">
          <span className="section-kicker">PROFILE COMPLETENESS</span>
          <div className="completion-ring">
            <strong>84%</strong>
          </div>
          <h3>You’re almost there</h3>
          <p>Complete profiles receive 2.4× more high-confidence matches.</p>
          <ul>
            <li>
              <Check size={14} /> Education added
            </li>
            <li>
              <Check size={14} /> 8 skills added
            </li>
            <li className="pending">
              <X size={14} /> Portfolio missing
            </li>
            <li className="pending">
              <X size={14} /> Experience details
            </li>
          </ul>
          <Button onClick={onOnboard}>Finish profile</Button>
        </aside>
      </div>
    </>
  )
}

function OpportunityDrawer({
  item,
  saved,
  onSave,
  onClose,
  onInvestigate,
}: {
  item: Opportunity
  saved: boolean
  onSave: () => void
  onClose: () => void
  onInvestigate: () => void
}) {
  const dangerous = item.risk > 70
  return (
    <div className="drawer-layer">
      <button
        className="drawer-scrim"
        onClick={onClose}
        aria-label="Close details"
      />
      <aside className="detail-drawer">
        <div className="drawer-top">
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
          <div>
            <button
              className={`icon-button ${saved ? "is-saved" : ""}`}
              onClick={onSave}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>
            <button className="icon-button">
              <MoreHorizontal size={19} />
            </button>
          </div>
        </div>
        {dangerous && (
          <div className="danger-banner">
            <AlertTriangle size={20} />
            <div>
              <strong>High-risk listing detected</strong>
              <p>
                Do not share ID documents or pay fees. Review the evidence
                first.
              </p>
            </div>
          </div>
        )}
        <div className="detail-hero">
          <div className={`company-logo large ${item.logoClass}`}>
            {item.logo}
          </div>
          <span className="detail-type">{item.type}</span>
          <h2>{item.title}</h2>
          <p>
            {item.org} {item.verified && <CheckCircle2 size={15} />}
          </p>
          <div className="detail-meta">
            <span>
              <Compass size={15} /> {item.location}
            </span>
            <span>
              <Gift size={15} /> {item.compensation}
            </span>
            <span>
              <Clock3 size={15} /> {item.deadline}
            </span>
          </div>
        </div>
        <div className="detail-tabs">
          <button className="active">Overview</button>
          <button>Match analysis</button>
          <button>Trust report</button>
        </div>
        <div className="drawer-body">
          <div className="insight-pair">
            <div className="match-explain">
              <div className="big-match">{item.match}%</div>
              <div>
                <strong>Excellent profile fit</strong>
                <p>Your product and technical skills strongly align.</p>
              </div>
            </div>
            <div className={`risk-explain ${dangerous ? "danger" : ""}`}>
              <div className="big-risk">{item.risk}</div>
              <div>
                <strong>{dangerous ? "High risk" : "Trusted source"}</strong>
                <p>
                  {dangerous
                    ? "6 concerning signals"
                    : "Verified across 8 sources"}
                </p>
              </div>
            </div>
          </div>
          <section className="detail-section">
            <h3>Why this matches you</h3>
            <p>{item.description}</p>
            <div className="matched-skills">
              {item.skills.map((skill) => (
                <span key={skill}>
                  <Check size={13} /> {skill}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section skill-gap">
            <h3>Skill-gap analysis</h3>
            <div>
              <span>
                <Lightbulb size={17} />
              </span>
              <p>
                <strong>Add cloud deployment to your toolkit</strong>
                <br />A short Azure Fundamentals course could raise your match
                by 4%.
              </p>
            </div>
          </section>
          <section className="detail-section">
            <h3>Eligibility & requirements</h3>
            <ul>
              <li>Currently enrolled in a bachelor’s degree program</li>
              <li>Strong written and verbal communication</li>
              <li>Available for a 10–12 week commitment</li>
            </ul>
          </section>
          <section className="source-proof">
            <ShieldCheck size={19} />
            <div>
              <strong>
                {dangerous
                  ? "Source authenticity disputed"
                  : "Source authenticity verified"}
              </strong>
              <p>
                TinyFish checked {dangerous ? "14" : "8"} independent sources ·{" "}
                <button onClick={onInvestigate}>View cited evidence</button>
              </p>
            </div>
          </section>
        </div>
        <div className="drawer-footer">
          <Button variant="secondary" onClick={onSave}>
            <Bookmark size={17} /> {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant={dangerous ? "danger" : "primary"}
            onClick={dangerous ? onInvestigate : undefined}
          >
            {dangerous ? "Review risk report" : "Apply on official site"}{" "}
            <ExternalLink size={16} />
          </Button>
        </div>
      </aside>
    </div>
  )
}

function Onboarding({
  step,
  setStep,
  onClose,
}: {
  step: number
  setStep: (step: number) => void
  onClose: () => void
}) {
  const content = [
    {
      title: "What are you great at?",
      copy: "Choose the skills you want OpportunityAI to match.",
      tags: [
        "Python",
        "React",
        "Machine Learning",
        "UI/UX",
        "Data Analysis",
        "Java",
        "Product",
        "Cloud",
      ],
    },
    {
      title: "Where do you want to go?",
      copy: "We’ll prioritize opportunities around your goals.",
      tags: [
        "AI Engineer",
        "Product Intern",
        "Frontend Developer",
        "Data Scientist",
        "UX Designer",
        "Founder",
      ],
    },
    {
      title: "What opportunities fit now?",
      copy: "Set preferences so every recommendation feels relevant.",
      tags: [
        "Internships",
        "Jobs",
        "Hackathons",
        "Scholarships",
        "Fellowships",
        "Remote only",
      ],
    },
  ][step - 1]
  const [chosen, setChosen] = useState<string[]>([
    "Python",
    "React",
    "Machine Learning",
  ])
  return (
    <div className="modal-layer">
      <button
        className="modal-scrim"
        onClick={onClose}
        aria-label="Close onboarding"
      />
      <div className="onboarding-modal">
        <div className="onboarding-side">
          <div className="brand inverse">
            <div className="brand-mark">
              <Sparkles size={20} />
            </div>
            <strong>OpportunityAI</strong>
          </div>
          <div>
            <span>YOUR MATCHING DNA</span>
            <h2>A better profile means better opportunities.</h2>
            <p>
              Tell us what you know, what you care about, and where you want to
              go.
            </p>
          </div>
          <div className="step-list">
            {[1, 2, 3].map((number) => (
              <div key={number} className={step >= number ? "active" : ""}>
                <span>{step > number ? <Check size={14} /> : number}</span>
                <p>
                  <strong>
                    {
                      ["Skills & strengths", "Roles & goals", "Preferences"][
                        number - 1
                      ]
                    }
                  </strong>
                  <small>
                    {
                      [
                        "What you bring",
                        "Where you’re headed",
                        "What fits your life",
                      ][number - 1]
                    }
                  </small>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="onboarding-main">
          <button className="modal-close icon-button" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="onboarding-progress">
            <span style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          <span className="section-kicker">STEP {step} OF 3</span>
          <h1>{content.title}</h1>
          <p>{content.copy}</p>
          <div className="choice-grid">
            {content.tags.map((tag) => (
              <button
                key={tag}
                className={chosen.includes(tag) ? "active" : ""}
                onClick={() =>
                  setChosen(
                    chosen.includes(tag)
                      ? chosen.filter((item) => item !== tag)
                      : [...chosen, tag],
                  )
                }
              >
                {chosen.includes(tag) && <Check size={15} />}
                {tag}
              </button>
            ))}
          </div>
          {step === 1 && (
            <div className="custom-input">
              <Search size={16} />
              <input placeholder="Search or add another skill" />
            </div>
          )}
          <div className="onboarding-actions">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Back
              </Button>
            ) : (
              <span />
            )}
            <Button
              onClick={() => (step === 3 ? onClose() : setStep(step + 1))}
            >
              {step === 3 ? "Complete profile" : "Continue"}{" "}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
