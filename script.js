/* =====================================================
   وسيط القانوني والقضائي
   JavaScript
   ===================================================== */


/* =========================
   عناصر عامة
========================= */

const modal = document.getElementById("mainModal");
const modalContent = document.getElementById("modalContent");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");


/* =========================
   القائمة في الهاتف
========================= */

if (menuToggle) {

    menuToggle.addEventListener("click", function () {

        mainNav.classList.toggle("show");

    });

}


document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", function () {

        mainNav.classList.remove("show");

    });

});


/* =========================
   فتح وإغلاق النافذة
========================= */

function openModal(content) {

    modalContent.innerHTML = content;

    modal.classList.add("show");

    document.body.classList.add("modal-open");

}


function closeModal() {

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");

}


function closeModalOutside(event) {

    if (event.target === modal) {
        closeModal();
    }

}


/* =========================
   قاعدة البيانات المحلية
========================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("waseet_users") || "[]"
    );

}


function saveUsers(users) {

    localStorage.setItem(
        "waseet_users",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("waseet_current_user") || "null"
    );

}


function setCurrentUser(user) {

    localStorage.setItem(
        "waseet_current_user",
        JSON.stringify(user)
    );

}


function logout() {

    localStorage.removeItem("waseet_current_user");

    closeModal();

    alert("تم تسجيل الخروج.");

}


/* =========================
   أنواع الحسابات
========================= */

const accountTypes = {

    lawyer: "محامي",

    trainee: "محامي تحت التدريب",

    judge: "قاضٍ / محكم",

    client: "عميل"

};


/* =========================
   إنشاء الحساب
========================= */

function openRegister(selectedType = "") {

    const selectedLawyer =
        selectedType === "lawyer" ? "selected" : "";

    const selectedTrainee =
        selectedType === "trainee" ? "selected" : "";

    const selectedJudge =
        selectedType === "judge" ? "selected" : "";

    const selectedClient =
        selectedType === "client" ? "selected" : "";


    openModal(`

        <div class="auth-header">

            <i class="fas fa-user-plus"></i>

            <h2>إنشاء حساب جديد</h2>

            <p>
                أنشئ حسابك في منصة وسيط
            </p>

        </div>


        <div id="registerAlert"></div>


        <form id="registerForm">

            <div class="form-group">

                <label>الاسم الكامل</label>

                <input
                    class="form-control"
                    id="registerName"
                    type="text"
                    placeholder="اكتب الاسم الكامل"
                    required
                >

            </div>


            <div class="form-group">

                <label>رقم الهاتف</label>

                <input
                    class="form-control"
                    id="registerPhone"
                    type="tel"
                    placeholder="مثال: 777000000"
                    required
                >

            </div>


            <div class="form-group">

                <label>البريد الإلكتروني</label>

                <input
                    class="form-control"
                    id="registerEmail"
                    type="email"
                    placeholder="example@email.com"
                    required
                >

            </div>


            <div class="form-group">

                <label>نوع الحساب</label>

                <select
                    class="form-control"
                    id="registerType"
                    required
                >

                    <option value="">
                        اختر نوع الحساب
                    </option>

                    <option value="lawyer" ${selectedLawyer}>
                        محامي
                    </option>

                    <option value="trainee" ${selectedTrainee}>
                        محامي تحت التدريب
                    </option>

                    <option value="judge" ${selectedJudge}>
                        قاضٍ / محكم
                    </option>

                    <option value="client" ${selectedClient}>
                        عميل
                    </option>

                </select>

            </div>


            <div class="form-group">

                <label>كلمة المرور</label>

                <input
                    class="form-control"
                    id="registerPassword"
                    type="password"
                    placeholder="6 أحرف على الأقل"
                    minlength="6"
                    required
                >

            </div>


            <div class="form-group">

                <label>تأكيد كلمة المرور</label>

                <input
                    class="form-control"
                    id="registerPassword2"
                    type="password"
                    placeholder="أعد كتابة كلمة المرور"
                    minlength="6"
                    required
                >

            </div>


            <button
                class="auth-submit"
                type="submit">

                إنشاء الحساب

            </button>

        </form>


        <div class="auth-switch">

            لديك حساب بالفعل؟

            <button onclick="openLogin()">
                تسجيل الدخول
            </button>

        </div>

    `);


    document
        .getElementById("registerForm")
        .addEventListener("submit", registerUser);

}


/* =========================
   تنفيذ إنشاء الحساب
========================= */

function registerUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const email =
        document.getElementById("registerEmail").value
            .trim()
            .toLowerCase();

    const type =
        document.getElementById("registerType").value;

    const password =
        document.getElementById("registerPassword").value;

    const password2 =
        document.getElementById("registerPassword2").value;


    const alertBox =
        document.getElementById("registerAlert");


    if (password !== password2) {

        alertBox.innerHTML = `
            <div class="alert error">
                كلمتا المرور غير متطابقتين.
            </div>
        `;

        return;
    }


    const users = getUsers();


    const existing =
        users.find(user => user.email === email);


    if (existing) {

        alertBox.innerHTML = `
            <div class="alert error">
                يوجد حساب مسجل بهذا البريد الإلكتروني.
            </div>
        `;

        return;
    }


    const user = {

        id: Date.now(),

        name: name,

        phone: phone,

        email: email,

        type: type,

        role: accountTypes[type],

        password: password,

        createdAt:
            new Date().toISOString()

    };


    users.push(user);

    saveUsers(users);


    const loginUser = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        type: user.type,
        role: user.role
    };


    setCurrentUser(loginUser);


    openUserPanel(loginUser);

}


/* =========================
   تسجيل الدخول
========================= */

function openLogin() {

    openModal(`

        <div class="auth-header">

            <i class="fas fa-right-to-bracket"></i>

            <h2>تسجيل الدخول</h2>

            <p>
                أدخل بيانات حسابك
            </p>

        </div>


        <div id="loginAlert"></div>


        <form id="loginForm">

            <div class="form-group">

                <label>البريد الإلكتروني</label>

                <input
                    class="form-control"
                    id="loginEmail"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    required
                >

            </div>


            <div class="form-group">

                <label>كلمة المرور</label>

                <input
                    class="form-control"
                    id="loginPassword"
                    type="password"
                    placeholder="كلمة المرور"
                    required
                >

            </div>


            <button
                class="auth-submit"
                type="submit">

                دخول

            </button>

        </form>


        <div class="auth-switch">

            ليس لديك حساب؟

            <button onclick="openRegister()">
                إنشاء حساب
            </button>

        </div>

    `);


    document
        .getElementById("loginForm")
        .addEventListener("submit", loginUser);

}


/* =========================
   تنفيذ الدخول
========================= */

function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById("loginPassword")
            .value;


    const alertBox =
        document.getElementById("loginAlert");


    const users = getUsers();


    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        alertBox.innerHTML = `
            <div class="alert error">
                البريد الإلكتروني أو كلمة المرور غير صحيحة.
            </div>
        `;

        return;
    }


    const loginUser = {

        id: user.id,

        name: user.name,

        phone: user.phone,

        email: user.email,

        type: user.type,

        role: user.role

    };


    setCurrentUser(loginUser);


    openUserPanel(loginUser);

}


/* =========================
   لوحة المستخدم
========================= */

function openUserPanel(user) {

    openModal(`

        <div class="user-panel">

            <div class="user-avatar">

                <i class="fas fa-user"></i>

            </div>


            <h2>
                مرحبًا ${escapeHTML(user.name)}
            </h2>


            <span class="user-role">
                ${escapeHTML(user.role)}
            </span>


            <div class="user-actions">

                <button onclick="goToDashboard()">

                    <i class="fas fa-gauge"></i>

                    لوحة الحساب

                </button>


                <button onclick="createProfessionalPage()">

                    <i class="fas fa-id-card"></i>

                    إنشاء الصفحة المهنية

                </button>


                <button onclick="openProfileInfo()">

                    <i class="fas fa-user"></i>

                    بيانات الحساب

                </button>


                <button
                    class="logout"
                    onclick="logout()">

                    <i class="fas fa-right-from-bracket"></i>

                    تسجيل الخروج

                </button>

            </div>

        </div>

    `);

}


/* =========================
   التحقق من تسجيل الدخول
========================= */

function requireLogin(callback) {

    const user = getCurrentUser();


    if (!user) {

        openLogin();

        return;

    }


    callback();

}


/* =========================
   لوحة الحساب
========================= */

function goToDashboard() {

    const user = getCurrentUser();


    if (!user) {

        openLogin();

        return;

    }


    closeModal();


    setTimeout(() => {

        document
            .getElementById("profiles")
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 200);

}


/* =========================
   إنشاء الصفحة المهنية
========================= */

function createProfessionalPage() {

    const user = getCurrentUser();


    if (!user) {

        openLogin();

        return;

    }


    openModal(`

        <div class="auth-header">

            <i class="fas fa-id-card"></i>

            <h2>إنشاء الصفحة المهنية</h2>

            <p>
                ${escapeHTML(user.role)}
            </p>

        </div>


        <form id="professionalForm">

            <div class="form-group">

                <label>المسمى المهني</label>

                <input
                    class="form-control"
                    id="professionalTitle"
                    placeholder="مثال: محامي"
                    required
                >

            </div>


            <div class="form-group">

                <label>التخصص</label>

                <input
                    class="form-control"
                    id="professionalSpecialty"
                    placeholder="مثال: القانون المدني"
                    required
                >

            </div>


            <div class="form-group">

                <label>نبذة مهنية</label>

                <textarea
                    class="form-control"
                    id="professionalBio"
                    rows="4"
                    placeholder="اكتب نبذة عنك"
                ></textarea>

            </div>


            <button
                class="auth-submit"
                type="submit">

                حفظ الصفحة المهنية

            </button>

        </form>

    `);


    document
        .getElementById("professionalForm")
        .addEventListener("submit", saveProfessionalPage);

}


/* =========================
   حفظ الصفحة المهنية
========================= */

function saveProfessionalPage(event) {

    event.preventDefault();


    const user = getCurrentUser();


    const page = {

        title:
            document.getElementById("professionalTitle").value,

        specialty:
            document.getElementById("professionalSpecialty").value,

        bio:
            document.getElementById("professionalBio").value,

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "professional_" + user.id,
        JSON.stringify(page)
    );


    openModal(`

        <div class="auth-header">

            <i class="fas fa-circle-check"></i>

            <h2>تم حفظ الصفحة</h2>

            <p>
                تم إنشاء الصفحة المهنية بنجاح.
            </p>

        </div>

        <button
            class="auth-submit"
            onclick="openUserPanel(getCurrentUser())">

            العودة إلى الحساب

        </button>

    `);

}


/* =========================
   بيانات الحساب
========================= */

function openProfileInfo() {

    const user = getCurrentUser();


    if (!user) {

        openLogin();

        return;

    }


    openModal(`

        <div class="auth-header">

            <i class="fas fa-user-circle"></i>

            <h2>بيانات الحساب</h2>

        </div>


        <div class="alert success">

            الاسم: ${escapeHTML(user.name)}

        </div>

        <div class="alert success">

            البريد:
            ${escapeHTML(user.email)}

        </div>

        <div class="alert success">

            الهاتف:
            ${escapeHTML(user.phone)}

        </div>

        <div class="alert success">

            نوع الحساب:
            ${escapeHTML(user.role)}

        </div>


        <button
            class="auth-submit"
            onclick="openUserPanel(getCurrentUser())">

            رجوع

        </button>

    `);

}


/* =========================
   الجلسات
========================= */

function addSession() {

    const user = getCurrentUser();


    if (!user) {

        openLogin();

        return;

    }


    openModal(`

        <div class="auth-header">

            <i class="fas fa-calendar-plus"></i>

            <h2>إضافة جلسة</h2>

        </div>


        <form id="sessionForm">

            <div class="form-group">

                <label>رقم القضية</label>

                <input
                    class="form-control"
                    id="caseNumber"
                    required
                >

            </div>


            <div class="form-group">

                <label>نوع القضية</label>

                <input
                    class="form-control"
                    id="caseType"
                    placeholder="مدنية / جنائية / تجارية..."
                    required
                >

            </div>


            <div class="form-group">

                <label>التاريخ</label>

                <input
                    class="form-control"
                    id="sessionDate"
                    type="date"
                    required
                >

            </div>


            <div class="form-group">

                <label>الوقت</label>

                <input
                    class="form-control"
                    id="sessionTime"
                    type="time"
                    required
                >

            </div>


            <button
                class="auth-submit"
                type="submit">

                حفظ الجلسة

            </button>

        </form>

    `);


    document
        .getElementById("sessionForm")
        .addEventListener("submit", saveSession);

}


function saveSession(event) {

    event.preventDefault();


    const caseNumber =
        document.getElementById("caseNumber").value;

    const caseType =
        document.getElementById("caseType").value;

    const date =
        document.getElementById("sessionDate").value;

    const time =
        document.getElementById("sessionTime").value;


    const sessions =
        JSON.parse(
            localStorage.getItem("waseet_sessions") || "[]"
        );


    sessions.push({

        caseNumber,
        caseType,
        date,
        time

    });


    localStorage.setItem(
        "waseet_sessions",
        JSON.stringify(sessions)
    );


    closeModal();

    renderSessions();

    alert("تمت إضافة الجلسة بنجاح.");

}


function renderSessions() {

    const table =
        document.getElementById("sessionsTable");


    if (!table) return;


    const sessions =
        JSON.parse(
            localStorage.getItem("waseet_sessions") || "[]"
        );


    sessions.forEach(session => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(session.caseNumber)}</td>

            <td>${escapeHTML(session.caseType)}</td>

            <td>${escapeHTML(session.date)}</td>

            <td>${escapeHTML(session.time)}</td>

            <td>
                <span class="status upcoming">
                    قادمة
                </span>
            </td>

            <td>
                <button
                    class="icon-btn"
                    onclick="viewSession('${escapeJS(session.caseNumber)}')">

                    <i class="fas fa-eye"></i>

                </button>
            </td>

        `;


        table.appendChild(row);

    });

}


function viewSession(number) {

    openModal(`

        <div class="auth-header">

            <i class="fas fa-calendar-check"></i>

            <h2>تفاصيل الجلسة</h2>

        </div>


        <div class="alert success">

            رقم القضية:
            ${escapeHTML(number)}

        </div>


        <button
            class="auth-submit"
            onclick="closeModal()">

            إغلاق

        </button>

    `);

}


/* =========================
   المحامي
========================= */

function lawyerAction(action) {

    const messages = {

        files:
            "تم فتح قسم ملفات القضايا.",

        documents:
            "تم فتح قسم المستندات.",

        send:
            "تم فتح نموذج إرسال ملف القضية."

    };


    openModal(`

        <div class="auth-header">

            <i class="fas fa-briefcase"></i>

            <h2>بوابة المحامي</h2>

            <p>
                ${messages[action] || "تم تنفيذ العملية."}
            </p>

        </div>

        <button
            class="auth-submit"
            onclick="closeModal()">

            إغلاق

        </button>

    `);

}


/* =========================
   لوحة القاضي
========================= */

function judgePanel(type, button) {

    document
        .querySelectorAll(".dashboard-menu button")
        .forEach(btn => btn.classList.remove("active"));


    if (button) {
        button.classList.add("active");
    }


    const content =
        document.getElementById("judgeContent");


    const panels = {

        cases: `

            <h3>
                <i class="fas fa-folder"></i>
                ملفات القضايا
            </h3>

            <p>
                ستظهر هنا ملفات القضايا المرسلة
                وفق الصلاحيات.
            </p>

        `,

        minutes: `

            <h3>
                <i class="fas fa-file-lines"></i>
                محاضر الجلسات
            </h3>

            <p>
                تسجيل محضر الجلسة وإدارته وتصديره.
            </p>

            <button
                class="btn primary"
                onclick="runDiagnostic('pdf')">

                تصدير PDF

            </button>

        `,

        schedule: `

            <h3>
                <i class="fas fa-calendar"></i>
                جدول الجلسات
            </h3>

            <p>
                تنظيم جدول الجلسات القادمة.
            </p>

        `,

        public: `

            <h3>
                <i class="fas fa-bullhorn"></i>
                إعلان الجلسات
            </h3>

            <p>
                تجهيز بيانات الجلسة للنشر العام
                وفق الصلاحيات.
            </p>

        `

    };


    content.innerHTML =
        panels[type] || panels.cases;

}


/* =========================
   الدعم الذكي
========================= */

function runDiagnostic(type) {

    const names = {

        otp: "رمز التحقق OTP",

        pdf: "تصدير PDF",

        voice: "التعرف الصوتي"

    };


    openModal(`

        <div class="auth-header">

            <i class="fas fa-robot"></i>

            <h2>الدعم الذكي</h2>

            <p>
                جاري فحص: ${names[type]}
            </p>

        </div>


        <div class="alert success">

            تم تشغيل الفحص التجريبي بنجاح.

        </div>


        <p style="text-align:center;color:#627d98;">

            هذه النسخة هي واجهة تجريبية.
            الخدمات الفعلية تحتاج إلى Backend.

        </p>


        <button
            class="auth-submit"
            onclick="closeModal()">

            إغلاق

        </button>

    `);

}


/* =========================
   أدوات مساعدة
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeJS(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================
   تحميل الجلسات
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderSessions();

    }
);
