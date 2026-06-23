/* =============================================
   DEVDOCS — script.js
   Dashboard-First Developer Learning Hub
   ============================================= */

/* ============================================================
   1. TOPIC CONFIGURATION
   ============================================================ */
const topics = {
  Java: {
    color: "#3ecf8e",
    icon: "☕",
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
    color: "#a78bfa",
    icon: "🗃️",
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
    color: "#ff6b35",
    icon: "🚀",
    items: [
      { title: "Redis Interview Terms", file: "Devops/devops_redis_interview_terms" },
    ],
  },

  Networking: {
    color: "#4f8ef7",
    icon: "🌐",
    items: [
      { title: "OSI Model", file: "networking/osi-model" },
      { title: "IP Addressing", file: "networking/ip-addressing-study" },
      { title: "TCP/IP", file: "networking/tcpip_study_page" },
    ],
  },

  OS: {
    color: "#f87171",
    icon: "🖥️",
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

/* ============================================================
   3. HELPERS
   ============================================================ */
function resolveFile(f) {
  return f.includes(".") ? f : f + ".html";
}

function totalTopics() {
  return Object.values(topics).reduce((s, c) => s + c.items.length, 0);
}

/* ── LocalStorage ────────────────────────────── */
const SK = {
  viewed: "devdocs_viewed",
  recent: "devdocs_recent",
  streak: "devdocs_streak",
  lastVisit: "devdocs_lastvisit",
};

function getViewed() {
  try { return JSON.parse(localStorage.getItem(SK.viewed)) || {}; } catch { return {}; }
}
function saveViewed(file, title, cat) {
  const v = getViewed();
  v[file] = { title, cat, ts: Date.now() };
  localStorage.setItem(SK.viewed, JSON.stringify(v));
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
   4. SIDEBAR — NAV MODE (default)
   ============================================================ */
function buildSidebarNav() {
  sidebarMode = "nav";
  const nav = document.getElementById("sidebarNav");

  const navItems = [
    { icon: "🏠", label: "Dashboard", action: () => goHome(), active: !activeCat },
    { type: "divider" },
    { type: "label", text: "Learning Paths" },
  ];

  // Add category items
  Object.entries(topics).forEach(([catName, catData]) => {
    navItems.push({
      icon: catData.icon,
      label: catName,
      badge: catData.items.length,
      action: () => openCategory(catName),
      active: activeCat === catName,
      color: catData.color,
    });
  });

  navItems.push(
    { type: "divider" },
    { type: "label", text: "Tools" },
    { icon: "🕒", label: "Recent Notes", badge: getRecent().length, action: () => goHome() },
    { icon: "📊", label: "Progress", action: () => goHome() },
    { icon: "🔥", label: "Study Streak", badge: updateStreak(), action: () => goHome() },
  );

  let html = "";
  navItems.forEach(item => {
    if (item.type === "divider") {
      html += `<div class="nav-divider"></div>`;
    } else if (item.type === "label") {
      html += `<div class="nav-section-label">${item.text}</div>`;
    } else {
      html += `<button class="nav-item${item.active ? " active" : ""}" data-action="nav">
        <span class="nav-item-icon">${item.icon}</span>
        <span class="nav-item-label">${item.label}</span>
        ${item.badge !== undefined ? `<span class="nav-item-badge">${item.badge}</span>` : ""}
      </button>`;
    }
  });

  nav.innerHTML = html;

  // Attach event listeners
  const buttons = nav.querySelectorAll(".nav-item");
  let btnIdx = 0;
  navItems.forEach(item => {
    if (item.type) return;
    const btn = buttons[btnIdx++];
    if (item.action) btn.addEventListener("click", () => {
      item.action();
      if (window.innerWidth < 900) closeSidebar();
    });
  });
}

/* ============================================================
   5. SIDEBAR — TOPICS MODE (when category is opened)
   ============================================================ */
function buildSidebarTopics(catName) {
  sidebarMode = "topics";
  activeCat = catName;
  const catData = topics[catName];
  const nav = document.getElementById("sidebarNav");

  // Back button
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
   6. OPEN CATEGORY (transition from dashboard to learning mode)
   ============================================================ */
function openCategory(catName) {
  const catData = topics[catName];
  if (!catData) return;

  activeCat = catName;

  // Build topics sidebar
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

  // Find and activate the link
  const link = document.querySelector(`.topic-link[data-file="${targetTopic.file}"]`);
  if (link) {
    loadTopic(link, catName, targetTopic.title, targetTopic.file);
  }
}

/* ============================================================
   7. LOAD TOPIC
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
  updateBreadcrumb(catName, topicTitle, topics[catName]?.color || "#3B82F6");

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
   8. BREADCRUMB
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
   9. GO HOME (back to dashboard)
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

  // Rebuild sidebar to nav mode & refresh dashboard
  buildSidebarNav();
  refreshDashboard();
}

/* ============================================================
   10. DASHBOARD — Learning Path Cards
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

    const card = document.createElement("div");
    card.className = "path-card";
    card.style.setProperty("--card-color", catData.color);
    card.style.animationDelay = `${i * 0.05}s`;
    card.style.animation = "fadeUp .4s ease both";

    const action = viewed > 0 ? "Continue →" : "Start →";

    card.innerHTML = `
      <div class="path-card-top">
        <div class="path-icon" style="background:${catData.color}12;color:${catData.color}">${catData.icon}</div>
        <div class="path-arrow">→</div>
      </div>
      <div class="path-name">${catName}</div>
      <div class="path-count">${total} topic${total !== 1 ? "s" : ""}</div>
      <div class="path-progress"><div class="path-progress-fill" style="background:${catData.color};width:${pct}%"></div></div>
      <div class="path-footer">
        <span class="path-pct">${viewed}/${total}</span>
        <span class="path-action">${action}</span>
      </div>`;

    card.addEventListener("click", () => openCategory(catName));
    grid.appendChild(card);
  });
}

/* ============================================================
   11. DASHBOARD — Continue Learning (recently viewed)
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
      // Switch sidebar to that category's topics
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
   12. DASHBOARD — Quick Stats
   ============================================================ */
function buildQuickStats() {
  const grid = document.getElementById("qstatsGrid");
  if (!grid) return;

  const tv = totalViewed(), tt = totalTopics();
  const pct = tt > 0 ? Math.round((tv / tt) * 100) : 0;

  let maxCat = "—", maxCnt = 0;
  Object.keys(topics).forEach(c => {
    const cnt = catViewedCount(c);
    if (cnt > maxCnt) { maxCnt = cnt; maxCat = c; }
  });

  grid.innerHTML = `
    <div class="qstat">
      <div class="qstat-label">Completion</div>
      <div class="qstat-value">${pct}%</div>
      <div class="qstat-sub">${tv} of ${tt} topics</div>
    </div>
    <div class="qstat">
      <div class="qstat-label">Most Studied</div>
      <div class="qstat-value" style="font-size:1.05rem">${maxCat}</div>
      <div class="qstat-sub">${maxCnt} topics</div>
    </div>
    <div class="qstat">
      <div class="qstat-label">Learning Paths</div>
      <div class="qstat-value">${Object.keys(topics).length}</div>
      <div class="qstat-sub">categories</div>
    </div>
    <div class="qstat">
      <div class="qstat-label">Recent Sessions</div>
      <div class="qstat-value">${getRecent().length}</div>
      <div class="qstat-sub">topics accessed</div>
    </div>`;
}

/* ============================================================
   13. DASHBOARD — Stats Header
   ============================================================ */
function updateStats() {
  const el = id => document.getElementById(id);
  const t = el("statTotal"); if (t) t.textContent = totalTopics();
  const v = el("statViewed"); if (v) v.textContent = totalViewed();
  const c = el("statCats"); if (c) c.textContent = Object.keys(topics).length;
  const s = el("statStreak"); if (s) s.textContent = updateStreak();
}

function refreshDashboard() {
  updateStats();
  buildPathCards();
  buildContinueSection();
  buildQuickStats();
}

/* ============================================================
   14. SEARCH
   ============================================================ */
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase().trim();

  if (sidebarMode === "topics") {
    // Filter topics in current category
    document.querySelectorAll(".topic-link").forEach(link => {
      link.classList.toggle("hidden", !link.dataset.title.toLowerCase().includes(q));
    });
    return;
  }

  // In nav mode, filter category nav items
  document.querySelectorAll(".nav-item").forEach(item => {
    const label = item.querySelector(".nav-item-label");
    if (!label) return;
    const matches = label.textContent.toLowerCase().includes(q);
    item.classList.toggle("hidden", q && !matches);
  });
});

/* ============================================================
   15. KEYBOARD SHORTCUT ⌘K / Ctrl+K
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
    // Clear search filters
    document.querySelectorAll(".topic-link, .nav-item").forEach(el => el.classList.remove("hidden"));
    closeSidebar();
  }
});

/* ============================================================
   16. MOBILE SIDEBAR TOGGLE
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
   17. TOPIC COUNTER
   ============================================================ */
function updateCounter() {
  const t = totalTopics();
  document.getElementById("topicCounter").textContent = `${t} topic${t !== 1 ? "s" : ""}`;
}

/* ============================================================
   18. HASH ROUTING (deep links)
   ============================================================ */
function handleHashRoute() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return;

  for (const [catName, catData] of Object.entries(topics)) {
    for (const topic of catData.items) {
      const resolved = resolveFile(topic.file);
      const slug = resolved.replace(/\.html$/, "");
      if (slug === hash || resolved === hash) {
        // Open the category sidebar, then load the topic
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
   19. INIT
   ============================================================ */
function init() {
  buildSidebarNav();   // Sidebar starts in nav mode — NO auto-expanded Java
  updateCounter();
  refreshDashboard();
  handleHashRoute();
}

init();
