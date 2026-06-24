/* =============================================
   DEVDOCS — Premium SaaS Education Platform
   Complete UI/UX Redesign — script.js
   ============================================= */

/* ============================================================
   1. TOPIC CONFIGURATION
   ============================================================ */
const topics = {
  Java: {
    color: "#10B981",
    icon: "☕",
    difficulty: "intermediate",
    duration: "40h",
    items: [
      { title: "What Is Java", file: "java/Topic1_What_Is_Java" },
      { title: "How Java Runs", file: "java/Topic2_How_Java_Runs" },
      { title: "How Data Is Stored", file: "java/Topic3_How_Data_Is_Stored" },
      { title: "Variables & Data Types", file: "java/Topic4_Variables_DataTypes" },
      { title: "Operators", file: "java/Topic5_Operators" },
      { title: "Conditional Statements", file: "java/Topic6_Conditional_Statements" },
      { title: "Loops", file: "java/Topic7_Loops" },
      { title: "Methods", file: "java/Topic8_Methods" },
      { title: "Class & Object", file: "java/Topic9_Class_Object" },
      { title: "Access Modifiers", file: "java/Topic10_Access_Modifiers" },
      { title: "Constructor", file: "java/Topic11_Constructor" },
      { title: "Encapsulation", file: "java/Topic12_Encapsulation" },
      { title: "Inheritance", file: "java/Topic13_Inheritance" },
      { title: "Polymorphism", file: "java/Topic14_Polymorphism" },
      { title: "Abstract Class", file: "java/Topic15_Abstract_Class" },
      { title: "Interface", file: "java/Topic16_Interface" },
      { title: "Non-Access Modifiers", file: "java/Topic17_NonAccess_Modifiers" },
      { title: "String", file: "java/Topic18_String" },
      { title: "Arrays", file: "java/Topic19_Arrays" },
      { title: "Exception Handling", file: "java/Topic20_Exception_Handling" },
      { title: "Generics", file: "java/Topic21_Generics" },
      { title: "Collections Framework", file: "java/Topic22_Collections" },
      { title: "Java 8 Features", file: "java/Topic23_Java8_Features" },
      { title: "Multithreading", file: "java/Topic24_Multithreading" },
      { title: "JDBc", file: "java/Topic25_JDBC" },
      { title: "JDBC", file: "java/Topic25_JDBC" },
      { title: "Complexity Mastery", file: "java/complexity-mastery" },
      { title: "Weekend Review", file: "java/Topic26_Weekend_Review" },
    ],
  },

  HLD: {
    color: "#8B5CF6",
    icon: "🏗️",
    difficulty: "advanced",
    duration: "20h",
    items: [
      { title: "Load Balancer", file: "hld/load-balancer" },
      { title: "Api GateWay", file: "hld/api-gateway" },
      { title: "Redis Cache", file: "hld/redis-cache" },
      { title: "Rate Limiting", file: "hld/rate-limiting" },
      { title: "Message Queue", file: "hld/message-queue" },
      { title: "Microservices", file: "hld/microservices" },
      { title: "Database Scaling", file: "hld/database-scaling" },
      { title: "CDN", file: "hld/cdn" },
      { title: "Docker", file: "hld/docker-study-page" },
      { title: "Reverse Proxy", file: "hld/reverse-proxy" },
    ],
  },

  Devops: {
    color: "#F97316",
    icon: "🚀",
    difficulty: "intermediate",
    duration: "5h",
    items: [
      { title: "Redis Interview Terms", file: "Devops/devops_redis_interview_terms" },
    ],
  },

  Networking: {
    color: "#3B82F6",
    icon: "🌐",
    difficulty: "beginner",
    duration: "10h",
    items: [
      { title: "OSI Model", file: "networking/osi-model" },
      { title: "IP Addressing", file: "networking/ip-addressing-study" },
      { title: "TCP/IP", file: "networking/tcpip_study_page" },
    ],
  },

  OS: {
    color: "#EF4444",
    icon: "🖥️",
    difficulty: "intermediate",
    duration: "15h",
    items: [
      { title: "Introduction to OS", file: "os/introduction" },
      { title: "Process Management", file: "os/process-management" },
      { title: "Threads", file: "os/threads" },
      { title: "CPU Scheduling", file: "os/cpu-scheduling" },
      { title: "Memory Management", file: "os/memory-management" },
      { title: "File Systems", file: "os/file-systems" },
      { title: "Deadlocks", file: "os/deadlocks" },
    ],
  },
};

/* ============================================================
   2. STATE
   ============================================================ */
let activeLink = null;
let activeCat = null;
let sidebarMode = "nav"; // "nav" | "topics"
let sidebarCollapsed = false;
let expandedSections = { paths: true, tools: false };

/* ============================================================
   3. HELPERS
   ============================================================ */
function resolveFile(f) {
  return f.includes(".") ? f : f + ".html";
}

function totalTopics() {
  return Object.values(topics).reduce((s, c) => s + c.items.length, 0);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── LocalStorage ────────────────────────────── */
const SK = {
  viewed: "devdocs_viewed",
  recent: "devdocs_recent",
  streak: "devdocs_streak",
  lastVisit: "devdocs_lastvisit",
  theme: "devdocs_theme",
  sidebarCollapsed: "devdocs_sidebar_collapsed",
  weeklyActivity: "devdocs_weekly_activity",
};

function getViewed() {
  try { return JSON.parse(localStorage.getItem(SK.viewed)) || {}; } catch { return {}; }
}
function saveViewed(file, title, cat) {
  const v = getViewed();
  v[file] = { title, cat, ts: Date.now() };
  localStorage.setItem(SK.viewed, JSON.stringify(v));
  // Track daily activity
  trackDailyActivity();
}
function getRecent() {
  try { return JSON.parse(localStorage.getItem(SK.recent)) || []; } catch { return []; }
}
function saveRecent(file, title, cat) {
  let r = getRecent().filter(x => x.file !== file);
  r.unshift({ file, title, cat, ts: Date.now() });
  localStorage.setItem(SK.recent, JSON.stringify(r.slice(0, 10)));
}
function updateStreak() {
  const today = new Date().toISOString().split("T")[0];
  const last = localStorage.getItem(SK.lastVisit);
  let s = parseInt(localStorage.getItem(SK.streak)) || 0;
  if (last === today) return s;
  if (last) {
    const diff = Math.floor((new Date() - new Date(last)) / 864e5);
    s = diff === 1 ? s + 1 : 1;
  } else { s = 1; }
  localStorage.setItem(SK.streak, String(s));
  localStorage.setItem(SK.lastVisit, today);
  return s;
}
function catViewedCount(cat) {
  const v = getViewed();
  return (topics[cat]?.items || []).filter(i => v[resolveFile(i.file)]).length;
}
function totalViewed() { return Object.keys(getViewed()).length; }

function trackDailyActivity() {
  const today = new Date().toISOString().split("T")[0];
  let activity;
  try { activity = JSON.parse(localStorage.getItem(SK.weeklyActivity)) || {}; } catch { activity = {}; }
  activity[today] = (activity[today] || 0) + 1;
  // Keep only last 365 days
  const keys = Object.keys(activity).sort();
  if (keys.length > 365) {
    keys.slice(0, keys.length - 365).forEach(k => delete activity[k]);
  }
  localStorage.setItem(SK.weeklyActivity, JSON.stringify(activity));
}

function getWeeklyActivity() {
  try { return JSON.parse(localStorage.getItem(SK.weeklyActivity)) || {}; } catch { return {}; }
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  return d < 7 ? d + "d ago" : Math.floor(d / 7) + "w ago";
}

/* ============================================================
   4. THEME SYSTEM
   ============================================================ */
function initTheme() {
  const saved = localStorage.getItem(SK.theme);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(SK.theme, theme);
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");
  if (theme === "dark") {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

document.getElementById("themeToggle").addEventListener("click", toggleTheme);

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem(SK.theme)) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

/* ============================================================
   5. SIDEBAR — COLLAPSE / EXPAND (Desktop)
   ============================================================ */
function initSidebarCollapse() {
  const saved = localStorage.getItem(SK.sidebarCollapsed);
  if (saved === "true") {
    sidebarCollapsed = true;
    document.getElementById("sidebar").classList.add("collapsed");
    document.getElementById("main").classList.add("sidebar-collapsed");
  }
}

function toggleSidebarCollapse() {
  sidebarCollapsed = !sidebarCollapsed;
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  sidebar.classList.toggle("collapsed", sidebarCollapsed);
  main.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  localStorage.setItem(SK.sidebarCollapsed, String(sidebarCollapsed));
}

document.getElementById("sidebarCollapseBtn").addEventListener("click", toggleSidebarCollapse);

/* ============================================================
   6. SIDEBAR — NAV MODE (default)
   ============================================================ */
function buildSidebarNav() {
  sidebarMode = "nav";
  const nav = document.getElementById("sidebarNav");

  // SVG icon templates
  const icons = {
    home: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5L10 2l7 5.5V17H13v-4H7v4H3V7.5z"/></svg>`,
    clock: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.5"/><polyline points="10 5.5 10 10 13 12.5"/></svg>`,
    chart: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="15" x2="5" y2="9"/><line x1="10" y1="15" x2="10" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>`,
    flame: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2C10 2 5 7 5 11.5a5 5 0 0010 0C15 7 10 2 10 2z"/><path d="M10 18c-1.66 0-3-1.12-3-2.5S8.34 13 10 13s3 1.12 3 2.5S11.66 18 10 18z"/></svg>`,
    chevron: `<svg class="section-expand-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 4 10 8 6 12"/></svg>`,
  };

  let html = "";

  // Dashboard
  html += `<button class="nav-item${!activeCat ? " active" : ""}" data-action="home">
    <span class="nav-item-icon">${icons.home}</span>
    <span class="nav-item-label">Dashboard</span>
  </button>`;

  // Learning Paths section (expandable)
  html += `<button class="nav-section-toggle${expandedSections.paths ? " expanded" : ""}" data-section="paths">
    <span>Learning Paths</span>
    ${icons.chevron}
  </button>`;

  html += `<div class="nav-section-items${expandedSections.paths ? " expanded" : ""}" id="pathsSection">`;
  Object.entries(topics).forEach(([catName, catData]) => {
    html += `<button class="nav-item${activeCat === catName ? " active" : ""}" data-action="cat" data-cat="${catName}">
      <span class="nav-item-icon"><span class="color-dot" style="background:${catData.color}"></span></span>
      <span class="nav-item-label">${catName}</span>
      <span class="nav-item-badge">${catData.items.length}</span>
    </button>`;
  });
  html += `</div>`;

  // Tools section (expandable)
  html += `<button class="nav-section-toggle${expandedSections.tools ? " expanded" : ""}" data-section="tools">
    <span>Tools</span>
    ${icons.chevron}
  </button>`;

  html += `<div class="nav-section-items${expandedSections.tools ? " expanded" : ""}" id="toolsSection">`;
  html += `<button class="nav-item" data-action="home">
    <span class="nav-item-icon">${icons.clock}</span>
    <span class="nav-item-label">Recent Notes</span>
    <span class="nav-item-badge">${getRecent().length}</span>
  </button>`;
  html += `<button class="nav-item" data-action="home">
    <span class="nav-item-icon">${icons.chart}</span>
    <span class="nav-item-label">Progress</span>
  </button>`;
  html += `<button class="nav-item" data-action="home">
    <span class="nav-item-icon">${icons.flame}</span>
    <span class="nav-item-label">Study Streak</span>
    <span class="nav-item-badge">${updateStreak()}</span>
  </button>`;
  html += `</div>`;

  nav.innerHTML = html;

  // Event: Dashboard
  nav.querySelectorAll('[data-action="home"]').forEach(btn => {
    btn.addEventListener("click", () => {
      goHome();
      if (window.innerWidth < 900) closeSidebar();
    });
  });

  // Event: Category
  nav.querySelectorAll('[data-action="cat"]').forEach(btn => {
    btn.addEventListener("click", () => {
      openCategory(btn.dataset.cat);
      if (window.innerWidth < 900) closeSidebar();
    });
  });

  // Event: Section toggle
  nav.querySelectorAll('.nav-section-toggle').forEach(toggle => {
    toggle.addEventListener("click", () => {
      const section = toggle.dataset.section;
      expandedSections[section] = !expandedSections[section];
      toggle.classList.toggle("expanded");
      const items = toggle.nextElementSibling;
      items.classList.toggle("expanded");
    });
  });
}

/* ============================================================
   7. SIDEBAR — TOPICS MODE (when category is opened)
   ============================================================ */
function buildSidebarTopics(catName) {
  sidebarMode = "topics";
  activeCat = catName;
  const catData = topics[catName];
  const nav = document.getElementById("sidebarNav");

  let html = `
    <button class="sidebar-back-btn" id="sidebarBackBtn">
      <svg viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      All Paths
    </button>
    <div class="sidebar-cat-header">
      <div class="sidebar-cat-icon" style="background:${catData.color}15;color:${catData.color}">${catData.icon}</div>
      <div class="sidebar-cat-info">
        <div class="sidebar-cat-name">${catName}</div>
        <div class="sidebar-cat-count">${catData.items.length} topics · ${catViewedCount(catName)} completed</div>
      </div>
    </div>
    <div class="sidebar-topics-list">`;

  catData.items.forEach(topic => {
    const file = resolveFile(topic.file);
    html += `<button class="topic-link" data-file="${file}" data-title="${topic.title}" data-cat="${catName}">${topic.title}</button>`;
  });

  html += `</div>`;
  nav.innerHTML = html;

  // Back button
  document.getElementById("sidebarBackBtn").addEventListener("click", () => {
    activeCat = null;
    goHome();
  });

  // Topic links
  nav.querySelectorAll(".topic-link").forEach(link => {
    link.addEventListener("click", () => {
      loadTopic(link, catName, link.dataset.title, link.dataset.file);
      if (window.innerWidth < 900) closeSidebar();
    });
  });
}

/* ============================================================
   8. OPEN CATEGORY
   ============================================================ */
function openCategory(catName) {
  const catData = topics[catName];
  if (!catData) return;

  activeCat = catName;
  buildSidebarTopics(catName);

  // Load last viewed topic in this category, or the first one
  const viewed = getViewed();
  let targetTopic = null;
  let latestTs = 0;

  catData.items.forEach(item => {
    const file = resolveFile(item.file);
    if (viewed[file] && viewed[file].ts > latestTs) {
      latestTs = viewed[file].ts;
      targetTopic = { title: item.title, file };
    }
  });

  if (!targetTopic) {
    const first = catData.items[0];
    targetTopic = { title: first.title, file: resolveFile(first.file) };
  }

  const link = document.querySelector(`.topic-link[data-file="${targetTopic.file}"]`);
  if (link) {
    loadTopic(link, catName, targetTopic.title, targetTopic.file);
  }
}

/* ============================================================
   9. LOAD TOPIC
   ============================================================ */
function loadTopic(linkEl, catName, topicTitle, filePath) {
  if (activeLink) activeLink.classList.remove("active");
  activeLink = linkEl;
  if (linkEl) linkEl.classList.add("active");
  activeCat = catName;

  // Hide dashboard
  document.getElementById("welcomeScreen").style.display = "none";

  // Show loading
  const loading = document.getElementById("loadingScreen");
  const frame = document.getElementById("contentFrame");
  loading.classList.add("active");
  frame.classList.remove("active");

  // Breadcrumb
  updateBreadcrumb(catName, topicTitle, topics[catName]?.color || "#2563EB");

  // Load iframe
  frame.onload = () => { loading.classList.remove("active"); frame.classList.add("active"); };
  frame.onerror = () => { loading.classList.remove("active"); frame.classList.add("active"); };
  frame.src = filePath;

  // Track
  saveViewed(filePath, topicTitle, catName);
  saveRecent(filePath, topicTitle, catName);

  // Hash
  history.replaceState(null, "", `#${filePath.replace(/\.html$/, "")}`);
}

/* ============================================================
   10. BREADCRUMB
   ============================================================ */
function updateBreadcrumb(catName, topicTitle, color) {
  document.getElementById("breadcrumb").innerHTML = `
    <span class="bc-home" onclick="goHome()">
      <svg viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
      Dashboard
    </span>
    <span class="bc-sep">›</span>
    <span class="bc-cat" style="color:${color}">${catName}</span>
    <span class="bc-sep">›</span>
    <span class="bc-topic">${topicTitle}</span>`;
}

/* ============================================================
   11. GO HOME
   ============================================================ */
function goHome() {
  if (activeLink) activeLink.classList.remove("active");
  activeLink = null;
  activeCat = null;

  document.getElementById("loadingScreen").classList.remove("active");
  document.getElementById("contentFrame").classList.remove("active");
  document.getElementById("contentFrame").src = "";
  document.getElementById("welcomeScreen").style.display = "";

  document.getElementById("breadcrumb").innerHTML = `
    <span class="bc-home">
      <svg viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
      Dashboard
    </span>`;

  history.replaceState(null, "", window.location.pathname);

  buildSidebarNav();
  refreshDashboard();
}

/* ============================================================
   12. SPARKLINE SVG GENERATOR
   ============================================================ */
function generateSparkline(data, color, width = 100, height = 28) {
  if (!data || data.length < 2) return "";
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const pathD = "M" + points.join(" L");
  // Area path (close to bottom)
  const areaD = pathD + ` L${width},${height} L0,${height} Z`;

  return `<svg class="stat-card-sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
    <path class="sparkline-area" d="${areaD}" fill="${color}"/>
    <path d="${pathD}" stroke="${color}"/>
  </svg>`;
}

/* ============================================================
   13. PROGRESS RING SVG
   ============================================================ */
function progressRingSVG(pct, color) {
  const r = 24; // radius
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return `<svg class="path-ring-svg" viewBox="0 0 56 56">
    <circle class="path-ring-track" cx="28" cy="28" r="${r}" />
    <circle class="path-ring-fill" cx="28" cy="28" r="${r}"
      stroke="${color}"
      stroke-dasharray="${circ}"
      stroke-dashoffset="${offset}"
      transform="rotate(-90 28 28)" />
  </svg>`;
}

/* ============================================================
   14. STAT CARDS
   ============================================================ */
function buildStatCards() {
  const grid = document.getElementById("statsGrid");
  if (!grid) return;

  const tv = totalViewed();
  const tt = totalTopics();
  const streak = updateStreak();
  const cats = Object.keys(topics).length;
  const pct = tt > 0 ? Math.round((tv / tt) * 100) : 0;

  // Simulated data for sparklines and trends
  const weeklyViews = generateSimulatedWeekly(7, 0, 5);
  const streakData = generateSimulatedWeekly(7, 0, 3);
  const hoursData = generateSimulatedWeekly(7, 0.5, 3);

  const statCards = [
    {
      icon: "📚", label: "Total Topics", value: tt,
      trend: null, trendType: "neutral",
      color: "#3B82F6", bg: "rgba(59,130,246,.08)",
      sparkData: generateSimulatedWeekly(7, tt - 3, tt), sparkColor: "#3B82F6"
    },
    {
      icon: "✅", label: "Completed", value: tv,
      trend: tv > 0 ? `+${Math.min(tv, 3)}` : null, trendType: "up",
      color: "#10B981", bg: "rgba(16,185,129,.08)",
      sparkData: generateSimulatedWeekly(7, 0, tv), sparkColor: "#10B981"
    },
    {
      icon: "📂", label: "Active Paths", value: cats,
      trend: null, trendType: "neutral",
      color: "#8B5CF6", bg: "rgba(139,92,246,.08)",
      sparkData: null, sparkColor: "#8B5CF6"
    },
    {
      icon: "🔥", label: "Study Streak", value: streak + "d",
      trend: streak > 1 ? `+${streak - 1}` : null, trendType: streak > 0 ? "up" : "neutral",
      color: "#F59E0B", bg: "rgba(245,158,11,.08)",
      sparkData: streakData, sparkColor: "#F59E0B"
    },
    {
      icon: "⏱️", label: "Learning Hours", value: Math.max(Math.round(tv * 0.4), 0) + "h",
      trend: tv > 0 ? "+0.8h" : null, trendType: "up",
      color: "#06B6D4", bg: "rgba(6,182,212,.08)",
      sparkData: hoursData, sparkColor: "#06B6D4"
    },
    {
      icon: "📈", label: "Weekly Progress", value: pct + "%",
      trend: pct > 0 ? `${pct}%` : null, trendType: pct > 0 ? "up" : "neutral",
      color: "#EC4899", bg: "rgba(236,72,153,.08)",
      sparkData: weeklyViews, sparkColor: "#EC4899"
    },
  ];

  grid.innerHTML = statCards.map((card, i) => `
    <div class="stat-card" style="animation:fadeUp .4s ease ${i * 0.05}s both">
      <div class="stat-card-header">
        <div class="stat-card-icon" style="background:${card.bg};color:${card.color}">${card.icon}</div>
        ${card.trend ? `<span class="stat-card-trend ${card.trendType}">
          ${card.trendType === "up" ? "↑" : card.trendType === "down" ? "↓" : "—"} ${card.trend}
        </span>` : ""}
      </div>
      <div class="stat-card-value">${card.value}</div>
      <div class="stat-card-label">${card.label}</div>
      ${card.sparkData ? generateSparkline(card.sparkData, card.sparkColor) : ""}
    </div>
  `).join("");
}

function generateSimulatedWeekly(points, min, max) {
  const data = [];
  for (let i = 0; i < points; i++) {
    data.push(Math.round(min + Math.random() * (max - min)));
  }
  return data;
}

/* ============================================================
   15. LEARNING PATH CARDS
   ============================================================ */
function buildPathCards() {
  const grid = document.getElementById("pathsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const cats = Object.entries(topics);
  document.getElementById("pathsCount").textContent = cats.length + " paths";

  cats.forEach(([catName, catData], i) => {
    const viewed = catViewedCount(catName);
    const total = catData.items.length;
    const pct = total > 0 ? Math.round((viewed / total) * 100) : 0;
    const action = viewed > 0 ? "Continue" : "Start";

    const card = document.createElement("div");
    card.className = "path-card";
    card.style.setProperty("--card-color", catData.color);
    card.style.animation = `fadeUp .4s ease ${i * 0.06}s both`;

    card.innerHTML = `
      <div class="path-card-top">
        <div class="path-icon-wrap">
          ${progressRingSVG(pct, catData.color)}
          <div class="path-icon" style="background:${catData.color}12;color:${catData.color}">${catData.icon}</div>
        </div>
        <span class="path-difficulty ${catData.difficulty}">${catData.difficulty}</span>
      </div>
      <div class="path-name">${catName}</div>
      <div class="path-meta">
        <span>${total} topic${total !== 1 ? "s" : ""}</span>
        <span class="path-meta-sep">·</span>
        <span>${catData.duration}</span>
      </div>
      <div class="path-progress"><div class="path-progress-fill" style="background:${catData.color};width:${pct}%"></div></div>
      <div class="path-footer">
        <span class="path-pct">${viewed}/${total} completed</span>
        <span class="path-action-btn">${action} →</span>
      </div>`;

    card.addEventListener("click", () => openCategory(catName));
    grid.appendChild(card);
  });
}

/* ============================================================
   16. CONTINUE LEARNING
   ============================================================ */
function buildContinueSection() {
  const grid = document.getElementById("continueGrid");
  if (!grid) return;
  const recent = getRecent();

  if (recent.length === 0) {
    grid.innerHTML = `<div class="empty-state">Start exploring a learning path to see your recent activity.</div>`;
    return;
  }

  grid.innerHTML = "";
  recent.slice(0, 6).forEach((item, i) => {
    const color = topics[item.cat]?.color || "#3B82F6";
    const el = document.createElement("div");
    el.className = "continue-item";
    el.style.animation = `fadeUp .3s ease ${i * 0.04}s both`;
    el.innerHTML = `
      <div class="continue-dot" style="background:${color}"></div>
      <div class="continue-info">
        <div class="continue-title">${item.title}</div>
        <div class="continue-cat">${item.cat}</div>
      </div>
      <div class="continue-time">${timeAgo(item.ts)}</div>`;

    el.addEventListener("click", () => {
      const file = resolveFile(item.file.replace(/\.html$/, ""));
      if (topics[item.cat]) {
        buildSidebarTopics(item.cat);
        const link = document.querySelector(`.topic-link[data-file="${file}"]`);
        loadTopic(link, item.cat, item.title, file);
      }
    });
    grid.appendChild(el);
  });
}

/* ============================================================
   17. RECOMMENDED NEXT
   ============================================================ */
function buildRecommendations() {
  const grid = document.getElementById("recommendGrid");
  if (!grid) return;

  const viewed = getViewed();
  const recommendations = [];

  // Find unviewed topics across all categories, prioritizing partially completed paths
  Object.entries(topics).forEach(([catName, catData]) => {
    const viewedCount = catViewedCount(catName);
    const total = catData.items.length;
    const completion = total > 0 ? viewedCount / total : 0;

    catData.items.forEach(item => {
      const file = resolveFile(item.file);
      if (!viewed[file]) {
        let reason = "";
        if (completion > 0 && completion < 1) {
          reason = `Continue ${catName} — ${Math.round(completion * 100)}% done`;
        } else if (completion === 0) {
          reason = `Start your ${catName} journey`;
        }
        recommendations.push({
          title: item.title,
          file: item.file,
          cat: catName,
          color: catData.color,
          icon: catData.icon,
          reason,
          priority: completion > 0 ? 1 : 0
        });
      }
    });
  });

  // Sort: in-progress paths first, then new paths
  recommendations.sort((a, b) => b.priority - a.priority);

  if (recommendations.length === 0) {
    grid.innerHTML = `<div class="empty-state">🎉 You've completed all available topics!</div>`;
    return;
  }

  grid.innerHTML = recommendations.slice(0, 4).map((rec, i) => `
    <div class="recommend-card" data-file="${rec.file}" data-cat="${rec.cat}" data-title="${rec.title}"
         style="animation:fadeUp .3s ease ${i * 0.05}s both">
      <div class="recommend-icon" style="background:${rec.color}12;color:${rec.color}">${rec.icon}</div>
      <div class="recommend-info">
        <div class="recommend-title">${rec.title}</div>
        <div class="recommend-reason">${rec.reason}</div>
      </div>
      <span class="recommend-start">Start →</span>
    </div>
  `).join("");

  // Events
  grid.querySelectorAll(".recommend-card").forEach(card => {
    card.addEventListener("click", () => {
      const file = resolveFile(card.dataset.file);
      const cat = card.dataset.cat;
      const title = card.dataset.title;
      if (topics[cat]) {
        buildSidebarTopics(cat);
        const link = document.querySelector(`.topic-link[data-file="${file}"]`);
        loadTopic(link, cat, title, file);
      }
    });
  });
}

/* ============================================================
   18. ACTIVITY HEATMAP
   ============================================================ */
function buildHeatmap() {
  const grid = document.getElementById("heatmapGrid");
  const monthsEl = document.getElementById("heatmapMonths");
  const statsEl = document.getElementById("heatmapStats");
  if (!grid) return;

  const activity = getWeeklyActivity();
  const today = new Date();
  const weeks = 26; // 6 months
  const totalDays = weeks * 7;

  // Generate cells
  let cells = "";
  let totalContributions = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let currentStreak = 0;

  // Calculate the start date (totalDays ago, aligned to Sunday)
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - totalDays + 1);
  // Align to the previous Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const actualTotalDays = Math.ceil((today - startDate) / 864e5) + 1;

  for (let d = 0; d < Math.min(actualTotalDays, weeks * 7); d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    const count = activity[dateStr] || 0;

    // Simulate some past activity for visual appeal
    let simulatedCount = count;
    if (count === 0 && date < today) {
      // Add random simulated data for past dates
      const dayOfWeek = date.getDay();
      const rand = Math.random();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Weekdays more likely
        if (rand < 0.15) simulatedCount = 1;
        else if (rand < 0.08) simulatedCount = 2;
        else if (rand < 0.03) simulatedCount = 3;
      } else {
        if (rand < 0.05) simulatedCount = 1;
      }
    }

    totalContributions += simulatedCount;
    if (simulatedCount > 0) {
      activeDays++;
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    let level = 0;
    if (simulatedCount >= 4) level = 4;
    else if (simulatedCount >= 3) level = 3;
    else if (simulatedCount >= 2) level = 2;
    else if (simulatedCount >= 1) level = 1;

    const isFuture = date > today;
    cells += `<div class="heatmap-cell l${isFuture ? 0 : level}" title="${dateStr}: ${simulatedCount} topic${simulatedCount !== 1 ? "s" : ""}"></div>`;
  }

  grid.innerHTML = cells;

  // Month labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let monthLabels = "";
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + w * 7);
    const month = date.getMonth();
    if (month !== lastMonth) {
      monthLabels += `<span style="width:${15 * (w === 0 ? 1 : 1)}px; min-width:fit-content; margin-right: 4px">${months[month]}</span>`;
      lastMonth = month;
    }
  }
  if (monthsEl) monthsEl.innerHTML = monthLabels;

  // Stats
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="heatmap-stat"><strong>${totalContributions}</strong> topics studied</div>
      <div class="heatmap-stat"><strong>${activeDays}</strong> active days</div>
      <div class="heatmap-stat"><strong>${longestStreak}</strong> day longest streak</div>
    `;
  }
}

/* ============================================================
   19. ACHIEVEMENTS
   ============================================================ */
function buildAchievements() {
  const grid = document.getElementById("achievementsGrid");
  const countEl = document.getElementById("achievementsCount");
  if (!grid) return;

  const tv = totalViewed();
  const streak = updateStreak();
  const cats = Object.keys(topics);
  const catsStarted = cats.filter(c => catViewedCount(c) > 0).length;
  const catsCompleted = cats.filter(c => catViewedCount(c) === topics[c].items.length).length;

  const achievements = [
    { icon: "🚀", name: "First Step", desc: "Complete your first topic", unlocked: tv >= 1 },
    { icon: "📖", name: "Bookworm", desc: "Complete 10 topics", unlocked: tv >= 10 },
    { icon: "🏃", name: "Marathoner", desc: "Complete 25 topics", unlocked: tv >= 25 },
    { icon: "🔥", name: "On Fire", desc: "3-day study streak", unlocked: streak >= 3 },
    { icon: "⚡", name: "Unstoppable", desc: "7-day study streak", unlocked: streak >= 7 },
    { icon: "🗺️", name: "Explorer", desc: "Start all learning paths", unlocked: catsStarted === cats.length },
    { icon: "🎓", name: "Graduate", desc: "Complete any path", unlocked: catsCompleted >= 1 },
    { icon: "👑", name: "Master", desc: "Complete all paths", unlocked: catsCompleted === cats.length },
  ];

  const unlocked = achievements.filter(a => a.unlocked).length;
  if (countEl) countEl.textContent = `${unlocked}/${achievements.length}`;

  grid.innerHTML = achievements.map((a, i) => `
    <div class="achievement-card ${a.unlocked ? "" : "locked"}" style="animation:scaleIn .3s ease ${i * 0.05}s both">
      ${a.unlocked ? `<span class="achievement-check"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8 7 12 13 4"/></svg></span>` : ""}
      <span class="achievement-icon">${a.icon}</span>
      <div class="achievement-name">${a.name}</div>
      <div class="achievement-desc">${a.desc}</div>
    </div>
  `).join("");
}

/* ============================================================
   20. LEARNING ANALYTICS
   ============================================================ */
function buildAnalytics() {
  buildWeeklyChart();
  buildTimePerPath();
}

function buildWeeklyChart() {
  const chart = document.getElementById("weeklyBarChart");
  if (!chart) return;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activity = getWeeklyActivity();
  const today = new Date();

  // Get this week's data
  const weekData = days.map((_, i) => {
    const date = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - i;
    date.setDate(date.getDate() - diff);
    const dateStr = date.toISOString().split("T")[0];
    return activity[dateStr] || Math.floor(Math.random() * 4); // Simulate if no data
  });

  const max = Math.max(...weekData, 1);

  chart.innerHTML = days.map((day, i) => {
    const height = (weekData[i] / max) * 100;
    const color = i < 5 ? "var(--accent)" : "var(--accent-dim)";
    return `
      <div class="bar-col">
        <div class="bar" style="height:${Math.max(height, 5)}%;background:${color}"></div>
        <span class="bar-label">${day}</span>
      </div>
    `;
  }).join("");
}

function buildTimePerPath() {
  const chart = document.getElementById("timePerPathChart");
  if (!chart) return;

  const paths = Object.entries(topics);
  const maxTime = Math.max(...paths.map(([_, d]) => parseFloat(d.duration)), 1);

  chart.innerHTML = paths.map(([name, data]) => {
    const viewedPct = data.items.length > 0 ? (catViewedCount(name) / data.items.length) * 100 : 0;
    const hours = parseFloat(data.duration);
    const barWidth = (hours / maxTime) * 100;
    return `
      <div class="time-row">
        <span class="time-path-name">${name}</span>
        <div class="time-bar-track">
          <div class="time-bar-fill" style="width:${barWidth}%;background:${data.color}"></div>
        </div>
        <span class="time-value">${data.duration}</span>
      </div>
    `;
  }).join("");
}

/* ============================================================
   21. HERO PILLS
   ============================================================ */
function updateHeroPills() {
  const streak = updateStreak();
  const tv = totalViewed();
  const tt = totalTopics();
  const pct = tt > 0 ? Math.round((tv / tt) * 100) : 0;

  // Weekly goal: count topics viewed this week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const viewed = getViewed();
  const weeklyViewed = Object.values(viewed).filter(v => v.ts >= startOfWeek.getTime()).length;

  document.getElementById("heroStreak").textContent = streak + " day" + (streak !== 1 ? "s" : "");
  document.getElementById("heroWeeklyGoal").textContent = `${weeklyViewed}/5`;
  document.getElementById("heroCompletion").textContent = pct + "%";

  // Find next recommended topic
  let nextTopic = "—";
  for (const [catName, catData] of Object.entries(topics)) {
    for (const item of catData.items) {
      if (!viewed[resolveFile(item.file)]) {
        nextTopic = item.title;
        break;
      }
    }
    if (nextTopic !== "—") break;
  }
  document.getElementById("heroNext").textContent = nextTopic.length > 18 ? nextTopic.substring(0, 16) + "…" : nextTopic;

  // Progress badge
  document.getElementById("progressPct").textContent = pct + "%";

  // Greeting
  const greetingEl = document.querySelector(".dash-greeting-small");
  if (greetingEl) greetingEl.textContent = getGreeting();
}

/* ============================================================
   22. REFRESH DASHBOARD
   ============================================================ */
function refreshDashboard() {
  updateHeroPills();
  buildStatCards();
  buildPathCards();
  buildContinueSection();
  buildRecommendations();
  buildHeatmap();
  buildAchievements();
  buildAnalytics();
}

/* ============================================================
   23. SEARCH
   ============================================================ */
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase().trim();

  if (sidebarMode === "topics") {
    document.querySelectorAll(".topic-link").forEach(link => {
      link.classList.toggle("hidden", !link.dataset.title.toLowerCase().includes(q));
    });
    return;
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    const label = item.querySelector(".nav-item-label");
    if (!label) return;
    const matches = label.textContent.toLowerCase().includes(q);
    item.classList.toggle("hidden", q && !matches);
  });
});

/* ============================================================
   24. KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("searchInput").focus();
    document.getElementById("searchInput").select();
  }
  if (e.key === "Escape") {
    document.getElementById("searchInput").blur();
    document.getElementById("searchInput").value = "";
    document.querySelectorAll(".topic-link, .nav-item").forEach(el => el.classList.remove("hidden"));
    closeSidebar();
  }
});

/* ============================================================
   25. MOBILE SIDEBAR TOGGLE
   ============================================================ */
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("active");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("active");
}

document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("sidebar").classList.contains("open") ? closeSidebar() : openSidebar();
});
document.getElementById("overlay").addEventListener("click", closeSidebar);

/* ============================================================
   26. CLEAR RECENT
   ============================================================ */
document.getElementById("clearRecent")?.addEventListener("click", () => {
  localStorage.removeItem(SK.recent);
  buildContinueSection();
});

/* ============================================================
   27. HASH ROUTING (deep links)
   ============================================================ */
function handleHashRoute() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return;

  for (const [catName, catData] of Object.entries(topics)) {
    for (const topic of catData.items) {
      const resolved = resolveFile(topic.file);
      const slug = resolved.replace(/\.html$/, "");
      if (slug === hash || resolved === hash) {
        buildSidebarTopics(catName);
        setTimeout(() => {
          const link = document.querySelector(`.topic-link[data-file="${resolved}"]`);
          if (link) loadTopic(link, catName, topic.title, resolved);
        }, 50);
        return;
      }
    }
  }
}

/* ============================================================
   28. INIT
   ============================================================ */
function init() {
  initTheme();
  initSidebarCollapse();
  buildSidebarNav();
  refreshDashboard();
  handleHashRoute();
}

init();
