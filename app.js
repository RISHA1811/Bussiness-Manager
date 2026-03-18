// ── Storage Helpers ──────────────────────────────────────────────
const DB = {
  get: (k) => JSON.parse(localStorage.getItem(k) || 'null'),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  push: (k, v) => { const arr = DB.get(k) || []; arr.push(v); DB.set(k, arr); return arr; },
  remove: (k, id) => { const arr = (DB.get(k) || []).filter(i => i.id !== id); DB.set(k, arr); return arr; }
};

// ── Auth ──────────────────────────────────────────────────────────
const Auth = {
  current: () => DB.get('currentUser'),
  login: (email, password) => {
    const users = DB.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { DB.set('currentUser', user); return true; }
    return false;
  },
  register: (name, email, password) => {
    const users = DB.get('users') || [];
    if (users.find(u => u.email === email)) return false;
    const user = { id: Date.now(), name, email, password };
    users.push(user);
    DB.set('users', users);
    DB.set('currentUser', user);
    return true;
  },
  logout: () => { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; },
  guard: () => { if (!Auth.current()) window.location.href = 'index.html'; }
};

// ── Sidebar Render + Mobile Toggle ───────────────────────────────
function renderSidebar(active) {
  const user = Auth.current();
  if (!user) return;
  const nav = [
    { href: 'dashboard.html', icon: '📊', label: 'Dashboard' },
    { href: 'transactions.html', icon: '💰', label: 'Transactions' },
    { href: 'loans.html', icon: '🏦', label: 'Loans' },
    { href: 'customers.html', icon: '👥', label: 'Customers' },
    { href: 'budget.html', icon: '🎯', label: 'Budget' },
  ];
  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
      <h2>📒 KhataBook</h2>
      <p>Business Manager</p>
    </div>
    <nav class="sidebar-nav">
      ${nav.map(n => `
        <a href="${n.href}" class="nav-item ${active === n.href ? 'active' : ''}">
          <span>${n.icon}</span><span>${n.label}</span>
        </a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span style="font-size:12px;color:#94a3b8">Dark Mode</span>
        <button id="darkToggle" onclick="toggleDarkMode()" style="background:none;border:none;font-size:20px;cursor:pointer">${localStorage.getItem('darkMode')==='true'?'☀️':'🌙'}</button>
      </div>
      <div class="user-info">
        ${user.picture
          ? `<img src="${user.picture}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0" />`
          : `<div class="user-avatar">${user.name[0].toUpperCase()}</div>`}
        <div><div class="user-name">${user.name}</div><div class="user-email">${user.email}</div></div>
      </div>
      <button class="logout-btn" onclick="Auth.logout()">🚪 Logout</button>
    </div>`;

  // Bottom nav
  const bnav = document.getElementById('bottomNav');
  if (bnav) {
    bnav.innerHTML = '<div class="bottom-nav-inner">' +
      nav.map(n => '<a href="' + n.href + '" class="bottom-nav-item ' + (active === n.href ? 'active' : '') + '"><span>' + n.icon + '</span><span>' + n.label + '</span></a>').join('') +
      '<button class="bottom-nav-item" onclick="Auth.logout()" style="background:none;border:none;cursor:pointer;color:#f87171"><span>🚪</span><span>Logout</span></button>' +
      '</div>';
  }

  // Hamburger toggle
  const ham = document.getElementById('hamburger');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');
  if (ham) {
    ham.onclick = () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    };
  }
  if (overlay) {
    overlay.onclick = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    };
  }
}

// ── Utilities ─────────────────────────────────────────────────────
const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Date Filter Helper ────────────────────────────────────────────
function filterByDateRange(items, dateKey, range) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return items.filter(item => {
    const d = new Date(item[dateKey]);
    if (range === '7d') return d >= new Date(today - 6 * 86400000);
    if (range === '30d') return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    if (range === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (range === 'year') return d.getFullYear() === now.getFullYear();
    return true; // 'all'
  });
}

// ── CSV Export ────────────────────────────────────────────────────
function exportCSV(headers, rows, filename) {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ── PDF / Print Export ────────────────────────────────────────────
function exportPDF(title, tableHTML) {
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head>
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; font-size: 13px; }
      h2 { margin-bottom: 16px; color: #1e293b; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f1f5f9; padding: 8px 12px; text-align: left; font-size: 12px; }
      td { padding: 8px 12px; border-top: 1px solid #e2e8f0; }
      .footer { margin-top: 20px; font-size: 11px; color: #64748b; }
    </style>
  </head><body>
    <h2>📒 KhataBook — ${title}</h2>
    <p style="color:#64748b;font-size:12px;margin-bottom:12px">Generated: ${new Date().toLocaleString('en-IN')}</p>
    ${tableHTML}
    <div class="footer">KhataBook Business Manager</div>
  </body></html>`);
  win.document.close();
  win.print();
}

// ── WhatsApp Reminder ─────────────────────────────────────────────
function sendWhatsApp(phone, name, amount) {
  const msg = encodeURIComponent(`Namaste ${name} ji 🙏\n\nYe ek reminder hai ki aapka ₹${Number(amount).toLocaleString('en-IN')} udhaar baki hai.\n\nKripya jald se jald payment karein.\n\n— KhataBook`);
  const num = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${num.startsWith('91') ? num : '91' + num}?text=${msg}`, '_blank');
}

// ── Credit Score Calculator ───────────────────────────────────────
function calcCreditScore(customerId, customerName) {
  const loans = DB.get('loans') || [];
  const relevant = loans.filter(l => l.name.toLowerCase() === customerName.toLowerCase());
  if (!relevant.length) return { score: 70, label: 'New', color: '#60a5fa' };

  let score = 100;
  relevant.forEach(l => {
    const isOverdue = l.due && new Date(l.due) < new Date() && l.paid < l.amount;
    if (isOverdue) score -= 20;
    if (l.paid === 0 && l.amount > 0) score -= 10;
    if (l.paid >= l.amount) score += 5;
  });
  score = Math.max(10, Math.min(100, score));

  let label, color;
  if (score >= 80) { label = 'Excellent'; color = '#16a34a'; }
  else if (score >= 60) { label = 'Good'; color = '#2563eb'; }
  else if (score >= 40) { label = 'Fair'; color = '#d97706'; }
  else { label = 'Poor'; color = '#dc2626'; }

  return { score, label, color };
}

// ── Toast Notifications ─────────────────────────────────────────
function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ── Dark Mode ─────────────────────────────────────────────────────
function initDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
}
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  const btn = document.getElementById('darkToggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// ── Budget Helpers ────────────────────────────────────────────────
function getBudgets() { return DB.get('budgets') || {}; }
function getBudgetStatus(category, month) {
  const budgets = getBudgets();
  const budget = budgets[category] || 0;
  const txns = DB.get('transactions') || [];
  const spent = txns.filter(t => t.type === 'expense' && t.category === category && t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
  return { budget, spent, percent: budget ? Math.min(Math.round((spent / budget) * 100), 100) : 0 };
}

// ── Spending Pattern Analysis ─────────────────────────────────────
function getSpendingInsights() {
  const txns = DB.get('transactions') || [];
  const loans = DB.get('loans') || [];

  // Top expense categories
  const catMap = {};
  txns.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Best sales month
  const monthMap = {};
  txns.filter(t => t.type === 'income').forEach(t => {
    const key = t.date.slice(0, 7);
    monthMap[key] = (monthMap[key] || 0) + t.amount;
  });
  const bestMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0];

  // Top borrower
  const borrowMap = {};
  loans.filter(l => l.direction === 'given').forEach(l => {
    borrowMap[l.name] = (borrowMap[l.name] || 0) + l.amount;
  });
  const topBorrower = Object.entries(borrowMap).sort((a, b) => b[1] - a[1])[0];

  return { topCats, bestMonth, topBorrower };
}
