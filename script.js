/* =============================================
   DEVDOCS — script.js
   ─ Manual topic configuration
   ─ Sidebar rendering
   ─ Search / filter
   ─ Content loading via iframe
   ─ Breadcrumb, keyboard shortcut
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
      { title: "What Is Java",            file: "java/Topic1_What_Is_Java" },
      { title: "How Java Runs",           file: "java/Topic2_How_Java_Runs" },
      { title: "How Data Is Stored",      file: "java/Topic3_How_Data_Is_Stored" },
      { title: "Variables & Data Types",  file: "java/Topic4_Variables_DataTypes" },
      { title: "Operators",               file: "java/Topic5_Operators" },
      { title: "Conditional Statements",  file: "java/Topic6_Conditional_Statements" },
      { title: "Loops",                   file: "java/Topic7_Loops" },
      { title: "Methods",                 file: "java/Topic8_Methods" },
      { title: "Class & Object",          file: "java/Topic9_Class_Object" },
      { title: "Access Modifiers",        file: "java/Topic10_Access_Modifiers" },
      { title: "Constructor",             file: "java/Topic11_Constructor" },
      { title: "Encapsulation",           file: "java/Topic12_Encapsulation" },
      { title: "Inheritance",             file: "java/Topic13_Inheritance" },
      { title: "Polymorphism",            file: "java/Topic14_Polymorphism" },
      { title: "Abstract Class",          file: "java/Topic15_Abstract_Class" },
      { title: "Interface",               file: "java/Topic16_Interface" },
      { title: "Non-Access Modifiers",    file: "java/Topic17_NonAccess_Modifiers" },
      { title: "String",                  file: "java/Topic18_String" },
      { title: "Arrays",                  file: "java/Topic19_Arrays" },
    ],
  },


  HLD: {
    color: "#a78bfa",
    icon: "🗃️",
    items: [
      { title: "Load Balancer",    file: "hld/load-balancer" }
    ],
  },

  "Spring Boot": {
    color: "#fbbf24",
    icon: "🍃",
    items: [
      { title: "Introduction",            file: "springboot/introduction" },
      { title: "Project Setup",           file: "springboot/project-setup" },
      { title: "REST Controllers",        file: "springboot/rest-controllers" },
      { title: "Dependency Injection",    file: "springboot/dependency-injection" },
      { title: "JPA & Hibernate",         file: "springboot/jpa-hibernate" },
      { title: "Spring Security",         file: "springboot/spring-security" },
    ],
  },
  
  Networking: {
    color: "#4f8ef7",
    icon: "🌐",
    items: [
      { title: "Introduction",            file: "networking/introduction" },
      { title: "IP Address",              file: "networking/ip-address" },
      { title: "TCP/IP",                  file: "networking/tcp-ip" },
      { title: "OSI Model",               file: "networking/osi-model" },
      { title: "DNS",                     file: "networking/dns" },
      { title: "HTTP & HTTPS",            file: "networking/http-https" },
    ],
  },

  OS: {
    color: "#f87171",
    icon: "🖥️",
    items: [
      { title: "Introduction to OS",      file: "os/introduction" },
      { title: "Process Management",      file: "os/process-management" },
      { title: "Threads",                 file: "os/threads" },
      { title: "CPU Scheduling",          file: "os/cpu-scheduling" },
      { title: "Memory Management",       file: "os/memory-management" },
      { title: "File Systems",            file: "os/file-systems" },
      { title: "Deadlocks",               file: "os/deadlocks" },
    ],
  },
};

/* ============================================================
   2. STATE
   ============================================================ */
let activeLink = null;
let activeCat  = null;

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
        <span class="cat-dot" style="background:${catData.color}"></span>
        ${catName}
      </span>
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
}

/* ============================================================
   7. WELCOME CARDS
   ============================================================ */
function buildWelcomeCards() {
  const container = document.getElementById("welcomeCards");
  Object.entries(topics).forEach(([catName, catData], i) => {
    const card = document.createElement("div");
    card.className = "welcome-card";
    card.style.animationDelay = `${i * 0.07 + 0.2}s`;
    card.innerHTML = `
      <div class="card-icon" style="background:${catData.color}22; color:${catData.color}">
        ${catData.icon}
      </div>
      <div class="card-title">${catName}</div>
      <div class="card-count">${catData.items.length} topic${catData.items.length !== 1 ? "s" : ""}</div>`;

    card.addEventListener("click", () => {
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
  buildSidebar();
  buildWelcomeCards();
  updateCounter();
  handleHashRoute();
}

init();
