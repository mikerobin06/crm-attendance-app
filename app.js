const STORAGE_KEY = "company-attendance-state-v2";
const SESSION_KEY = "company-attendance-session-v2";
const FALLBACK_TIME_ZONE = "Asia/Manila";
const PROFILE_IMAGE_LIMIT = 1.5 * 1024 * 1024;

const seedData = {
  boss: {
    id: "boss-001",
    role: "boss",
    name: "Mike Marquardt",
    username: "mike",
    email: "boss@company.test",
    password: "mikeadmin@123",
    position: "Company Owner",
    department: "Executive",
    birthday: "1984-06-28",
    phone: "+63 917 555 0100",
    emergency: "Amanda Marquardt - +63 917 555 0101",
    startDate: "2018-01-08",
  },
  employees: [
    {
      id: "emp-001",
      role: "employee",
      name: "Mike Robin Wenceslao",
      username: "mike",
      email: "mike@crmdigital.test",
      password: "mike@123",
      position: "Operations Assistant",
      department: "Web Design",
      birthday: "1996-10-06",
      phone: "+63 945 613 8709",
      emergency: "Rebecca - +63 920 879 0413",
      startDate: "2024-10-02",
      status: "Active",
    },
    {
      id: "emp-002",
      role: "employee",
      name: "Carissa Moore",
      username: "carissa",
      email: "carissa@crmdigital.test",
      password: "carissa@123",
      position: "Project Manager",
      department: "Sales",
      birthday: "1992-07-08",
      phone: "+63 917 210 4101",
      emergency: "Carissa - +63 917 210 4102",
      startDate: "2023-08-02",
      status: "Active",
    },
  ],
  attendance: [
    {
      id: "att-001",
      employeeId: "emp-001",
      date: "2026-06-16",
      timeIn: "08:04",
      timeOut: "17:12",
      status: "Present",
    },
    {
      id: "att-002",
      employeeId: "emp-002",
      date: "2026-06-16",
      timeIn: "08:41",
      timeOut: "17:24",
      status: "Late",
    },
    {
      id: "att-003",
      employeeId: "emp-003",
      date: "2026-06-16",
      timeIn: "08:19",
      timeOut: "17:08",
      status: "Present",
    },
    {
      id: "att-004",
      employeeId: "emp-004",
      date: "2026-06-15",
      timeIn: "07:58",
      timeOut: "17:02",
      status: "Present",
    },
  ],
  leaves: [
    {
      id: "leave-001",
      employeeId: "emp-002",
      type: "Sick leave",
      startDate: "2026-06-18",
      endDate: "2026-06-18",
      days: 1,
      reason: "Medical appointment",
      status: "Pending",
      filedAt: "2026-06-15",
      reviewedAt: "",
      reviewedBy: "",
    },
    {
      id: "leave-002",
      employeeId: "emp-003",
      type: "Vacation leave",
      startDate: "2026-06-22",
      endDate: "2026-06-24",
      days: 3,
      reason: "Family trip",
      status: "Approved",
      filedAt: "2026-06-10",
      reviewedAt: "2026-06-11",
      reviewedBy: "boss-001",
    },
  ],
  holidays: [
    {
      id: "hol-001",
      date: "2026-06-12",
      name: "Independence Day",
      type: "Regular holiday",
      blocked: true,
    },
    {
      id: "hol-002",
      date: "2026-08-21",
      name: "Ninoy Aquino Day",
      type: "Special non-working day",
      blocked: true,
    },
    {
      id: "hol-003",
      date: "2026-12-25",
      name: "Christmas Day",
      type: "Regular holiday",
      blocked: true,
    },
  ],
  settings: {
    shiftStart: "08:30",
    shiftEnd: "17:30",
  },
};

let data = loadData();
let session = loadSession();
let deferredInstallPrompt = null;
const ui = {
  activeView: "employeeDashboard",
  attendanceDate: todayKey(),
  attendanceSearch: "",
  employeeSearch: "",
  selectedEmployeeId: "",
  editingEmployeeId: "",
};

const els = {
  loginView: document.getElementById("loginView"),
  appView: document.getElementById("appView"),
  loginForm: document.getElementById("loginForm"),
  loginEmail: document.getElementById("loginEmail"),
  loginPassword: document.getElementById("loginPassword"),
  loginPasswordToggle: document.getElementById("loginPasswordToggle"),
  loginError: document.getElementById("loginError"),
  forgotPasswordButton: document.getElementById("forgotPasswordButton"),
  forgotPasswordSheet: document.getElementById("forgotPasswordSheet"),
  forgotPasswordForm: document.getElementById("forgotPasswordForm"),
  forgotPasswordIdentifier: document.getElementById("forgotPasswordIdentifier"),
  forgotPasswordError: document.getElementById("forgotPasswordError"),
  forgotPasswordResult: document.getElementById("forgotPasswordResult"),
  closeForgotPasswordSheet: document.getElementById("closeForgotPasswordSheet"),
  cancelForgotPasswordButton: document.getElementById("cancelForgotPasswordButton"),
  logoutButtons: document.querySelectorAll("[data-logout]"),
  roleLabel: document.getElementById("roleLabel"),
  todayLabel: document.getElementById("todayLabel"),
  pageTitle: document.getElementById("pageTitle"),
  currentUserName: document.getElementById("currentUserName"),
  currentUserMeta: document.getElementById("currentUserMeta"),
  userInitials: document.getElementById("userInitials"),
  liveClock: document.getElementById("liveClock"),
  toast: document.getElementById("toast"),
  employeeGreeting: document.getElementById("employeeGreeting"),
  todayWorkStatus: document.getElementById("todayWorkStatus"),
  employeeTimeCard: document.getElementById("employeeTimeCard"),
  employeeStats: document.getElementById("employeeStats"),
  employeeRecentLogs: document.getElementById("employeeRecentLogs"),
  leaveForm: document.getElementById("leaveForm"),
  leaveError: document.getElementById("leaveError"),
  employeeHolidayList: document.getElementById("employeeHolidayList"),
  employeeLeaveList: document.getElementById("employeeLeaveList"),
  employeeProfileCard: document.getElementById("employeeProfileCard"),
  employeeMilestones: document.getElementById("employeeMilestones"),
  employeeProfileEditor: document.getElementById("employeeProfileEditor"),
  bossStats: document.getElementById("bossStats"),
  bossPendingPreview: document.getElementById("bossPendingPreview"),
  bossBirthdayList: document.getElementById("bossBirthdayList"),
  bossProfileCard: document.getElementById("bossProfileCard"),
  bossProfileEditor: document.getElementById("bossProfileEditor"),
  bossAttendanceDate: document.getElementById("bossAttendanceDate"),
  bossAttendanceSearch: document.getElementById("bossAttendanceSearch"),
  bossAttendanceTable: document.getElementById("bossAttendanceTable"),
  bossEmployeeAttendanceName: document.getElementById("bossEmployeeAttendanceName"),
  bossEmployeeAttendanceMeta: document.getElementById("bossEmployeeAttendanceMeta"),
  bossEmployeeAttendanceStats: document.getElementById("bossEmployeeAttendanceStats"),
  bossEmployeeAttendanceTable: document.getElementById("bossEmployeeAttendanceTable"),
  bossPendingLeaves: document.getElementById("bossPendingLeaves"),
  bossLeaveHistory: document.getElementById("bossLeaveHistory"),
  bossEmployeeSearch: document.getElementById("bossEmployeeSearch"),
  bossEmployeeTable: document.getElementById("bossEmployeeTable"),
  employeeForm: document.getElementById("employeeForm"),
  employeeFormError: document.getElementById("employeeFormError"),
  employeeEditorForm: document.getElementById("employeeEditorForm"),
  employeeEditorTitle: document.getElementById("employeeEditorTitle"),
  editEmployeeId: document.getElementById("editEmployeeId"),
  editEmployeeName: document.getElementById("editEmployeeName"),
  editEmployeeUsername: document.getElementById("editEmployeeUsername"),
  editEmployeeEmail: document.getElementById("editEmployeeEmail"),
  editEmployeeDepartment: document.getElementById("editEmployeeDepartment"),
  editEmployeePosition: document.getElementById("editEmployeePosition"),
  editEmployeeBirthday: document.getElementById("editEmployeeBirthday"),
  editEmployeePhone: document.getElementById("editEmployeePhone"),
  editEmployeeEmergency: document.getElementById("editEmployeeEmergency"),
  editEmployeeStartDate: document.getElementById("editEmployeeStartDate"),
  editEmployeeStatus: document.getElementById("editEmployeeStatus"),
  editEmployeePassword: document.getElementById("editEmployeePassword"),
  editEmployeeConfirmPassword: document.getElementById("editEmployeeConfirmPassword"),
  employeeEditorError: document.getElementById("employeeEditorError"),
  employeeEditorResult: document.getElementById("employeeEditorResult"),
  cancelEmployeeEditButton: document.getElementById("cancelEmployeeEditButton"),
  holidayForm: document.getElementById("holidayForm"),
  holidayError: document.getElementById("holidayError"),
  bossHolidayList: document.getElementById("bossHolidayList"),
  installSheet: document.getElementById("installSheet"),
  installStatus: document.getElementById("installStatus"),
  installHelp: document.getElementById("installHelp"),
  installNowButton: document.getElementById("installNowButton"),
  closeInstallSheet: document.getElementById("closeInstallSheet"),
  dismissInstallButton: document.getElementById("dismissInstallButton"),
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeSeededPerson(seedPerson, savedPerson) {
  if (!savedPerson) return clone(seedPerson);
  const seed = clone(seedPerson);
  return savedPerson.profileCustomized ? { ...seed, ...savedPerson } : { ...savedPerson, ...seed };
}

function mergeSeededEmployees(savedEmployees) {
  const seededEmployees = clone(seedData.employees);
  if (!Array.isArray(savedEmployees)) return seededEmployees;

  const seededIds = new Set(seededEmployees.map((employee) => employee.id));
  const savedById = new Map(savedEmployees.map((employee) => [employee.id, employee]));
  const mergedSeededEmployees = seededEmployees.map((employee) => mergeSeededPerson(employee, savedById.get(employee.id)));
  const customEmployees = savedEmployees.filter((employee) => !seededIds.has(employee.id));

  return [...mergedSeededEmployees, ...customEmployees];
}

function migrateSavedBoss(savedBoss) {
  if (!savedBoss) return savedBoss;
  const nextBoss = { ...savedBoss };
  if (nextBoss.position === "Company Boss") nextBoss.position = seedData.boss.position;
  return nextBoss;
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return clone(seedData);

  try {
    const parsed = JSON.parse(saved);
    const savedBoss = migrateSavedBoss(parsed.boss);
    const nextData = {
      ...clone(seedData),
      ...parsed,
      boss: mergeSeededPerson(seedData.boss, savedBoss),
      employees: mergeSeededEmployees(parsed.employees),
      attendance: parsed.attendance || seedData.attendance,
      leaves: parsed.leaves || seedData.leaves,
      holidays: parsed.holidays || seedData.holidays,
      passwordResets: parsed.passwordResets || [],
      settings: parsed.settings || seedData.settings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    return nextData;
  } catch {
    return clone(seedData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveSession(nextSession) {
  session = nextSession;
  if (nextSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function getCurrentUser() {
  if (!session) return null;
  if (session.role === "boss") return data.boss;
  return data.employees.find((employee) => employee.id === session.id) || null;
}

function userTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIME_ZONE;
}

function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: userTimeZone(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function currentTimeKey() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: userTimeZone(),
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.hour.padStart(2, "0")}:${map.minute.padStart(2, "0")}`;
}

function currentSecondOfDay() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: userTimeZone(),
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(map.hour) * 3600 + Number(map.minute) * 60 + Number(map.second);
}

function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateLabel(dateKey, options = {}) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: options.year === false ? undefined : "numeric",
    weekday: options.weekday ? "short" : undefined,
  }).format(dateFromKey(dateKey));
}

function longTodayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone(),
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function eachDate(startDate, endDate) {
  const dates = [];
  const start = dateFromKey(startDate);
  const end = dateFromKey(endDate);
  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    dates.push(cursor.toISOString().slice(0, 10));
  }
  return dates;
}

function countDays(startDate, endDate) {
  return eachDate(startDate, endDate).length;
}

function minutes(time) {
  if (!time) return null;
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function secondsFromTime(time) {
  if (!time) return null;
  const [hour, minute, second = 0] = time.split(":").map(Number);
  if (![hour, minute, second].every(Number.isFinite)) return null;
  return hour * 3600 + minute * 60 + second;
}

function formatElapsedTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutesPart = Math.floor((safeSeconds % 3600) / 60);
  const secondsPart = safeSeconds % 60;
  return `${hours}h ${String(minutesPart).padStart(2, "0")}m ${String(secondsPart).padStart(2, "0")}s`;
}

function hoursBetween(start, end) {
  if (!start || !end) return "--";
  const duration = Math.max(0, minutes(end) - minutes(start));
  return `${(duration / 60).toFixed(1)}h`;
}

function completedMinutes(record) {
  if (!record?.timeIn || !record?.timeOut) return 0;
  return Math.max(0, minutes(record.timeOut) - minutes(record.timeIn));
}

function hoursFromMinutes(totalMinutes) {
  return `${(totalMinutes / 60).toFixed(1)}h`;
}

function workedTime(record) {
  if (!record?.timeIn) return "--";
  if (record.timeOut) return hoursBetween(record.timeIn, record.timeOut);
  if (record.date !== todayKey()) return "No time out";

  const startedAt = secondsFromTime(record.timeIn);
  if (startedAt === null) return "--";
  return formatElapsedTime(currentSecondOfDay() - startedAt);
}

function workTimer(record) {
  if (!record) return "--";
  const isRunning = record.timeIn && !record.timeOut && record.date === todayKey();
  return `<span class="work-timer ${isRunning ? "is-running" : ""}" data-work-timer data-timer-date="${escapeHTML(record.date)}" data-timer-start="${escapeHTML(record.timeIn)}" data-timer-end="${escapeHTML(record.timeOut || "")}">${escapeHTML(workedTime(record))}</span>`;
}

function computeStatus(timeIn) {
  return minutes(timeIn) > minutes(data.settings.shiftStart) ? "Late" : "Present";
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarMarkup(user, extraClass = "") {
  const classes = ["avatar", extraClass, user.photo ? "has-photo" : ""].filter(Boolean).join(" ");
  return `<span class="${escapeHTML(classes)}">${
    user.photo ? `<img src="${escapeHTML(user.photo)}" alt="${escapeHTML(user.name)} profile photo" />` : escapeHTML(initials(user.name))
  }</span>`;
}

function renderAvatar(element, user) {
  element.className = `avatar${user.photo ? " has-photo" : ""}`;
  element.innerHTML = user.photo ? `<img src="${escapeHTML(user.photo)}" alt="${escapeHTML(user.name)} profile photo" />` : escapeHTML(initials(user.name));
}

function profilePhotoMarkup(user, extraClass = "") {
  const classes = ["profile-photo", extraClass, user.photo ? "has-photo" : ""].filter(Boolean).join(" ");
  return `<span class="${escapeHTML(classes)}">${
    user.photo ? `<img src="${escapeHTML(user.photo)}" alt="${escapeHTML(user.name)} profile photo" />` : escapeHTML(initials(user.name))
  }</span>`;
}

function badge(status) {
  const className = status.toLowerCase().replace(/\s+/g, "-");
  return `<span class="badge ${className}">${escapeHTML(status)}</span>`;
}

function findHoliday(dateKey) {
  return data.holidays.find((holiday) => holiday.date === dateKey && holiday.blocked);
}

function holidayInRange(startDate, endDate) {
  const dates = new Set(eachDate(startDate, endDate));
  return data.holidays.find((holiday) => holiday.blocked && dates.has(holiday.date));
}

function approvedLeaveFor(employeeId, dateKey) {
  return data.leaves.find((leave) => {
    return (
      leave.employeeId === employeeId &&
      leave.status === "Approved" &&
      dateKey >= leave.startDate &&
      dateKey <= leave.endDate
    );
  });
}

function attendanceFor(employeeId, dateKey) {
  return data.attendance.find((record) => record.employeeId === employeeId && record.date === dateKey);
}

function employeeById(employeeId) {
  return data.employees.find((employee) => employee.id === employeeId);
}

function dailyStatus(employee, dateKey) {
  const holiday = findHoliday(dateKey);
  if (holiday) {
    return {
      status: "Holiday",
      label: holiday.name,
      record: null,
      leave: null,
    };
  }

  const leave = approvedLeaveFor(employee.id, dateKey);
  if (leave) {
    return {
      status: "Leave",
      label: leave.type,
      record: null,
      leave,
    };
  }

  const record = attendanceFor(employee.id, dateKey);
  if (record) {
    const status = record.timeOut ? record.status : "In progress";
    return {
      status,
      label: record.timeOut ? hoursBetween(record.timeIn, record.timeOut) : "Clocked in",
      record,
      leave: null,
    };
  }

  return {
    status: "Absent",
    label: "No record",
    record: null,
    leave: null,
  };
}

function upcomingBirthdays(limit = 5) {
  const today = dateFromKey(todayKey());
  const year = today.getUTCFullYear();

  return data.employees
    .map((employee) => {
      const [, month, day] = employee.birthday.split("-").map(Number);
      let next = new Date(Date.UTC(year, month - 1, day));
      if (next < today) next = new Date(Date.UTC(year + 1, month - 1, day));
      const daysAway = Math.round((next - today) / 86400000);
      return {
        employee,
        dateKey: next.toISOString().slice(0, 10),
        daysAway,
      };
    })
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, limit);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function updateInstallUI() {
  const installed = isStandaloneApp();
  const hasPrompt = Boolean(deferredInstallPrompt);
  const status = installed
    ? "Installed on this device."
    : hasPrompt
      ? "Ready to install on this device."
      : "Use your browser menu to add this app to your home screen.";

  document.querySelectorAll(".install-trigger, .mobile-app-banner").forEach((element) => {
    element.classList.toggle("is-installed", installed);
  });

  if (els.installStatus) els.installStatus.textContent = status;
  if (els.installHelp) {
    els.installHelp.textContent = hasPrompt
      ? "Tap Install now to save Attendance to this device."
      : "Android Chrome can install this as an app. On iPhone, use Share, then Add to Home Screen.";
  }
  if (els.installNowButton) {
    els.installNowButton.textContent = hasPrompt ? "Install now" : "Show install steps";
  }
}

function openInstallSheet() {
  if (isStandaloneApp()) {
    showToast("Attendance is already installed on this device.");
    updateInstallUI();
    return;
  }

  updateInstallUI();
  els.installSheet.classList.remove("hidden");
  els.installSheet.setAttribute("aria-hidden", "false");
}

function closeInstallSheet() {
  els.installSheet.classList.add("hidden");
  els.installSheet.setAttribute("aria-hidden", "true");
}

function openForgotPasswordSheet() {
  els.forgotPasswordForm.reset();
  els.forgotPasswordError.textContent = "";
  els.forgotPasswordResult.textContent = "";
  els.forgotPasswordResult.classList.add("hidden");
  els.forgotPasswordSheet.classList.remove("hidden");
  els.forgotPasswordSheet.setAttribute("aria-hidden", "false");
  els.forgotPasswordIdentifier.focus();
}

function closeForgotPasswordSheet() {
  els.forgotPasswordSheet.classList.add("hidden");
  els.forgotPasswordSheet.setAttribute("aria-hidden", "true");
}

function passwordResetEmailLink(user, resetCode) {
  const subject = encodeURIComponent("CRM Digital Attendance password reset confirmation");
  const body = encodeURIComponent(
    `Hi ${user.name},\n\nWe received a password reset request for your CRM Digital Attendance account.\n\nConfirmation code: ${resetCode}\n\nIf you requested this, reply to your administrator with this code so they can confirm your identity and help reset your password.\n\nIf you did not request this, please ignore this message.`
  );
  return `mailto:${encodeURIComponent(user.email)}?subject=${subject}&body=${body}`;
}

function loginDetailsEmailLink(employee, password) {
  const username = employee.username || employee.email.split("@")[0];
  const subject = encodeURIComponent("CRM Digital Attendance login details");
  const body = encodeURIComponent(
    `Hi ${employee.name},\n\nYour CRM Digital Attendance login details were updated by the administrator.\n\nUsername: ${username}\nEmail: ${employee.email}\nNew password: ${password}\n\nPlease sign in using these details and change your password from My Details when you can.\n\nThank you.`
  );
  return `mailto:${encodeURIComponent(employee.email)}?subject=${subject}&body=${body}`;
}

function handleForgotPassword(event) {
  event.preventDefault();
  const identifier = els.forgotPasswordIdentifier.value.trim();
  const users = [data.boss, ...data.employees];
  const user = users.find((entry) => loginIdentifierMatches(entry, identifier));
  els.forgotPasswordError.textContent = "";
  els.forgotPasswordResult.textContent = "";
  els.forgotPasswordResult.classList.add("hidden");

  if (!user) {
    els.forgotPasswordError.textContent = "No account matches that username or email.";
    return;
  }

  const resetCode = Math.random().toString(36).slice(2, 8).toUpperCase();
  const mailto = passwordResetEmailLink(user, resetCode);
  data.passwordResets = data.passwordResets || [];
  data.passwordResets.push({
    id: uid("reset"),
    userId: user.id,
    email: user.email,
    code: resetCode,
    requestedAt: `${todayKey()} ${currentTimeKey()}`,
    status: "Email draft prepared",
  });
  saveData();

  els.forgotPasswordResult.innerHTML = `
    <div class="detail-row">
      <span>Email</span>
      <strong>${escapeHTML(user.email)}</strong>
    </div>
    <div class="detail-row">
      <span>Confirmation code</span>
      <strong>${escapeHTML(resetCode)}</strong>
    </div>
    <a class="secondary mail-link" href="${escapeHTML(mailto)}">Open confirmation email</a>
  `;
  els.forgotPasswordResult.classList.remove("hidden");
  showToast("Password reset email prepared.");
}

async function installApp() {
  if (!deferredInstallPrompt) {
    showToast("Use your browser menu to add Attendance to your home screen.");
    updateInstallUI();
    return;
  }

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  updateInstallUI();

  if (choice.outcome === "accepted") {
    closeInstallSheet();
    showToast("Attendance app installation started.");
  } else {
    showToast("Installation dismissed.");
  }
}

function initPWA() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUI();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updateInstallUI();
    closeInstallSheet();
    showToast("Attendance is installed.");
  });
}

function loginIdentifierMatches(user, identifier) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const email = user.email.toLowerCase();
  const username = (user.username || email.split("@")[0]).toLowerCase();
  const aliases = [email, username];
  if (user.role === "boss") aliases.push("owner", "admin", "boss");
  return aliases.includes(normalizedIdentifier);
}

function setActiveView(viewId) {
  ui.activeView = viewId;
  document.querySelectorAll(".content-view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  const titles = {
    employeeDashboard: "Employee dashboard",
    employeeLeave: "Leave filing",
    employeeProfile: "My details",
    bossOverview: "Dashboard",
    bossProfile: "My Profile",
    bossAttendance: "Attendance checker",
    bossEmployeeAttendance: "Employee attendance",
    bossLeaves: "Leave approval",
    bossPeople: "Employee records",
    bossHolidays: "Holiday blocking",
  };
  els.pageTitle.textContent = titles[viewId] || "Dashboard";
}

function renderShell() {
  const user = getCurrentUser();
  const isSignedIn = Boolean(user);

  els.loginView.classList.toggle("hidden", isSignedIn);
  els.appView.classList.toggle("hidden", !isSignedIn);

  if (!isSignedIn) {
    document.body.classList.remove("employee-mode", "boss-mode");
    updateInstallUI();
    return;
  }

  const mode = user.role === "boss" ? "boss" : "employee";
  document.body.classList.toggle("employee-mode", mode === "employee");
  document.body.classList.toggle("boss-mode", mode === "boss");

  els.roleLabel.textContent = mode === "boss" ? "Backend" : "Employee portal";
  els.todayLabel.textContent = longTodayLabel();
  els.currentUserName.textContent = user.name;
  els.currentUserMeta.textContent = `${user.position} - ${user.department}`;
  renderAvatar(els.userInitials, user);

  if (mode === "boss" && !ui.activeView.startsWith("boss")) ui.activeView = "bossOverview";
  if (mode === "employee" && !ui.activeView.startsWith("employee")) ui.activeView = "employeeDashboard";
  setActiveView(ui.activeView);

  if (mode === "boss") {
    renderBoss();
  } else {
    renderEmployee(user);
  }
  updateInstallUI();
}

function renderEmployee(employee) {
  els.employeeGreeting.textContent = `Hello, ${employee.name.split(" ")[0]}`;
  renderEmployeeTimeCard(employee);
  renderEmployeeStats(employee);
  renderEmployeeRecentLogs(employee);
  renderEmployeeLeave(employee);
  renderEmployeeProfile(employee);
}

function renderEmployeeTimeCard(employee) {
  const today = todayKey();
  const holiday = findHoliday(today);
  const record = attendanceFor(employee.id, today);
  const leave = approvedLeaveFor(employee.id, today);
  const canTimeIn = !holiday && !leave && !record;
  const canTimeOut = !holiday && !leave && record && !record.timeOut;
  const status = holiday ? "Holiday blocked" : leave ? "Approved leave" : record ? dailyStatus(employee, today).status : "Ready";

  els.todayWorkStatus.textContent = status;
  els.employeeTimeCard.innerHTML = `
    <p class="note">${escapeHTML(dateLabel(today, { weekday: true }))} shift: ${escapeHTML(data.settings.shiftStart)} to ${escapeHTML(data.settings.shiftEnd)}</p>
    ${
      holiday
        ? `<p class="note">${escapeHTML(holiday.name)} is blocked for attendance.</p>`
        : leave
          ? `<p class="note">${escapeHTML(leave.type)} is approved for today.</p>`
          : ""
    }
    <div class="time-display">
      <div class="time-box">
        <span>Time in</span>
        <strong>${record?.timeIn || "--:--"}</strong>
      </div>
      <div class="time-box">
        <span>Time out</span>
        <strong>${record?.timeOut || "--:--"}</strong>
      </div>
      <div class="time-box worked-time-box">
        <span>Hours worked</span>
        <strong>${record ? workTimer(record) : "--"}</strong>
      </div>
    </div>
    <div class="time-actions">
      <button class="primary" type="button" data-clock="in" ${canTimeIn ? "" : "disabled"}>Time in</button>
      <button class="secondary" type="button" data-clock="out" ${canTimeOut ? "" : "disabled"}>Time out</button>
    </div>
    <p class="note">Status: ${badge(status)}</p>
  `;
}

function renderEmployeeStats(employee) {
  const month = todayKey().slice(0, 7);
  const records = data.attendance.filter((record) => record.employeeId === employee.id && record.date.startsWith(month));
  const present = records.filter((record) => record.status === "Present").length;
  const late = records.filter((record) => record.status === "Late").length;
  const leaves = data.leaves.filter((leave) => leave.employeeId === employee.id && leave.status === "Approved" && leave.startDate.startsWith(month));
  const pending = data.leaves.filter((leave) => leave.employeeId === employee.id && leave.status === "Pending").length;

  els.employeeStats.innerHTML = [
    stat("Present", present),
    stat("Late", late),
    stat("Approved leave", leaves.reduce((sum, leave) => sum + leave.days, 0)),
    stat("Pending leave", pending),
  ].join("");
}

function renderEmployeeRecentLogs(employee) {
  const rows = data.attendance
    .filter((record) => record.employeeId === employee.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)
    .map(
      (record) => `
        <tr>
          <td>${escapeHTML(dateLabel(record.date, { weekday: true }))}</td>
          <td>${escapeHTML(record.timeIn)}</td>
          <td>${escapeHTML(record.timeOut || "--")}</td>
          <td>${escapeHTML(hoursBetween(record.timeIn, record.timeOut))}</td>
          <td>${badge(record.status)}</td>
        </tr>
      `
    )
    .join("");

  els.employeeRecentLogs.innerHTML = rows
    ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>In</th><th>Out</th><th>Total</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`
    : empty("No attendance records yet.");
}

function renderEmployeeLeave(employee) {
  const holidays = data.holidays
    .filter((holiday) => holiday.blocked && holiday.date >= todayKey())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)
    .map(
      (holiday) => `
        <div class="list-row">
          <div>
            <strong>${escapeHTML(holiday.name)}</strong>
            <span>${escapeHTML(dateLabel(holiday.date, { weekday: true }))} - ${escapeHTML(holiday.type)}</span>
          </div>
          ${badge("Holiday")}
        </div>
      `
    )
    .join("");

  els.employeeHolidayList.innerHTML = holidays ? `<div class="list">${holidays}</div>` : empty("No upcoming blocked holidays.");

  const leaves = data.leaves
    .filter((leave) => leave.employeeId === employee.id)
    .sort((a, b) => b.filedAt.localeCompare(a.filedAt))
    .map(
      (leave) => `
        <div class="list-row">
          <div>
            <strong>${escapeHTML(leave.type)} - ${escapeHTML(leave.days)} day${leave.days > 1 ? "s" : ""}</strong>
            <span>${escapeHTML(dateLabel(leave.startDate))} to ${escapeHTML(dateLabel(leave.endDate))}</span>
            <span>${escapeHTML(leave.reason)}</span>
          </div>
          ${badge(leave.status)}
        </div>
      `
    )
    .join("");

  els.employeeLeaveList.innerHTML = leaves ? `<div class="list">${leaves}</div>` : empty("No leave requests yet.");
}

function renderEmployeeProfile(employee) {
  els.employeeProfileCard.innerHTML = profileSummary(employee, employee.status);
  els.employeeProfileEditor.innerHTML = profileEditor(employee);

  const nextBirthday = upcomingBirthdays(data.employees.length).find((entry) => entry.employee.id === employee.id);
  const birthdayLabel = employee.birthday ? dateLabel(employee.birthday, { year: false }) : "Not set";
  const nextBirthdayLabel = nextBirthday ? `${dateLabel(nextBirthday.dateKey, { weekday: true })} (${nextBirthday.daysAway} days)` : "Not set";
  const startDateLabel = employee.startDate ? dateLabel(employee.startDate) : "Not set";
  els.employeeMilestones.innerHTML = `
    <div class="profile-grid">
      ${detail("Birthday", birthdayLabel)}
      ${detail("Next birthday", nextBirthdayLabel)}
      ${detail("Tenure start", startDateLabel)}
      ${detail("Your timezone", userTimeZone())}
    </div>
  `;
}

function renderBoss() {
  renderBossStats();
  renderBossPending();
  renderBossBirthdays();
  renderBossProfile();
  renderBossAttendance();
  renderBossEmployeeAttendance();
  renderBossLeaves();
  renderBossPeople();
  renderBossHolidays();
}

function renderBossProfile() {
  els.bossProfileCard.innerHTML = profileSummary(data.boss, "Owner");
  els.bossProfileEditor.innerHTML = profileEditor(data.boss);
}

function renderBossStats() {
  const today = todayKey();
  const daily = data.employees.map((employee) => dailyStatus(employee, today));
  const present = daily.filter((entry) => entry.status === "Present" || entry.status === "In progress").length;
  const late = daily.filter((entry) => entry.status === "Late").length;
  const leave = daily.filter((entry) => entry.status === "Leave").length;
  const pending = data.leaves.filter((entry) => entry.status === "Pending").length;
  const holiday = findHoliday(today) ? 1 : 0;

  els.bossStats.innerHTML = [
    stat("Present today", present),
    stat("Late", late),
    stat("On leave", leave),
    stat("Pending approval", pending),
    stat("Holiday block", holiday),
  ].join("");
}

function renderBossPending() {
  const pending = data.leaves.filter((leave) => leave.status === "Pending").slice(0, 4);
  els.bossPendingPreview.innerHTML = pending.length ? leaveRows(pending, true) : empty("No pending leave approvals.");
}

function renderBossBirthdays() {
  const rows = upcomingBirthdays(6)
        .map(
          ({ employee, dateKey, daysAway }) => `
        <div class="list-row">
          <div class="person-cell">
            ${avatarMarkup(employee, "mini-avatar")}
            <div>
              <strong>${escapeHTML(employee.name)}</strong>
              <span>${escapeHTML(employee.department)} - ${escapeHTML(dateLabel(dateKey, { weekday: true }))}</span>
            </div>
          </div>
          <span class="status-pill">${escapeHTML(daysAway)} days</span>
        </div>
      `
    )
    .join("");
  els.bossBirthdayList.innerHTML = `<div class="list">${rows}</div>`;
}

function renderBossAttendance() {
  els.bossAttendanceDate.value = ui.attendanceDate;
  els.bossAttendanceSearch.value = ui.attendanceSearch;

  const query = ui.attendanceSearch.trim().toLowerCase();
  const rows = data.employees
    .filter((employee) => {
      const haystack = `${employee.name} ${employee.department} ${employee.position}`.toLowerCase();
      return haystack.includes(query);
    })
    .map((employee) => {
      const daily = dailyStatus(employee, ui.attendanceDate);
      const record = daily.record;
      return `
        <tr>
          <td>
            <button class="employee-record-link" type="button" data-employee-attendance="${escapeHTML(employee.id)}">
              <strong>${escapeHTML(employee.name)}</strong>
              <span>${escapeHTML(employee.department)}</span>
            </button>
          </td>
          <td>${escapeHTML(employee.position)}</td>
          <td>${escapeHTML(record?.timeIn || "--")}</td>
          <td>${escapeHTML(record?.timeOut || "--")}</td>
          <td>${record ? workTimer(record) : "--"}</td>
          <td>${badge(daily.status)}</td>
          <td>${escapeHTML(daily.label)}</td>
        </tr>
      `;
    })
    .join("");

  els.bossAttendanceTable.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Position</th>
            <th>In</th>
            <th>Out</th>
            <th>Total</th>
            <th>Status</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderBossEmployeeAttendance() {
  const employee = employeeById(ui.selectedEmployeeId);
  if (!employee) {
    els.bossEmployeeAttendanceName.textContent = "Attendance records";
    els.bossEmployeeAttendanceMeta.textContent = "Select an employee from Daily time records.";
    els.bossEmployeeAttendanceStats.innerHTML = "";
    els.bossEmployeeAttendanceTable.innerHTML = empty("Click an employee name in Daily time records to view their attendance history.");
    return;
  }

  const records = data.attendance
    .filter((record) => record.employeeId === employee.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const present = records.filter((record) => record.status === "Present").length;
  const late = records.filter((record) => record.status === "Late").length;
  const totalMinutes = records.reduce((sum, record) => sum + completedMinutes(record), 0);

  els.bossEmployeeAttendanceName.textContent = employee.name;
  els.bossEmployeeAttendanceMeta.textContent = `${employee.position} - ${employee.department} - ${employee.email}`;
  els.bossEmployeeAttendanceStats.innerHTML = [
    stat("Attendance records", records.length),
    stat("Present", present),
    stat("Late", late),
    stat("Completed hours", hoursFromMinutes(totalMinutes)),
  ].join("");

  const rows = records
    .map((record) => {
      const status = record.timeOut ? record.status : "In progress";
      const note = record.timeOut ? "Completed" : record.date === todayKey() ? "Clocked in" : "No time out";
      return `
        <tr>
          <td>${escapeHTML(dateLabel(record.date, { weekday: true }))}</td>
          <td>${escapeHTML(record.timeIn || "--")}</td>
          <td>${escapeHTML(record.timeOut || "--")}</td>
          <td>${workTimer(record)}</td>
          <td>${badge(status)}</td>
          <td>${escapeHTML(note)}</td>
        </tr>
      `;
    })
    .join("");

  els.bossEmployeeAttendanceTable.innerHTML = rows
    ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>In</th><th>Out</th><th>Total</th><th>Status</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table></div>`
    : empty("No attendance records for this employee yet.");
}

function openEmployeeAttendance(employeeId) {
  const employee = employeeById(employeeId);
  if (!employee) {
    showToast("Employee not found.");
    return;
  }

  ui.selectedEmployeeId = employee.id;
  renderBossEmployeeAttendance();
  setActiveView("bossEmployeeAttendance");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderBossLeaves() {
  const pending = data.leaves.filter((leave) => leave.status === "Pending");
  const history = data.leaves.filter((leave) => leave.status !== "Pending").sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));

  els.bossPendingLeaves.innerHTML = pending.length ? leaveRows(pending, true) : empty("No pending requests.");
  els.bossLeaveHistory.innerHTML = history.length ? leaveRows(history, false) : empty("No reviewed requests.");
}

function renderBossPeople() {
  els.bossEmployeeSearch.value = ui.employeeSearch;
  const query = ui.employeeSearch.trim().toLowerCase();
  const rows = data.employees
    .filter((employee) => {
      const haystack = `${employee.name} ${employee.email} ${employee.department} ${employee.position}`.toLowerCase();
      return haystack.includes(query);
    })
    .map(
      (employee) => `
        <tr>
          <td>
            <div class="person-cell">
              ${avatarMarkup(employee, "mini-avatar")}
              <div>
                <strong>${escapeHTML(employee.name)}</strong>
                <span class="muted">${escapeHTML(employee.email)}</span>
              </div>
            </div>
          </td>
          <td>${escapeHTML(employee.department)}</td>
          <td>${escapeHTML(employee.position)}</td>
          <td>${escapeHTML(dateLabel(employee.birthday, { year: false }))}</td>
          <td>${escapeHTML(employee.phone)}</td>
          <td>${escapeHTML(employee.emergency)}</td>
          <td>
            <button class="secondary" type="button" data-edit-employee="${escapeHTML(employee.id)}">Edit</button>
          </td>
        </tr>
      `
    )
    .join("");

  els.bossEmployeeTable.innerHTML = rows
    ? `<div class="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Position</th><th>Birthday</th><th>Phone</th><th>Emergency</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`
    : empty("No employees match that search.");

  renderEmployeeAdminEditor();
}

function renderEmployeeAdminEditor() {
  const employee = employeeById(ui.editingEmployeeId);
  if (!employee) {
    els.employeeEditorForm.classList.add("hidden");
    return;
  }

  els.employeeEditorTitle.textContent = `Edit ${employee.name}`;
  els.editEmployeeId.value = employee.id;
  els.editEmployeeName.value = employee.name;
  els.editEmployeeUsername.value = employee.username || employee.email.split("@")[0];
  els.editEmployeeEmail.value = employee.email;
  els.editEmployeeDepartment.value = employee.department;
  els.editEmployeePosition.value = employee.position;
  els.editEmployeeBirthday.value = employee.birthday;
  els.editEmployeePhone.value = employee.phone;
  els.editEmployeeEmergency.value = employee.emergency;
  els.editEmployeeStartDate.value = employee.startDate || todayKey();
  els.editEmployeeStatus.value = employee.status || "Active";
  els.employeeEditorForm.classList.remove("hidden");
}

function openEmployeeEditor(employeeId) {
  const employee = employeeById(employeeId);
  if (!employee) {
    showToast("Employee not found.");
    return;
  }

  ui.editingEmployeeId = employee.id;
  els.employeeEditorError.textContent = "";
  els.employeeEditorResult.textContent = "";
  els.employeeEditorResult.classList.add("hidden");
  els.editEmployeePassword.value = "";
  els.editEmployeeConfirmPassword.value = "";
  renderEmployeeAdminEditor();
  els.employeeEditorForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeEmployeeEditor() {
  ui.editingEmployeeId = "";
  els.employeeEditorForm.classList.add("hidden");
  els.employeeEditorError.textContent = "";
  els.employeeEditorResult.textContent = "";
  els.employeeEditorResult.classList.add("hidden");
  els.employeeEditorForm.reset();
}

function renderBossHolidays() {
  const rows = data.holidays
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(
      (holiday) => `
        <div class="list-row">
          <div>
            <strong>${escapeHTML(holiday.name)}</strong>
            <span>${escapeHTML(dateLabel(holiday.date, { weekday: true }))} - ${escapeHTML(holiday.type)}</span>
          </div>
          <div class="row-actions">
            ${badge("Holiday")}
            <button class="danger" type="button" data-delete-holiday="${escapeHTML(holiday.id)}">Remove</button>
          </div>
        </div>
      `
    )
    .join("");
  els.bossHolidayList.innerHTML = rows ? `<div class="list">${rows}</div>` : empty("No blocked holidays.");
}

function leaveRows(leaves, includeActions) {
  return `
    <div class="list">
      ${leaves
        .map((leave) => {
          const employee = data.employees.find((entry) => entry.id === leave.employeeId);
          return `
            <div class="list-row">
              <div>
                <strong>${escapeHTML(employee?.name || "Unknown employee")} - ${escapeHTML(leave.type)}</strong>
                <span>${escapeHTML(dateLabel(leave.startDate))} to ${escapeHTML(dateLabel(leave.endDate))} - ${escapeHTML(leave.days)} day${leave.days > 1 ? "s" : ""}</span>
                <span>${escapeHTML(leave.reason)}</span>
              </div>
              <div class="row-actions">
                ${badge(leave.status)}
                ${
                  includeActions
                    ? `<button class="primary" type="button" data-approve-leave="${escapeHTML(leave.id)}">Approve</button>
                       <button class="danger" type="button" data-reject-leave="${escapeHTML(leave.id)}">Reject</button>`
                    : ""
                }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function stat(label, value) {
  return `
    <div class="stat-card">
      <strong>${escapeHTML(value)}</strong>
      <span>${escapeHTML(label)}</span>
    </div>
  `;
}

function detail(label, value) {
  return `
    <div class="detail-row">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value)}</strong>
    </div>
  `;
}

function empty(message) {
  return `<div class="empty">${escapeHTML(message)}</div>`;
}

function profileSummary(user, statusLabel) {
  return `
    <div class="profile-hero">
      ${profilePhotoMarkup(user)}
      <div>
        <p class="eyebrow">${escapeHTML(user.role === "boss" ? "My Profile" : "Employee profile")}</p>
        <h2>${escapeHTML(user.name)}</h2>
        <span>${escapeHTML(user.position)} - ${escapeHTML(user.department)}</span>
      </div>
      ${badge(statusLabel)}
    </div>
    <div class="profile-grid">
      ${detail("Username", user.username || user.email.split("@")[0])}
      ${detail("Email", user.email)}
      ${detail("Department", user.department)}
      ${detail("Position", user.position)}
      ${detail("Phone", user.phone)}
      ${detail("Emergency", user.emergency)}
      ${detail("Start date", dateLabel(user.startDate))}
    </div>
  `;
}

function eyeIcons() {
  return `
    <svg class="eye-icon eye-open" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
    <svg class="eye-icon eye-closed" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.7 5.2A10.5 10.5 0 0 1 12 5c6 0 9.5 7 9.5 7a16.9 16.9 0 0 1-2.4 3.4" />
      <path d="M6.5 6.5C3.9 8.2 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.6 4.7-1.4" />
      <path d="M9.9 9.9A3 3 0 0 0 14.1 14.1" />
    </svg>
  `;
}

function passwordInput(name, autocomplete, attributes = "") {
  return `
    <span class="password-control">
      <input name="${escapeHTML(name)}" type="password" autocomplete="${escapeHTML(autocomplete)}" ${attributes} required />
      <button class="password-toggle" type="button" data-toggle-password aria-label="Show password" aria-pressed="false" title="Show password">
        ${eyeIcons()}
      </button>
    </span>
  `;
}

function profileEditor(user) {
  return `
    <form class="form-grid profile-form" data-profile-form data-profile-id="${escapeHTML(user.id)}" data-profile-role="${escapeHTML(user.role)}">
      <div class="module-header span-full">
        <div>
          <p class="eyebrow">Edit profile</p>
          <h2>Photo and details</h2>
        </div>
      </div>
      <div class="profile-photo-control span-full">
        <span data-profile-preview>${profilePhotoMarkup(user, "profile-photo-preview")}</span>
        <label>
          Profile image
          <input name="profilePhoto" data-profile-photo type="file" accept="image/png,image/jpeg,image/webp" />
        </label>
        <button class="ghost" type="button" data-remove-profile-photo="${escapeHTML(user.id)}" ${user.photo ? "" : "disabled"}>Remove image</button>
        <p class="note">Use a square PNG, JPG, or WebP under 1.5 MB.</p>
      </div>
      <label>
        Full name
        <input name="profileName" value="${escapeHTML(user.name)}" required />
      </label>
      <label>
        Username
        <input name="profileUsername" value="${escapeHTML(user.username || user.email.split("@")[0])}" required />
      </label>
      <label>
        Email
        <input name="profileEmail" type="email" value="${escapeHTML(user.email)}" required />
      </label>
      <label>
        Department
        <input name="profileDepartment" value="${escapeHTML(user.department)}" required />
      </label>
      <label>
        Position
        <input name="profilePosition" value="${escapeHTML(user.position)}" required />
      </label>
      <label>
        Birthday
        <input name="profileBirthday" type="date" value="${escapeHTML(user.birthday)}" required />
      </label>
      <label>
        Phone
        <input name="profilePhone" value="${escapeHTML(user.phone)}" required />
      </label>
      <label>
        Emergency contact
        <input name="profileEmergency" value="${escapeHTML(user.emergency)}" required />
      </label>
      <label>
        Start date
        <input name="profileStartDate" type="date" value="${escapeHTML(user.startDate)}" required />
      </label>
      <p class="form-error span-full" data-profile-error role="alert"></p>
      <button class="primary" type="submit">Save profile</button>
    </form>
    <form class="form-grid password-form" data-password-form data-profile-id="${escapeHTML(user.id)}" data-profile-role="${escapeHTML(user.role)}">
      <div class="module-header span-full">
        <div>
          <p class="eyebrow">Security</p>
          <h2>Change password</h2>
        </div>
      </div>
      <label>
        Current password
        ${passwordInput("currentPassword", "current-password")}
      </label>
      <label>
        New password
        ${passwordInput("newPassword", "new-password", 'minlength="6"')}
      </label>
      <label>
        Confirm new password
        ${passwordInput("confirmPassword", "new-password", 'minlength="6"')}
      </label>
      <p class="form-error span-full" data-password-error role="alert"></p>
      <button class="primary" type="submit">Change password</button>
    </form>
  `;
}

function handleLogin(event) {
  event.preventDefault();
  const identifier = els.loginEmail.value.trim();
  const password = els.loginPassword.value;
  const users = [data.boss, ...data.employees];
  const user = users.find((entry) => loginIdentifierMatches(entry, identifier) && entry.password === password);

  if (!user) {
    els.loginError.textContent = "Username/email or password is incorrect.";
    return;
  }

  saveSession({ id: user.id, role: user.role });
  ui.activeView = user.role === "boss" ? "bossOverview" : "employeeDashboard";
  els.loginForm.reset();
  setPasswordVisible(false);
  renderShell();
  showToast(`Signed in as ${user.name}.`);
}

function handleClock(direction) {
  const employee = getCurrentUser();
  if (!employee || employee.role !== "employee") return;

  const today = todayKey();
  const holiday = findHoliday(today);
  if (holiday) {
    showToast(`${holiday.name} is blocked for attendance.`);
    return;
  }

  if (approvedLeaveFor(employee.id, today)) {
    showToast("You have approved leave today.");
    return;
  }

  const record = attendanceFor(employee.id, today);
  const now = currentTimeKey();

  if (direction === "in") {
    if (record) {
      showToast("You already timed in today.");
      return;
    }
    data.attendance.push({
      id: uid("att"),
      employeeId: employee.id,
      date: today,
      timeIn: now,
      timeOut: "",
      status: computeStatus(now),
    });
    saveData();
    renderEmployee(employee);
    showToast("Time in recorded.");
    return;
  }

  if (!record) {
    showToast("Time in first before timing out.");
    return;
  }

  if (record.timeOut) {
    showToast("You already timed out today.");
    return;
  }

  record.timeOut = now;
  record.status = computeStatus(record.timeIn);
  saveData();
  renderEmployee(employee);
  showToast("Time out recorded.");
}

function handleLeaveSubmit(event) {
  event.preventDefault();
  const employee = getCurrentUser();
  if (!employee || employee.role !== "employee") return;

  const type = document.getElementById("leaveType").value;
  const startDate = document.getElementById("leaveStart").value;
  const endDate = document.getElementById("leaveEnd").value;
  const reason = document.getElementById("leaveReason").value.trim();
  els.leaveError.textContent = "";

  if (!startDate || !endDate || startDate > endDate) {
    els.leaveError.textContent = "Please choose a valid leave date range.";
    return;
  }

  const holiday = holidayInRange(startDate, endDate);
  if (holiday) {
    els.leaveError.textContent = `${holiday.name} is a blocked holiday. Choose another date.`;
    return;
  }

  const overlaps = data.leaves.some((leave) => {
    if (leave.employeeId !== employee.id || leave.status === "Rejected") return false;
    return startDate <= leave.endDate && endDate >= leave.startDate;
  });

  if (overlaps) {
    els.leaveError.textContent = "You already have a pending or approved leave in that range.";
    return;
  }

  data.leaves.push({
    id: uid("leave"),
    employeeId: employee.id,
    type,
    startDate,
    endDate,
    days: countDays(startDate, endDate),
    reason,
    status: "Pending",
    filedAt: todayKey(),
    reviewedAt: "",
    reviewedBy: "",
  });

  saveData();
  els.leaveForm.reset();
  renderEmployee(employee);
  showToast("Leave request submitted.");
}

function reviewLeave(id, status) {
  const leave = data.leaves.find((entry) => entry.id === id);
  if (!leave) return;
  leave.status = status;
  leave.reviewedAt = todayKey();
  leave.reviewedBy = data.boss.id;
  saveData();
  renderBoss();
  showToast(`Leave ${status.toLowerCase()}.`);
}

function profileTargetFromForm(form) {
  if (form.dataset.profileRole === "boss") return data.boss;
  return data.employees.find((employee) => employee.id === form.dataset.profileId) || null;
}

function setProfileError(form, message) {
  const error = form.querySelector("[data-profile-error]");
  if (error) error.textContent = message;
}

function readProfileImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    if (file.size > PROFILE_IMAGE_LIMIT) {
      reject(new Error("Image must be under 1.5 MB."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Could not read that image.")));
    reader.readAsDataURL(file);
  });
}

async function previewProfilePhoto(input) {
  const form = input.closest("[data-profile-form]");
  if (!form) return;
  const user = profileTargetFromForm(form);
  const preview = form.querySelector("[data-profile-preview]");
  if (!user || !preview || !input.files.length) return;

  try {
    setProfileError(form, "");
    const photo = await readProfileImage(input.files[0]);
    preview.innerHTML = profilePhotoMarkup({ ...user, photo }, "profile-photo-preview");
  } catch (error) {
    input.value = "";
    setProfileError(form, error.message);
  }
}

async function handleProfileSubmit(event, form) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  const target = profileTargetFromForm(form);
  if (!currentUser || !target || currentUser.id !== target.id) return;

  const fields = form.elements;
  const email = fields.profileEmail.value.trim().toLowerCase();
  const duplicateEmail = [data.boss, ...data.employees].some((entry) => entry.id !== target.id && entry.email.toLowerCase() === email);
  setProfileError(form, "");

  if (duplicateEmail) {
    setProfileError(form, "That email already belongs to another account.");
    return;
  }

  let photo = target.photo || "";
  const photoFile = fields.profilePhoto.files[0];

  try {
    const uploadedPhoto = await readProfileImage(photoFile);
    if (uploadedPhoto) photo = uploadedPhoto;
  } catch (error) {
    setProfileError(form, error.message);
    return;
  }

  Object.assign(target, {
    name: fields.profileName.value.trim(),
    username: fields.profileUsername.value.trim(),
    email,
    department: fields.profileDepartment.value.trim(),
    position: fields.profilePosition.value.trim(),
    birthday: fields.profileBirthday.value,
    phone: fields.profilePhone.value.trim(),
    emergency: fields.profileEmergency.value.trim(),
    startDate: fields.profileStartDate.value,
    photo,
    profileCustomized: true,
  });

  saveData();
  renderShell();
  showToast("Profile updated.");
}

function setPasswordError(form, message) {
  const error = form.querySelector("[data-password-error]");
  if (error) error.textContent = message;
}

function handlePasswordSubmit(event, form) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  const target = profileTargetFromForm(form);
  if (!currentUser || !target || currentUser.id !== target.id) return;

  const fields = form.elements;
  const currentPassword = fields.currentPassword.value;
  const newPassword = fields.newPassword.value.trim();
  const confirmPassword = fields.confirmPassword.value.trim();
  setPasswordError(form, "");

  if (currentPassword !== target.password) {
    setPasswordError(form, "Current password is incorrect.");
    return;
  }

  if (newPassword.length < 6) {
    setPasswordError(form, "New password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError(form, "New password and confirmation do not match.");
    return;
  }

  target.password = newPassword;
  target.profileCustomized = true;
  saveData();
  form.reset();
  showToast("Password changed.");
}

function removeProfilePhoto(id) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id !== id) return;

  currentUser.photo = "";
  currentUser.profileCustomized = true;
  saveData();
  renderShell();
  showToast("Profile image removed.");
}

function handleEmployeeSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("newEmployeeEmail").value.trim().toLowerCase();
  els.employeeFormError.textContent = "";

  const emailTaken = [data.boss, ...data.employees].some((entry) => entry.email.toLowerCase() === email);
  if (emailTaken) {
    els.employeeFormError.textContent = "That email already has access.";
    return;
  }

  data.employees.push({
    id: uid("emp"),
    role: "employee",
    name: document.getElementById("newEmployeeName").value.trim(),
    username: email.split("@")[0],
    email,
    password: document.getElementById("newEmployeePassword").value.trim(),
    department: document.getElementById("newEmployeeDepartment").value.trim(),
    position: document.getElementById("newEmployeePosition").value.trim(),
    birthday: document.getElementById("newEmployeeBirthday").value,
    phone: document.getElementById("newEmployeePhone").value.trim(),
    emergency: document.getElementById("newEmployeeEmergency").value.trim(),
    startDate: todayKey(),
    status: "Active",
  });

  saveData();
  els.employeeForm.reset();
  document.getElementById("newEmployeePassword").value = "employee123";
  renderBoss();
  showToast("Employee account added.");
}

function setEmployeeEditorError(message) {
  els.employeeEditorError.textContent = message;
}

function handleEmployeeEditSubmit(event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "boss") return;

  const employee = employeeById(els.editEmployeeId.value);
  if (!employee) {
    setEmployeeEditorError("Employee not found.");
    return;
  }

  const email = els.editEmployeeEmail.value.trim().toLowerCase();
  const username = els.editEmployeeUsername.value.trim();
  const newPassword = els.editEmployeePassword.value.trim();
  const confirmPassword = els.editEmployeeConfirmPassword.value.trim();
  const emailTaken = [data.boss, ...data.employees].some((entry) => entry.id !== employee.id && entry.email.toLowerCase() === email);
  const usernameTaken = data.employees.some((entry) => {
    const entryUsername = (entry.username || entry.email.split("@")[0]).toLowerCase();
    return entry.id !== employee.id && entryUsername === username.toLowerCase();
  });

  setEmployeeEditorError("");
  els.employeeEditorResult.textContent = "";
  els.employeeEditorResult.classList.add("hidden");

  if (emailTaken) {
    setEmployeeEditorError("That email already belongs to another account.");
    return;
  }

  if (usernameTaken) {
    setEmployeeEditorError("That username already belongs to another employee.");
    return;
  }

  if ((newPassword || confirmPassword) && newPassword.length < 6) {
    setEmployeeEditorError("New password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setEmployeeEditorError("New password and confirmation do not match.");
    return;
  }

  Object.assign(employee, {
    name: els.editEmployeeName.value.trim(),
    username,
    email,
    department: els.editEmployeeDepartment.value.trim(),
    position: els.editEmployeePosition.value.trim(),
    birthday: els.editEmployeeBirthday.value,
    phone: els.editEmployeePhone.value.trim(),
    emergency: els.editEmployeeEmergency.value.trim(),
    startDate: els.editEmployeeStartDate.value,
    status: els.editEmployeeStatus.value,
    profileCustomized: true,
  });

  if (newPassword) employee.password = newPassword;

  saveData();
  ui.editingEmployeeId = employee.id;
  els.editEmployeePassword.value = "";
  els.editEmployeeConfirmPassword.value = "";
  renderBossPeople();

  if (newPassword) {
    const mailto = loginDetailsEmailLink(employee, newPassword);
    els.employeeEditorResult.innerHTML = `
      <div class="detail-row">
        <span>Email</span>
        <strong>${escapeHTML(employee.email)}</strong>
      </div>
      <div class="detail-row">
        <span>Username</span>
        <strong>${escapeHTML(employee.username || employee.email.split("@")[0])}</strong>
      </div>
      <a class="secondary mail-link" href="${escapeHTML(mailto)}">Open login details email</a>
    `;
    els.employeeEditorResult.classList.remove("hidden");
    showToast("Employee password updated.");
  } else {
    els.employeeEditorResult.innerHTML = `<p class="note">Employee details updated.</p>`;
    els.employeeEditorResult.classList.remove("hidden");
    showToast("Employee details updated.");
  }
}

function handleHolidaySubmit(event) {
  event.preventDefault();
  const date = document.getElementById("holidayDate").value;
  const name = document.getElementById("holidayName").value.trim();
  const type = document.getElementById("holidayType").value;
  els.holidayError.textContent = "";

  if (data.holidays.some((holiday) => holiday.date === date)) {
    els.holidayError.textContent = "That date is already blocked.";
    return;
  }

  data.holidays.push({
    id: uid("hol"),
    date,
    name,
    type,
    blocked: true,
  });

  saveData();
  els.holidayForm.reset();
  renderBoss();
  showToast("Holiday blocked.");
}

function deleteHoliday(id) {
  data.holidays = data.holidays.filter((holiday) => holiday.id !== id);
  saveData();
  renderBoss();
  showToast("Holiday removed.");
}

function updateWorkTimers() {
  document.querySelectorAll("[data-work-timer]").forEach((timer) => {
    const record = {
      date: timer.dataset.timerDate,
      timeIn: timer.dataset.timerStart,
      timeOut: timer.dataset.timerEnd,
    };
    const isRunning = Boolean(record.timeIn && !record.timeOut && record.date === todayKey());
    timer.textContent = workedTime(record);
    timer.classList.toggle("is-running", isRunning);
  });
}

function updateClock() {
  if (els.liveClock) {
    els.liveClock.textContent = currentTimeKey();
  }
  updateWorkTimers();
}

function setPasswordVisible(visible) {
  els.loginPassword.type = visible ? "text" : "password";
  els.loginPasswordToggle.classList.toggle("is-visible", visible);
  els.loginPasswordToggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  els.loginPasswordToggle.setAttribute("aria-pressed", String(visible));
  els.loginPasswordToggle.setAttribute("title", visible ? "Hide password" : "Show password");
}

function togglePasswordControl(button) {
  const input = button.closest(".password-control")?.querySelector("input");
  if (!input) return;

  const visible = input.type === "password";
  input.type = visible ? "text" : "password";
  button.classList.toggle("is-visible", visible);
  button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  button.setAttribute("aria-pressed", String(visible));
  button.setAttribute("title", visible ? "Hide password" : "Show password");
  input.focus();
}

document.addEventListener("click", (event) => {
  const passwordToggle = event.target.closest("[data-toggle-password]");
  if (passwordToggle) {
    togglePasswordControl(passwordToggle);
    return;
  }

  const employeeAttendance = event.target.closest("[data-employee-attendance]");
  if (employeeAttendance) {
    openEmployeeAttendance(employeeAttendance.dataset.employeeAttendance);
    return;
  }

  const employeeEditButton = event.target.closest("[data-edit-employee]");
  if (employeeEditButton) {
    openEmployeeEditor(employeeEditButton.dataset.editEmployee);
    return;
  }

  const nav = event.target.closest("[data-view]");
  if (nav) {
    setActiveView(nav.dataset.view);
    return;
  }

  const clockButton = event.target.closest("[data-clock]");
  if (clockButton) {
    handleClock(clockButton.dataset.clock);
    return;
  }

  const approve = event.target.closest("[data-approve-leave]");
  if (approve) {
    reviewLeave(approve.dataset.approveLeave, "Approved");
    return;
  }

  const reject = event.target.closest("[data-reject-leave]");
  if (reject) {
    reviewLeave(reject.dataset.rejectLeave, "Rejected");
    return;
  }

  const deleteHolidayButton = event.target.closest("[data-delete-holiday]");
  if (deleteHolidayButton) {
    deleteHoliday(deleteHolidayButton.dataset.deleteHoliday);
    return;
  }

  const scrollTargetButton = event.target.closest("[data-scroll-target]");
  if (scrollTargetButton) {
    document.getElementById(scrollTargetButton.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const removePhotoButton = event.target.closest("[data-remove-profile-photo]");
  if (removePhotoButton) {
    removeProfilePhoto(removePhotoButton.dataset.removeProfilePhoto);
    return;
  }

  const installOpen = event.target.closest("[data-install-open]");
  if (installOpen) {
    openInstallSheet();
    return;
  }

  if (event.target === els.installSheet) {
    closeInstallSheet();
  }

  if (event.target === els.forgotPasswordSheet) {
    closeForgotPasswordSheet();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-profile-form]");
  if (form) handleProfileSubmit(event, form);

  const passwordForm = event.target.closest("[data-password-form]");
  if (passwordForm) handlePasswordSubmit(event, passwordForm);
});

document.addEventListener("change", (event) => {
  const profilePhotoInput = event.target.closest("[data-profile-photo]");
  if (profilePhotoInput) previewProfilePhoto(profilePhotoInput);
});

els.loginForm.addEventListener("submit", handleLogin);
els.loginPasswordToggle.addEventListener("click", () => {
  setPasswordVisible(els.loginPassword.type === "password");
  els.loginPassword.focus();
});
els.forgotPasswordButton.addEventListener("click", openForgotPasswordSheet);
els.forgotPasswordForm.addEventListener("submit", handleForgotPassword);
els.closeForgotPasswordSheet.addEventListener("click", closeForgotPasswordSheet);
els.cancelForgotPasswordButton.addEventListener("click", closeForgotPasswordSheet);
els.leaveForm.addEventListener("submit", handleLeaveSubmit);
els.employeeForm.addEventListener("submit", handleEmployeeSubmit);
els.employeeEditorForm.addEventListener("submit", handleEmployeeEditSubmit);
els.cancelEmployeeEditButton.addEventListener("click", closeEmployeeEditor);
els.holidayForm.addEventListener("submit", handleHolidaySubmit);

els.logoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    saveSession(null);
    renderShell();
    showToast("Signed out.");
  });
});

els.installNowButton.addEventListener("click", installApp);
els.closeInstallSheet.addEventListener("click", closeInstallSheet);
els.dismissInstallButton.addEventListener("click", closeInstallSheet);

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!els.installSheet.classList.contains("hidden")) {
    closeInstallSheet();
  }
  if (!els.forgotPasswordSheet.classList.contains("hidden")) {
    closeForgotPasswordSheet();
  }
});

els.bossAttendanceDate.addEventListener("change", (event) => {
  ui.attendanceDate = event.target.value || todayKey();
  renderBossAttendance();
});

els.bossAttendanceSearch.addEventListener("input", (event) => {
  ui.attendanceSearch = event.target.value;
  renderBossAttendance();
});

els.bossEmployeeSearch.addEventListener("input", (event) => {
  ui.employeeSearch = event.target.value;
  renderBossPeople();
});

document.getElementById("leaveStart").value = todayKey();
document.getElementById("leaveEnd").value = todayKey();
els.bossAttendanceDate.value = todayKey();
initPWA();
updateInstallUI();
updateClock();
window.setInterval(updateClock, 1000);
renderShell();
