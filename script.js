/* =============================================
   DEVDOCS — script.js
   Premium Developer Learning Hub
   ─ Manual topic configuration
   ─ Sidebar rendering
   ─ Search / filter
   ─ Content loading via iframe
   ─ Breadcrumb, keyboard shortcut
   ─ Progress tracking (localStorage)
   ─ Recently viewed
   ─ Learning statistics
   ============================================= */

/* ============================================================
   1. MANUAL TOPIC CONFIGURATION
      ↓ Edit this object to add / remove categories & topics.
      Each topic has:
        title  — displayed in sidebar & breadcrumb
        file   — path relative to index.html (e.g. "java/topic1.html")
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

/* ============================================================
   3. HELPERS
   ============================================================ */
function resolveFile(filePath) {
  // If the user omits .html extension, we add it.
  if (!filePath.includes(".")) return filePath + ".html";
  return filePath;
}

function totalTopics() {
  return Object.values(topics).reduce((sum, cat) => sum + cat.items.length, 0);
}

/* ============================================================
   3b. LOCAL STORAGE — Progress & Recently Viewed
   ============================================================ */
const STORAGE_KEYS = {
  viewed: 'devdocs_viewed_topics',
  recent: 'devdocs_recent_topics',
  streak: 'devdocs_streak',
  lastVisit: 'devdocs_last_visit',
  sidebarCollapsed: 'devdocs_sidebar_collapsed',
};

function getViewedTopics() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.viewed)) || {};
  } catch { return {}; }
}

function saveViewedTopic(file, title, cat) {
  const viewed = getViewedTopics();
  viewed[file] = { title, cat, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEYS.viewed, JSON.stringify(viewed));
}

function getRecentTopics() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.recent)) || [];
  } catch { return []; }
}

function saveRecentTopic(file, title, cat) {
  let recent = getRecentTopics();
  // Remove duplicate
  recent = recent.filter(r => r.file !== file);
  // Add to front
  recent.unshift({ file, title, cat, timestamp: Date.now() });
  // Keep last 8
  recent = recent.slice(0, 8);
  localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recent));
}

function updateStreak() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const lastVisit = localStorage.getItem(STORAGE_KEYS.lastVisit);
  let streak = parseInt(localStorage.getItem(STORAGE_KEYS.streak)) || 0;

  if (lastVisit === today) {
    // Already visited today, no change
    return streak;
  }

  if (lastVisit) {
    const lastDate = new Date(lastVisit);
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      // Consecutive day
      streak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      streak = 1;
    }
  } else {
    streak = 1;
  }

  localStorage.setItem(STORAGE_KEYS.streak, String(streak));
  localStorage.setItem(STORAGE_KEYS.lastVisit, today);
  return streak;
}

function getViewedCountForCategory(catName) {
  const viewed = getViewedTopics();
  const catItems = topics[catName]?.items || [];
  let count = 0;
  catItems.forEach(item => {
    const file = resolveFile(item.file);
    if (viewed[file]) count++;
  });
  return count;
}

function getTotalViewedCount() {
  return Object.keys(getViewedTopics()).length;
}

function getLastViewedInCategory(catName) {
  const viewed = getViewedTopics();
  const catItems = topics[catName]?.items || [];
  let latest = null;
  catItems.forEach(item => {
    const file = resolveFile(item.file);
    if (viewed[file] && (!latest || viewed[file].timestamp > latest.timestamp)) {
      latest = { ...viewed[file], file };
    }
  });
  return latest;
}

/* ============================================================
   4. BUILD SIDEBAR
   ============================================================ */
function buildSidebar() {
  const nav = document.getElementById("sidebarNav");
  nav.innerHTML = "";

  Object.entries(topics).forEach(([catName, catData], catIdx) => {
    const group = document.createElement("div");
    group.className = "category-group";
    group.dataset.cat = catName;

    // Header
    const header = document.createElement("button");
    header.className = "category-header";
    header.setAttribute("aria-expanded", "false");
    header.innerHTML = `
      <span class="cat-left">
        <span class="cat-dot" style="background:${catData.color}22; color:${catData.color};">${catData.icon}</span>
        <span class="cat-label">${catName}</span>
      </span>
      <span class="cat-count">${catData.items.length}</span>
      <svg class="cat-chevron" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    header.addEventListener("click", () => toggleCategory(group, header));

    // Topics
    const list = document.createElement("div");
    list.className = "topics-list";

    catData.items.forEach((topic, idx) => {
      const link = document.createElement("button");
      link.className = "topic-link";
      link.textContent = topic.title;
      link.dataset.cat = catName;
      link.dataset.title = topic.title;
      link.dataset.file = resolveFile(topic.file);
      link.style.setProperty("animation-delay", `${idx * 0.03}s`);

      link.addEventListener("click", () => {
        loadTopic(link, catName, topic.title, resolveFile(topic.file));
        if (window.innerWidth < 900) closeSidebar();
      });

      list.appendChild(link);
    });

    group.appendChild(header);
    group.appendChild(list);
    nav.appendChild(group);

    // Auto-open first category
    if (catIdx === 0) toggleCategory(group, header);
  });
}

function toggleCategory(group, header) {
  const isOpen = group.classList.contains("open");
  group.classList.toggle("open", !isOpen);
  header.setAttribute("aria-expanded", String(!isOpen));
}

/* ============================================================
   5. LOAD TOPIC
   ============================================================ */
function loadTopic(linkEl, catName, topicTitle, filePath) {
  // Deactivate previous
  if (activeLink) activeLink.classList.remove("active");
  activeLink = linkEl;
  linkEl.classList.add("active");
  activeCat = catName;

  // Make sure that category is open
  const group = document.querySelector(`.category-group[data-cat="${CSS.escape(catName)}"]`);
  if (group && !group.classList.contains("open")) {
    const header = group.querySelector(".category-header");
    toggleCategory(group, header);
  }

  // Hide welcome
  document.getElementById("welcomeScreen").style.display = "none";

  // Show loading
  const loading = document.getElementById("loadingScreen");
  const frame = document.getElementById("contentFrame");
  loading.classList.add("active");
  frame.classList.remove("active");

  // Update breadcrumb
  updateBreadcrumb(catName, topicTitle, topics[catName].color);

  // Load iframe
  frame.onload = () => {
    loading.classList.remove("active");
    frame.classList.add("active");
  };
  frame.onerror = () => {
    loading.classList.remove("active");
    frame.classList.add("active");
  };
  frame.src = filePath;

  // Track progress
  saveViewedTopic(filePath, topicTitle, catName);
  saveRecentTopic(filePath, topicTitle, catName);

  // Update URL hash (no page reload)
  const slug = filePath.replace(/\.html$/, "");
  history.replaceState(null, "", `#${slug}`);
}

/* ============================================================
   6. BREADCRUMB
   ============================================================ */
function updateBreadcrumb(catName, topicTitle, color) {
  const bc = document.getElementById("breadcrumb");
  bc.innerHTML = `
    <span class="bc-home" onclick="goHome()">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>
      Home
    </span>
    <span class="bc-sep">›</span>
    <span class="bc-cat" style="color:${color}">${catName}</span>
    <span class="bc-sep">›</span>
    <span class="bc-topic">${topicTitle}</span>`;
}

function goHome() {
  if (activeLink) activeLink.classList.remove("active");
  activeLink = null;
  activeCat = null;

  document.getElementById("loadingScreen").classList.remove("active");
  document.getElementById("contentFrame").classList.remove("active");
  document.getElementById("contentFrame").src = "";
  document.getElementById("welcomeScreen").style.display = "";

  const bc = document.getElementById("breadcrumb");
  bc.innerHTML = `
    <span class="bc-home">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>
      Home
    </span>`;

  history.replaceState(null, "", window.location.pathname);

  // Refresh dashboard data
  refreshDashboard();
}

/* ============================================================
   7. WELCOME CARDS (Enhanced with progress)
   ============================================================ */
function buildWelcomeCards() {
  const container = document.getElementById("welcomeCards");
  container.innerHTML = "";

  Object.entries(topics).forEach(([catName, catData], i) => {
    const viewedCount = getViewedCountForCategory(catName);
    const totalCount = catData.items.length;
    const progress = totalCount > 0 ? Math.round((viewedCount / totalCount) * 100) : 0;
    const lastViewed = getLastViewedInCategory(catName);

    const card = document.createElement("div");
    card.className = "welcome-card";
    card.style.animationDelay = `${i * 0.06 + 0.1}s`;
    card.style.setProperty('--card-color', catData.color);

    let actionText = "Start Learning →";
    if (lastViewed) {
      actionText = "Continue →";
    }

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon" style="background:${catData.color}18; color:${catData.color}">
          ${catData.icon}
        </div>
        <div class="card-arrow">→</div>
      </div>
      <div class="card-title">${catName}</div>
      <div class="card-count">${totalCount} topic${totalCount !== 1 ? "s" : ""}</div>
      <div class="card-progress">
        <div class="card-progress-fill" style="width:${progress}%; background:${catData.color};" data-progress="${progress}"></div>
      </div>
      <div class="card-footer">
        <span class="card-progress-text">${viewedCount}/${totalCount} viewed</span>
        <span class="card-action">${actionText}</span>
      </div>`;

    card.addEventListener("click", () => {
      // If there's a last viewed topic in this category, continue from there
      // Otherwise open the first topic
      if (lastViewed) {
        const allLinks = document.querySelectorAll(".topic-link");
        for (const link of allLinks) {
          if (link.dataset.file === lastViewed.file) {
            loadTopic(link, catName, lastViewed.title, lastViewed.file);
            return;
          }
        }
      }

      // Fallback: open category in sidebar
      const group = document.querySelector(`.category-group[data-cat="${CSS.escape(catName)}"]`);
      if (group) {
        if (!group.classList.contains("open")) {
          const header = group.querySelector(".category-header");
          toggleCategory(group, header);
        }
        group.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (window.innerWidth < 900) openSidebar();
    });

    container.appendChild(card);
  });

  // Animate progress bars after a brief delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.card-progress-fill').forEach(fill => {
        fill.style.width = fill.dataset.progress + '%';
      });
    }, 200);
  });
}

/* ============================================================
   7b. RECENTLY VIEWED
   ============================================================ */
function buildRecentlyViewed() {
  const container = document.getElementById("recentList");
  const recent = getRecentTopics();

  if (recent.length === 0) {
    container.innerHTML = `<div class="empty-recent">No topics viewed yet — start exploring!</div>`;
    return;
  }

  container.innerHTML = "";
  recent.forEach((item, i) => {
    const catData = topics[item.cat];
    const color = catData ? catData.color : '#3B82F6';
    const timeAgo = formatTimeAgo(item.timestamp);

    const el = document.createElement("div");
    el.className = "recent-item";
    el.style.animationDelay = `${i * 0.04}s`;
    el.style.animation = 'fadeUp .3s ease both';
    el.innerHTML = `
      <div class="recent-dot" style="background:${color}"></div>
      <div class="recent-info">
        <div class="recent-title">${item.title}</div>
        <div class="recent-cat">${item.cat}</div>
      </div>
      <div class="recent-time">${timeAgo}</div>`;

    el.addEventListener("click", () => {
      const file = resolveFile(item.file.replace(/\.html$/, ''));
      const allLinks = document.querySelectorAll(".topic-link");
      for (const link of allLinks) {
        if (link.dataset.file === file) {
          loadTopic(link, item.cat, item.title, file);
          return;
        }
      }
      // Fallback: direct load
      loadTopicDirect(item.cat, item.title, file);
    });

    container.appendChild(el);
  });
}

function loadTopicDirect(catName, topicTitle, filePath) {
  // For when we can't find the sidebar link
  if (activeLink) activeLink.classList.remove("active");
  activeLink = null;
  activeCat = catName;

  document.getElementById("welcomeScreen").style.display = "none";
  const loading = document.getElementById("loadingScreen");
  const frame = document.getElementById("contentFrame");
  loading.classList.add("active");
  frame.classList.remove("active");
  updateBreadcrumb(catName, topicTitle, topics[catName]?.color || '#3B82F6');

  frame.onload = () => { loading.classList.remove("active"); frame.classList.add("active"); };
  frame.onerror = () => { loading.classList.remove("active"); frame.classList.add("active"); };
  frame.src = filePath;

  saveViewedTopic(filePath, topicTitle, catName);
  saveRecentTopic(filePath, topicTitle, catName);

  const slug = filePath.replace(/\.html$/, "");
  history.replaceState(null, "", `#${slug}`);
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/* ============================================================
   7c. LEARNING STATISTICS
   ============================================================ */
function buildQuickStats() {
  const grid = document.getElementById("quickStatsGrid");
  if (!grid) return;

  const totalViewed = getTotalViewedCount();
  const total = totalTopics();
  const completionPct = total > 0 ? Math.round((totalViewed / total) * 100) : 0;

  // Find most studied category
  let maxCat = '—';
  let maxCount = 0;
  Object.entries(topics).forEach(([catName]) => {
    const count = getViewedCountForCategory(catName);
    if (count > maxCount) { maxCount = count; maxCat = catName; }
  });

  grid.innerHTML = `
    <div class="quick-stat">
      <div class="quick-stat-label">Completion</div>
      <div class="quick-stat-value">${completionPct}%</div>
      <div class="quick-stat-sub">${totalViewed} of ${total} topics</div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat-label">Most Studied</div>
      <div class="quick-stat-value" style="font-size:1.1rem;">${maxCat}</div>
      <div class="quick-stat-sub">${maxCount} topics viewed</div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat-label">Categories</div>
      <div class="quick-stat-value">${Object.keys(topics).length}</div>
      <div class="quick-stat-sub">learning paths</div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat-label">Recent Activity</div>
      <div class="quick-stat-value">${getRecentTopics().length}</div>
      <div class="quick-stat-sub">topics this session</div>
    </div>`;
}

/* ============================================================
   7d. DASHBOARD STATS HEADER
   ============================================================ */
function updateDashboardStats() {
  const el = (id) => document.getElementById(id);

  // Total topics
  const total = totalTopics();
  const totalEl = el('statTotalTopics');
  if (totalEl) totalEl.textContent = total;

  // Categories
  const catEl = el('statCategories');
  if (catEl) catEl.textContent = Object.keys(topics).length;

  // Viewed
  const viewedEl = el('statViewed');
  if (viewedEl) viewedEl.textContent = getTotalViewedCount();

  // Streak
  const streak = updateStreak();
  const streakEl = el('statStreak');
  if (streakEl) streakEl.textContent = streak;

  // Paths badge
  const pathsBadge = el('pathsBadge');
  if (pathsBadge) pathsBadge.textContent = `${Object.keys(topics).length} paths`;
}

function refreshDashboard() {
  updateDashboardStats();
  buildWelcomeCards();
  buildRecentlyViewed();
  buildQuickStats();
}

/* ============================================================
   8. SEARCH
   ============================================================ */
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase().trim();
  let anyVisible = false;

  const groups = document.querySelectorAll(".category-group");
  groups.forEach((group) => {
    const links = group.querySelectorAll(".topic-link");
    let groupHasMatch = false;

    links.forEach((link) => {
      const matches = link.dataset.title.toLowerCase().includes(q);
      link.classList.toggle("hidden", !matches);
      if (matches) groupHasMatch = true;
    });

    // Open groups that have matches; collapse empty ones
    if (q && groupHasMatch) {
      group.classList.add("open");
      group.querySelector(".category-header").setAttribute("aria-expanded", "true");
    }
    if (q && !groupHasMatch) {
      group.classList.remove("open");
    }
    if (!q) {
      // Restore default open state (first only)
    }

    if (groupHasMatch) anyVisible = true;
  });

  // Remove existing no-results message
  const existing = document.getElementById("noResults");
  if (existing) existing.remove();

  if (q && !anyVisible) {
    const msg = document.createElement("div");
    msg.className = "no-results";
    msg.id = "noResults";
    msg.textContent = `No topics found for "${q}"`;
    document.getElementById("sidebarNav").appendChild(msg);
  }

  // Reset: if cleared, re-open first category only
  if (!q) {
    groups.forEach((group, i) => {
      group.querySelectorAll(".topic-link").forEach((l) => l.classList.remove("hidden"));
      if (i === 0) {
        group.classList.add("open");
      } else {
        // Keep user-toggled state — only close if they weren't manually opened
      }
    });
  }
});

/* ============================================================
   9. KEYBOARD SHORTCUT  ⌘K / Ctrl+K
   ============================================================ */
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("searchInput").focus();
    document.getElementById("searchInput").select();
  }
  if (e.key === "Escape") {
    document.getElementById("searchInput").blur();
    closeSidebar();
  }
});

/* ============================================================
   10. MOBILE SIDEBAR TOGGLE
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
  const isOpen = document.getElementById("sidebar").classList.contains("open");
  isOpen ? closeSidebar() : openSidebar();
});
document.getElementById("overlay").addEventListener("click", closeSidebar);

/* ============================================================
   10b. SIDEBAR COLLAPSE (Desktop)
   ============================================================ */
function toggleSidebarCollapse() {
  document.body.classList.toggle('sidebar-collapsed');
  const collapsed = document.body.classList.contains('sidebar-collapsed');
  localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, collapsed ? '1' : '0');
}

function restoreSidebarState() {
  if (localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === '1') {
    document.body.classList.add('sidebar-collapsed');
  }
}

/* ============================================================
   11. TOPIC COUNTER
   ============================================================ */
function updateCounter() {
  const total = totalTopics();
  document.getElementById("topicCounter").textContent = `${total} topic${total !== 1 ? "s" : ""}`;
}

/* ============================================================
   12. HASH ROUTING (deep links)
   ============================================================ */
function handleHashRoute() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return;

  // Try to find a matching file
  for (const [catName, catData] of Object.entries(topics)) {
    for (const topic of catData.items) {
      const resolved = resolveFile(topic.file);
      const slug = resolved.replace(/\.html$/, "");
      if (slug === hash || resolved === hash) {
        // Find the link element and click it
        const allLinks = document.querySelectorAll(".topic-link");
        for (const link of allLinks) {
          if (link.dataset.file === resolved) {
            loadTopic(link, catName, topic.title, resolved);
            return;
          }
        }
      }
    }
  }
}

/* ============================================================
   13. INIT
   ============================================================ */
function init() {
  restoreSidebarState();
  buildSidebar();
  updateCounter();
  refreshDashboard();
  handleHashRoute();
}

init();
