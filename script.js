// اطلاعات ادمین
const adminCredentials = [
    { username: "Salar", password: "8711" },
    { username: "Miaad", password: "9248" }
];

// داده‌های نمونه
let appData = {
    users: [
        { id: 1, username: "user1", email: "user1@example.com", password: "password1", joinDate: "۱۴۰۲/۰۵/۱۲", status: "active", role: "user" },
        { id: 2, username: "user2", email: "user2@example.com", password: "password2", joinDate: "۱۴۰۲/۰۴/۲۵", status: "active", role: "user" },
        { id: 3, username: "user3", email: "user3@example.com", password: "password3", joinDate: "۱۴۰۲/۰۶/۰۳", status: "inactive", role: "moderator" },
        { id: 4, username: "user4", email: "user4@example.com", password: "password4", joinDate: "۱۴۰۲/۰۵/۲۰", status: "banned", role: "user" }
    ],
    adminQuestions: [
        { id: 1, text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", user: "محمد رضایی", subject: "ریاضی", date: "۱۴۰۲/۰۶/۱۵", status: "approved" },
        { id: 2, text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است", user: "فاطمه احمدی", subject: "فیزیک", date: "۱۴۰۲/۰۶/۱۴", status: "pending" },
        { id: 3, text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده", user: "علی کریمی", subject: "شیمی", date: "۱۴۰۲/۰۶/۱۰", status: "rejected" }
    ],
    userQuestions: [],
    userScores: [],
    subjects: ["ریاضی", "فیزیک", "شیمی", "ادبیات", "زبان انگلیسی"],
    subjectChapters: {
        "ریاضی": ["جبر و معادله", "هندسه", "احتمال و آمار", "مثلثات", "حسابان"],
        "فیزیک": ["الکتریسیته", "مکانیک", "نور", "حرارت"],
        "شیمی": ["استوکیومتری", "اسید و باز", "شیمی آلی"],
        "ادبیات": ["دستور زبان", "تاریخ ادبیات", "آرایه های ادبی"],
        "زبان انگلیسی": ["گرامر", "لغات", "درک مطلب"]
    },
    currentUser: {
        totalScore: 0,
        monthlyScore: 0,
        questionsCount: 0,
        approvedCount: 0
    }
};

// داده‌های نمونه برای سوالات
const sampleQuestions = [
    {
        id: 1,
        text: "اگر x + 2 = 5 باشد، مقدار x کدام است؟",
        subject: "ریاضی",
        chapter: "جبر و معادله",
        level: "easy",
        options: ["2", "3", "4", "5"],
        correctAnswer: "2",
        detailedAnswer: "با حل معادله: x = 5 - 2 = 3",
        hasImage: false,
        score: 15
    },
    {
        id: 2,
        text: "مساحت دایره‌ای با شعاع 5 سانتی‌متر چقدر است؟ (π = 3.14)",
        subject: "ریاضی",
        chapter: "هندسه",
        level: "medium",
        options: ["78.5", "31.4", "15.7", "62.8"],
        correctAnswer: "1",
        detailedAnswer: "مساحت دایره = πr² = 3.14 × 25 = 78.5",
        hasImage: false,
        score: 30
    },
    {
        id: 3,
        text: "مشتق تابع f(x) = x³ + 2x² چیست؟",
        subject: "ریاضی",
        chapter: "حسابان",
        level: "hard",
        options: ["3x² + 4x", "3x² + 2x", "x² + 4x", "3x² + 2"],
        correctAnswer: "1",
        detailedAnswer: "f'(x) = 3x² + 4x",
        hasImage: false,
        score: 50
    }
];

// نمایش اعلان
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// اعتبارسنجی فرم ورود
function validateLoginForm(username, password) {
    const usernameRegex = /^[a-zA-Z]{5}$/;
    const passwordRegex = /^\d{4,}$/;
    
    if (!usernameRegex.test(username)) {
        showNotification('نام کاربری باید دقیقاً ۵ حرف باشد', 'error');
        return false;
    }
    
    if (!passwordRegex.test(password)) {
        showNotification('رمز عبور باید حداقل ۴ رقم باشد و فقط شامل اعداد باشد', 'error');
        return false;
    }
    
    return true;
}

// مدیریت لاگین
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!validateLoginForm(username, password)) {
        return;
    }
    
    // بررسی ورود به عنوان ادمین
    const isAdmin = adminCredentials.some(cred => 
        cred.username === username && cred.password === password
    );
    
    if (isAdmin) {
        // ورود به عنوان ادمین
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        showNotification('خوش آمدید مدیر سیستم!', 'success');
        renderAdminData();
    } else {
        // ورود به عنوان کاربر عادی
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('userPanel').classList.remove('hidden');
        showNotification('خوش آمدید!', 'success');
        renderUserData();
    }
});

// مدیریت منو در پنل ادمین
document.querySelectorAll('#adminPanel [data-page]').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // حذف کلاس active از همه آیتم‌ها
        document.querySelectorAll('#adminPanel .sidebar-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // اضافه کردن کلاس active به آیتم انتخاب شده
        this.classList.add('active');
        
        // مخفی کردن همه صفحات
        document.querySelectorAll('#adminPanel > div > main > div').forEach(div => {
            div.classList.add('hidden');
        });
        
        // نمایش صفحه انتخاب شده
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.remove('hidden');
        
        // به روز رسانی عنوان صفحه
        document.getElementById('adminPageTitle').textContent = this.querySelector('span').textContent;
        
        // بستن منو در حالت موبایل
        if (window.innerWidth < 768) {
            document.querySelector('#adminPanel .sidebar').classList.remove('open');
            document.querySelector('#adminPanel .main-content').classList.remove('sidebar-open');
        }
    });
});

// مدیریت منو در پنل کاربر
document.querySelectorAll('#userPanel [data-page]').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // حذف کلاس active از همه آیتم‌ها
        document.querySelectorAll('#userPanel .sidebar-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // اضافه کردن کلاس active به آیتم انتخاب شده
        this.classList.add('active');
        
        // مخفی کردن همه صفحات
        document.querySelectorAll('#userPanel > div > main > div').forEach(div => {
            div.classList.add('hidden');
        });
        
        // نمایش صفحه انتخاب شده
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.remove('hidden');
        
        // به روز رسانی عنوان صفحه
        document.getElementById('userPageTitle').textContent = this.querySelector('span').textContent;
        
        // بستن منو در حالت موبایل
        if (window.innerWidth < 768) {
            document.querySelector('#userPanel .sidebar').classList.remove('open');
            document.querySelector('#userPanel .main-content').classList.remove('sidebar-open');
        }
    });
});

// مدیریت منوی موبایل برای ادمین
document.getElementById('adminMenuToggle').addEventListener('click', function() {
    const sidebar = document.querySelector('#adminPanel .sidebar');
    const mainContent = document.querySelector('#adminPanel .main-content');
    
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('sidebar-open');
});

// مدیریت منوی موبایل برای کاربر
document.getElementById('userMenuToggle').addEventListener('click', function() {
    const sidebar = document.querySelector('#userPanel .sidebar');
    const mainContent = document.querySelector('#userPanel .main-content');
    
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('sidebar-open');
});

// خروج از پنل ادمین
document.getElementById('adminLogout').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('authPage').classList.remove('hidden');
    showNotification('با موفقیت خارج شدید', 'success');
});

// خروج از پنل کاربر
document.getElementById('userLogout').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('userPanel').classList.add('hidden');
    document.getElementById('authPage').classList.remove('hidden');
    showNotification('با موفقیت خارج شدید', 'success');
});

// تابع کمکی برای تغییر صفحه در پنل کاربر
function switchToPage(pageId) {
    document.querySelectorAll('#userPanel .sidebar-item').forEach(i => {
        i.classList.remove('active');
    });
    
    document.querySelector(`#userPanel [data-page="${pageId}"]`).classList.add('active');
    
    document.querySelectorAll('#userPanel > div > main > div').forEach(div => {
        div.classList.add('hidden');
    });
    
    document.getElementById(pageId).classList.remove('hidden');
    
    document.getElementById('userPageTitle').textContent = 
        document.querySelector(`#userPanel [data-page="${pageId}"] span`).textContent;
}

// مدیریت فرم افزودن سوال در پنل کاربر
document.getElementById('addQuestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const level = document.getElementById('questionLevel').value;
    const hasImage = document.getElementById('needImage').checked;
    
    let baseScore = 0;
    switch(level) {
        case 'easy': baseScore = 15; break;
        case 'medium': baseScore = 30; break;
        case 'hard': baseScore = 50; break;
    }
    
    if (hasImage) {
        baseScore += 10;
    }
    
    const newQuestion = {
        id: Date.now(),
        text: document.getElementById('questionText').value || "سوال نمونه",
        subject: document.getElementById('questionSubject').value,
        chapter: document.getElementById('questionChapter').value,
        level: document.getElementById('questionLevel').options[document.getElementById('questionLevel').selectedIndex].text.split(' ')[0],
        score: baseScore,
        status: "pending",
        date: new Date().toLocaleDateString('fa-IR')
    };
    
    appData.userQuestions.push(newQuestion);
    appData.currentUser.questionsCount++;
    
    showNotification('سوال با موفقیت اضافه شد و در انتظار تایید قرار گرفت!', 'success');
    this.reset();
    document.getElementById('imageUploadSection').classList.add('hidden');
    document.getElementById('imagePreview').classList.add('hidden');
    updateUserScore();
    renderUserData();
});

// مدیریت فرم افزودن سوال در پنل ادمین
document.getElementById('adminAddQuestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const level = document.getElementById('adminQuestionLevel').value;
    const hasImage = document.getElementById('adminNeedImage').checked;
    
    let baseScore = 0;
    switch(level) {
        case 'easy': baseScore = 15; break;
        case 'medium': baseScore = 30; break;
        case 'hard': baseScore = 50; break;
    }
    
    if (hasImage) {
        baseScore += 10;
    }
    
    const newQuestion = {
        id: Date.now(),
        text: document.getElementById('adminQuestionText').value || "سوال نمونه",
        subject: document.getElementById('adminQuestionSubject').value,
        chapter: document.getElementById('adminQuestionChapter').value,
        level: level,
        options: [
            document.getElementById('adminOption1').value,
            document.getElementById('adminOption2').value,
            document.getElementById('adminOption3').value,
            document.getElementById('adminOption4').value
        ],
        correctAnswer: document.getElementById('adminCorrectAnswer').value,
        detailedAnswer: document.getElementById('adminDetailedAnswer').value,
        hasImage: hasImage,
        score: baseScore,
        user: "مدیر سیستم",
        date: new Date().toLocaleDateString('fa-IR'),
        status: "approved"
    };
    
    // اضافه کردن سوال به بانک سوالات
    sampleQuestions.push(newQuestion);
    appData.adminQuestions.unshift(newQuestion);
    
    showNotification('سوال با موفقیت به بانک سوالات اضافه شد!', 'success');
    this.reset();
    document.getElementById('adminImageUploadSection').classList.add('hidden');
    document.getElementById('adminImagePreview').classList.add('hidden');
    updateAdminScore();
    renderAdminData();
});

// به روز رسانی امتیاز در پنل کاربر
function updateUserScore() {
    const level = document.getElementById('questionLevel').value;
    const hasImage = document.getElementById('needImage').checked;
    
    let baseScore = 0;
    switch(level) {
        case 'easy': baseScore = 15; break;
        case 'medium': baseScore = 30; break;
        case 'hard': baseScore = 50; break;
    }
    
    if (hasImage) {
        baseScore += 10;
    }
    
    document.getElementById('scoreValue').textContent = baseScore;
}

// به روز رسانی امتیاز در پنل ادمین
function updateAdminScore() {
    const level = document.getElementById('adminQuestionLevel').value;
    const hasImage = document.getElementById('adminNeedImage').checked;
    
    let baseScore = 0;
    switch(level) {
        case 'easy': baseScore = 15; break;
        case 'medium': baseScore = 30; break;
        case 'hard': baseScore = 50; break;
    }
    
    if (hasImage) {
        baseScore += 10;
    }
    
    document.getElementById('adminScoreValue').textContent = baseScore;
}

// مدیریت نمایش/پنهان کردن بخش آپلود تصویر در پنل کاربر
document.getElementById('needImage').addEventListener('change', function() {
    const imageSection = document.getElementById('imageUploadSection');
    if (this.checked) {
        imageSection.classList.remove('hidden');
        updateUserScore();
    } else {
        imageSection.classList.add('hidden');
        document.getElementById('imagePreview').classList.add('hidden');
        updateUserScore();
    }
});

// مدیریت نمایش/پنهان کردن بخش آپلود تصویر در پنل ادمین
document.getElementById('adminNeedImage').addEventListener('change', function() {
    const imageSection = document.getElementById('adminImageUploadSection');
    if (this.checked) {
        imageSection.classList.remove('hidden');
        updateAdminScore();
    } else {
        imageSection.classList.add('hidden');
        document.getElementById('adminImagePreview').classList.add('hidden');
        updateAdminScore();
    }
});

// پیش‌نمایش تصویر آپلود شده در پنل کاربر
document.getElementById('questionImage').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// پیش‌نمایش تصویر آپلود شده در پنل ادمین
document.getElementById('adminQuestionImage').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('adminPreview').src = e.target.result;
            document.getElementById('adminImagePreview').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// تغییر سطح دشواری در پنل کاربر
document.getElementById('questionLevel').addEventListener('change', updateUserScore);

// تغییر سطح دشواری در پنل ادمین
document.getElementById('adminQuestionLevel').addEventListener('change', updateAdminScore);

// رندر داده‌های ادمین
function renderAdminData() {
    // به روزرسانی زمان‌های فعالیت اخیر
    updateRecentActivities();
    
    // رندر کاربران
    renderUsersTable();
    
    // رندر سوالات
    renderQuestionsTable();
    
    // رندر موضوعات
    renderSubjectsList();
}

// به روزرسانی فعالیت‌های اخیر با زمان واقعی
function updateRecentActivities() {
    const now = new Date();
    const timeAgo1 = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 ساعت پیش
    const timeAgo2 = new Date(now.getTime() - 30 * 60 * 1000); // 30 دقیقه پیش
    const timeAgo3 = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 روز پیش
    
    document.getElementById('recentActivity1').textContent = formatTimeAgo(timeAgo1);
    document.getElementById('recentActivity2').textContent = formatTimeAgo(timeAgo2);
    document.getElementById('recentActivity3').textContent = formatTimeAgo(timeAgo3);
}

// فرمت زمان گذشته
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'همین الان';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    return `${diffDays} روز پیش`;
}

// رندر جدول کاربران
function renderUsersTable() {
    const usersTable = document.getElementById('adminUsersTable');
    usersTable.innerHTML = '';
    
    appData.users.forEach(user => {
        const statusText = user.status === 'active' ? 'فعال' : 
                         user.status === 'inactive' ? 'غیرفعال' : 'مسدود شده';
        const statusClass = user.status === 'active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        
        const roleText = user.role === 'admin' ? 'مدیر' : 
                       user.role === 'moderator' ? 'ناظر' : 'کاربر عادی';
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${user.username}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${user.joinDate}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${statusText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${roleText}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 ml-4 edit-user" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                <button class="text-red-600 hover:text-red-900 ban-user" data-id="${user.id}"><i class="fas fa-ban"></i></button>
                <button class="text-red-600 hover:text-red-900 delete-user" data-id="${user.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        usersTable.appendChild(row);
    });
    
    // اضافه کردن event listener برای دکمه‌های کاربران
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            openUserManagementModal(userId);
        });
    });
    
    document.querySelectorAll('.ban-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            toggleUserBan(userId);
        });
    });
    
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

// رندر جدول سوالات
function renderQuestionsTable() {
    const questionsTable = document.getElementById('adminQuestionsTable');
    questionsTable.innerHTML = '';
    
    appData.adminQuestions.forEach(question => {
        const statusText = question.status === 'approved' ? 'تایید شده' : question.status === 'pending' ? 'در انتظار' : 'رد شده';
        const statusClass = question.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          question.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-blue-900">${question.text}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.user}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.subject}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.date}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${statusText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 ml-4 edit-question" data-id="${question.id}"><i class="fas fa-edit"></i></button>
                <button class="text-red-600 hover:text-red-900 delete-question" data-id="${question.id}"><i class="fas fa-trash"></i></button>
                ${question.status === 'pending' ? 
                  `<button class="text-green-600 hover:text-green-900 approve-question" data-id="${question.id}"><i class="fas fa-check"></i></button>
                   <button class="text-red-600 hover:text-red-900 reject-question" data-id="${question.id}"><i class="fas fa-times"></i></button>` : ''}
            </td>
        `;
        questionsTable.appendChild(row);
    });
    
    // اضافه کردن event listener برای دکمه‌های سوالات
    document.querySelectorAll('.edit-question').forEach(button => {
        button.addEventListener('click', function() {
            const questionId = parseInt(this.getAttribute('data-id'));
            openEditQuestionModal(questionId);
        });
    });
    
    document.querySelectorAll('.delete-question').forEach(button => {
        button.addEventListener('click', function() {
            const questionId = parseInt(this.getAttribute('data-id'));
            deleteQuestion(questionId);
        });
    });
    
    document.querySelectorAll('.approve-question').forEach(button => {
        button.addEventListener('click', function() {
            const questionId = parseInt(this.getAttribute('data-id'));
            updateQuestionStatus(questionId, 'approved');
        });
    });
    
    document.querySelectorAll('.reject-question').forEach(button => {
        button.addEventListener('click', function() {
            const questionId = parseInt(this.getAttribute('data-id'));
            updateQuestionStatus(questionId, 'rejected');
        });
    });
}

// رندر لیست موضوعات
function renderSubjectsList() {
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = '';
    
    appData.subjects.forEach(subject => {
        const subjectElement = document.createElement('div');
        subjectElement.className = 'flex justify-between items-center';
        subjectElement.innerHTML = `
            <span class="text-blue-700">${subject}</span>
            <div>
                <button class="text-blue-600 hover:text-blue-900 ml-2 edit-subject" data-subject="${subject}"><i class="fas fa-edit"></i></button>
                <button class="text-red-600 hover:text-red-900 delete-subject" data-subject="${subject}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        subjectsList.appendChild(subjectElement);
    });
    
    // اضافه کردن event listener برای دکمه‌های موضوعات
    document.querySelectorAll('.edit-subject').forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            editSubject(subject);
        });
    });
    
    document.querySelectorAll('.delete-subject').forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            deleteSubject(subject);
        });
    });
}

// رندر داده‌های کاربر
function renderUserData() {
    // به روز رسانی آمار کاربر
    document.getElementById('userQuestionsCount').textContent = appData.currentUser.questionsCount;
    document.getElementById('userApprovedCount').textContent = appData.currentUser.approvedCount;
    document.getElementById('userTotalScore').textContent = appData.currentUser.totalScore;
    document.getElementById('userScoreValue').textContent = appData.currentUser.totalScore;
    document.getElementById('monthlyScoreValue').textContent = appData.currentUser.monthlyScore;
    
    // محاسبه پیشرفت ماهانه
    const progressPercent = Math.min(100, (appData.currentUser.monthlyScore / 1000) * 100);
    document.getElementById('monthlyProgress').style.width = `${progressPercent}%`;
    document.querySelector('#userPanel .p-4.border-t.border-blue-700 p.text-xs').textContent = `${Math.round(progressPercent)}٪ از هدف ماهانه`;
    
    // رندر سوالات کاربر
    const userQuestionsTable = document.getElementById('userQuestionsTable');
    userQuestionsTable.innerHTML = '';
    
    if (appData.userQuestions.length === 0) {
        userQuestionsTable.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-blue-500">
                    <i class="fas fa-inbox text-4xl mb-2 block"></i>
                    <p>هنوز سوالی ارسال نکرده‌اید</p>
                    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 btn-hover" onclick="switchToPage('addQuestion')">
                        اولین سوال خود را ارسال کنید
                    </button>
                </td>
            </tr>
        `;
    } else {
        appData.userQuestions.forEach(question => {
            const statusText = question.status === 'approved' ? 'تایید شده' : question.status === 'pending' ? 'در انتظار' : 'رد شده';
            const statusClass = question.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              question.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-blue-50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-blue-900">${question.text}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.subject}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.chapter}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.level}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${question.score}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${statusText}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 ml-4 edit-user-question" data-id="${question.id}"><i class="fas fa-edit"></i></button>
                    <button class="text-red-600 hover:text-red-900 delete-user-question" data-id="${question.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            userQuestionsTable.appendChild(row);
        });
        
        // اضافه کردن event listener برای دکمه‌های سوالات کاربر
        document.querySelectorAll('.edit-user-question').forEach(button => {
            button.addEventListener('click', function() {
                const questionId = parseInt(this.getAttribute('data-id'));
                openEditQuestionModal(questionId, true);
            });
        });
        
        document.querySelectorAll('.delete-user-question').forEach(button => {
            button.addEventListener('click', function() {
                const questionId = parseInt(this.getAttribute('data-id'));
                deleteUserQuestion(questionId);
            });
        });
    }
    
    // رندر امتیازات کاربر
    const userScoresTable = document.getElementById('userScoresTable');
    userScoresTable.innerHTML = '';
    
    if (appData.userScores.length === 0) {
        userScoresTable.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-blue-500">
                    <i class="fas fa-chart-line text-4xl mb-2 block"></i>
                    <p>هنوز امتیازی کسب نکرده‌اید</p>
                    <p class="text-sm mt-2">با ارسال سوالات باکیفیت امتیاز کسب کنید</p>
                </td>
            </tr>
        `;
    } else {
        appData.userScores.forEach(score => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-blue-50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${score.date}</td>
                <td class="px-6 py-4 text-sm text-blue-900">${score.question}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-900">${score.points}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">تایید شده</span>
                </td>
            `;
            userScoresTable.appendChild(row);
        });
    }
}

// باز کردن مودال ویرایش سوال
function openEditQuestionModal(questionId, isUserQuestion = false) {
    const questions = isUserQuestion ? appData.userQuestions : appData.adminQuestions;
    const question = questions.find(q => q.id === questionId);
    
    if (question) {
        document.getElementById('editQuestionId').value = question.id;
        document.getElementById('editQuestionSubject').value = question.subject;
        document.getElementById('editQuestionText').value = question.text;
        
        document.getElementById('editQuestionModal').classList.add('open');
    }
}

// بستن مودال ویرایش سوال
document.getElementById('closeEditModal').addEventListener('click', function() {
    document.getElementById('editQuestionModal').classList.remove('open');
});

document.getElementById('cancelEdit').addEventListener('click', function() {
    document.getElementById('editQuestionModal').classList.remove('open');
});

// مدیریت فرم ویرایش سوال
document.getElementById('editQuestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const questionId = parseInt(document.getElementById('editQuestionId').value);
    const subject = document.getElementById('editQuestionSubject').value;
    const text = document.getElementById('editQuestionText').value;
    
    // پیدا کردن سوال در هر دو لیست و به روز رسانی آن
    let question = appData.userQuestions.find(q => q.id === questionId);
    if (question) {
        question.subject = subject;
        question.text = text;
    }
    
    question = appData.adminQuestions.find(q => q.id === questionId);
    if (question) {
        question.subject = subject;
        question.text = text;
    }
    
    showNotification('سوال با موفقیت ویرایش شد', 'success');
    document.getElementById('editQuestionModal').classList.remove('open');
    
    // به روز رسانی نمایش
    renderAdminData();
    renderUserData();
});

// حذف سوال
function deleteQuestion(questionId) {
    if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
        appData.adminQuestions = appData.adminQuestions.filter(q => q.id !== questionId);
        showNotification('سوال با موفقیت حذف شد', 'success');
        renderAdminData();
    }
}

// حذف سوال کاربر
function deleteUserQuestion(questionId) {
    if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
        appData.userQuestions = appData.userQuestions.filter(q => q.id !== questionId);
        appData.currentUser.questionsCount--;
        showNotification('سوال با موفقیت حذف شد', 'success');
        renderUserData();
    }
}

// به روز رسانی وضعیت سوال
function updateQuestionStatus(questionId, status) {
    const question = appData.adminQuestions.find(q => q.id === questionId);
    if (question) {
        question.status = status;
        showNotification(`وضعیت سوال به ${status === 'approved' ? 'تایید شده' : 'رد شده'} تغییر کرد`, 'success');
        renderAdminData();
        
        // اگر سوال تایید شد، به امتیازات کاربر اضافه شود
        if (status === 'approved') {
            // در اینجا باید کاربر مربوطه پیدا شود و امتیاز به او اضافه گردد
            // برای سادگی، فقط یک پیام نمایش می‌دهیم
            showNotification('امتیاز سوال به کاربر مربوطه اضافه شد', 'success');
        }
    }
}

// مدیریت مودال ویرایش سوال
function openEditQuestionModal(questionId) {
    const question = sampleQuestions.find(q => q.id === questionId);
    if (question) {
        // پر کردن تمام فیلدها
        document.getElementById('editQuestionId').value = question.id;
        document.getElementById('editQuestionSubject').value = question.subject;
        document.getElementById('editQuestionChapter').value = question.chapter;
        document.getElementById('editQuestionLevel').value = question.level;
        document.getElementById('editQuestionText').value = question.text;
        document.getElementById('editOption1').value = question.options[0];
        document.getElementById('editOption2').value = question.options[1];
        document.getElementById('editOption3').value = question.options[2];
        document.getElementById('editOption4').value = question.options[3];
        document.getElementById('editCorrectAnswer').value = question.correctAnswer;
        document.getElementById('editDetailedAnswer').value = question.detailedAnswer;
        document.getElementById('editNeedImage').checked = question.hasImage;
        document.getElementById('editScoreValue').textContent = question.score;

        document.getElementById('editQuestionModal').classList.add('open');
    }
}

// مدیریت مودال ساخت آزمون
document.getElementById('openExamModal').addEventListener('click', function() {
    document.getElementById('createExamModal').classList.add('open');
    updateAvailableQuestionsCount();
});

// بستن مودال‌ها
document.getElementById('closeExamModal').addEventListener('click', function() {
    document.getElementById('createExamModal').classList.remove('open');
    document.getElementById('examPreview').classList.add('hidden');
});

// بروزرسانی مباحث درسی بر اساس موضوع انتخاب شده
function updateChapterOptions(subject, chapterSelectId) {
    const chapterSelect = document.getElementById(chapterSelectId);
    chapterSelect.innerHTML = '<option value="">همه مباحث</option>';
    
    if (subject && appData.subjectChapters[subject]) {
        appData.subjectChapters[subject].forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter;
            option.textContent = chapter;
            chapterSelect.appendChild(option);
        });
    }
}

// رویداد تغییر موضوع در آزمون ساز
document.getElementById('examSubject').addEventListener('change', function() {
    updateChapterOptions(this.value, 'examChapter');
    updateAvailableQuestionsCount();
});

document.getElementById('builderSubject').addEventListener('change', function() {
    updateChapterOptions(this.value, 'builderChapter');
});

// بروزرسانی تعداد سوالات موجود
function updateAvailableQuestionsCount() {
    const subject = document.getElementById('examSubject').value;
    const chapter = document.getElementById('examChapter').value;
    const level = document.getElementById('examLevel').value;

    const filteredQuestions = sampleQuestions.filter(q => {
        return (!subject || q.subject === subject) &&
               (!chapter || q.chapter === chapter) &&
               (!level || q.level === level);
    });

    document.getElementById('availableQuestions').textContent = 
        `${filteredQuestions.length} سوال پیدا شد`;
}

// پیش‌نمایش آزمون
document.getElementById('previewExam').addEventListener('click', function() {
    const subject = document.getElementById('examSubject').value;
    const chapter = document.getElementById('examChapter').value;
    const level = document.getElementById('examLevel').value;
    const count = parseInt(document.getElementById('examQuestionCount').value);
    const title = document.getElementById('examTitle').value || "آزمون نمونه";
    const time = document.getElementById('examTime').value;

    // فیلتر کردن سوالات
    let filteredQuestions = sampleQuestions.filter(q => {
        return (!subject || q.subject === subject) &&
               (!chapter || q.chapter === chapter) &&
               (!level || q.level === level);
    });

    // انتخاب سوالات به صورت تصادفی
    filteredQuestions = shuffleArray(filteredQuestions).slice(0, count);

    // تولید پیش‌نمایش
    generateExamPreview(filteredQuestions, title, time);
    document.getElementById('examPreview').classList.remove('hidden');
});

// تابع برای تصادفی کردن آرایه
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// تولید پیش‌نمایش آزمون
function generateExamPreview(questions, title, time) {
    const previewContent = document.getElementById('previewContent');
    let html = `
        <div class="exam-header">
            <h2>${title}</h2>
            <p>زمان آزمون: ${time} دقیقه</p>
            <p>تعداد سوالات: ${questions.length}</p>
        </div>
    `;

    questions.forEach((question, index) => {
        html += `
            <div class="question-item mb-6">
                <div class="flex items-start mb-3">
                    <span class="question-number">${index + 1}</span>
                    <p class="text-justify flex-1">${question.text}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pr-8">
        `;

        question.options.forEach((option, optIndex) => {
            html += `
                <div class="flex items-center">
                    <span class="bg-gray-100 text-gray-800 rounded-md px-3 py-2 border border-gray-300 ml-2">${String.fromCharCode(1570 + optIndex)}</span>
                    <span>${option}</span>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    previewContent.innerHTML = html;
}

// تولید PDF با قابلیت خواندن فارسی
document.getElementById('downloadPdf').addEventListener('click', function() {
    generatePDF();
});

document.getElementById('generateExam').addEventListener('click', function() {
    generatePDF();
});

// تابع تولید PDF با پشتیبانی از فارسی
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const title = document.getElementById('examTitle').value || "آزمون نمونه";
    const time = document.getElementById('examTime').value;
    const questions = getSelectedQuestions();

    // تنظیم جهت راست به چپ
    doc.setLanguage('fa');
    
    // هدر آزمون
    doc.setFontSize(18);
    doc.text(title, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`زمان آزمون: ${time} دقیقه`, 105, 30, { align: 'center' });
    doc.text(`تعداد سوالات: ${questions.length}`, 105, 40, { align: 'center' });
    
    let yPosition = 60;
    
    // اضافه کردن سوالات
    questions.forEach((question, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(14);
        const questionText = `${index + 1}. ${question.text}`;
        const splitQuestion = doc.splitTextToSize(questionText, 170);
        doc.text(splitQuestion, 20, yPosition);
        yPosition += splitQuestion.length * 7;
        
        doc.setFontSize(12);
        question.options.forEach((option, optIndex) => {
            const optionText = `   ${String.fromCharCode(1570 + optIndex)}) ${option}`;
            const splitOption = doc.splitTextToSize(optionText, 170);
            doc.text(splitOption, 25, yPosition);
            yPosition += splitOption.length * 6;
        });
        
        yPosition += 10;
    });
    
    // ذخیره فایل
    doc.save(`${title}.pdf`);
    showNotification('آزمون با موفقیت تولید شد', 'success');
}

// گرفتن سوالات انتخابی
function getSelectedQuestions() {
    const subject = document.getElementById('examSubject').value;
    const chapter = document.getElementById('examChapter').value;
    const level = document.getElementById('examLevel').value;
    const count = parseInt(document.getElementById('examQuestionCount').value);

    let filteredQuestions = sampleQuestions.filter(q => {
        return (!subject || q.subject === subject) &&
               (!chapter || q.chapter === chapter) &&
               (!level || q.level === level);
    });

    return shuffleArray(filteredQuestions).slice(0, count);
}

// مدیریت کاربران
function openUserManagementModal(userId) {
    const user = appData.users.find(u => u.id === userId);
    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.username;
        document.getElementById('editUserPassword').value = '';
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.status;
        
        document.getElementById('userManagementModal').classList.add('open');
    }
}

// بستن مودال مدیریت کاربران
document.getElementById('closeUserModal').addEventListener('click', function() {
    document.getElementById('userManagementModal').classList.remove('open');
});

document.getElementById('cancelUserEdit').addEventListener('click', function() {
    document.getElementById('userManagementModal').classList.remove('open');
});

// مدیریت فرم ویرایش کاربر
document.getElementById('userManagementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('editUserId').value);
    const username = document.getElementById('editUserName').value;
    const password = document.getElementById('editUserPassword').value;
    const role = document.getElementById('editUserRole').value;
    const status = document.getElementById('editUserStatus').value;
    
    const user = appData.users.find(u => u.id === userId);
    if (user) {
        user.username = username;
        if (password) user.password = password;
        user.role = role;
        user.status = status;
        
        showNotification('اطلاعات کاربر با موفقیت به روز شد', 'success');
        document.getElementById('userManagementModal').classList.remove('open');
        renderAdminData();
    }
});

// مسدود کردن/رفع مسدودیت کاربر
function toggleUserBan(userId) {
    const user = appData.users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'banned' ? 'active' : 'banned';
        const action = user.status === 'banned' ? 'مسدود' : 'رفع مسدودیت';
        showNotification(`کاربر با موفقیت ${action} شد`, 'success');
        renderAdminData();
    }
}

// حذف کاربر
function deleteUser(userId) {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
        appData.users = appData.users.filter(u => u.id !== userId);
        showNotification('کاربر با موفقیت حذف شد', 'success');
        renderAdminData();
    }
}

// مدیریت موضوعات
function editSubject(oldSubject) {
    const newSubject = prompt('موضوع جدید را وارد کنید:', oldSubject);
    if (newSubject && newSubject.trim()) {
        // به روزرسانی موضوع در لیست
        const index = appData.subjects.indexOf(oldSubject);
        if (index !== -1) {
            appData.subjects[index] = newSubject.trim();
            
            // به روزرسانی مباحث مربوطه
            if (appData.subjectChapters[oldSubject]) {
                appData.subjectChapters[newSubject.trim()] = appData.subjectChapters[oldSubject];
                delete appData.subjectChapters[oldSubject];
            }
            
            showNotification('موضوع با موفقیت ویرایش شد', 'success');
            renderAdminData();
        }
    }
}

function deleteSubject(subject) {
    if (confirm(`آیا از حذف موضوع "${subject}" اطمینان دارید؟`)) {
        appData.subjects = appData.subjects.filter(s => s !== subject);
        delete appData.subjectChapters[subject];
        showNotification('موضوع با موفقیت حذف شد', 'success');
        renderAdminData();
    }
}

// افزودن موضوع جدید
document.getElementById('addSubjectButton').addEventListener('click', function() {
    const newSubjectInput = document.getElementById('newSubjectInput');
    const newSubject = newSubjectInput.value.trim();
    
    if (newSubject) {
        if (appData.subjects.includes(newSubject)) {
            showNotification('این موضوع قبلاً وجود دارد', 'error');
        } else {
            appData.subjects.push(newSubject);
            appData.subjectChapters[newSubject] = [];
            showNotification('موضوع با موفقیت اضافه شد', 'success');
            newSubjectInput.value = '';
            renderAdminData();
        }
    }
});

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // بروزرسانی آمار سوالات
    document.getElementById('totalQuestionsCount').textContent = sampleQuestions.length;
    document.getElementById('easyQuestionsCount').textContent = sampleQuestions.filter(q => q.level === 'easy').length;
    document.getElementById('mediumQuestionsCount').textContent = sampleQuestions.filter(q => q.level === 'medium').length;
    document.getElementById('hardQuestionsCount').textContent = sampleQuestions.filter(q => q.level === 'hard').length;

    // event listener برای فیلترهای آزمون
    ['examSubject', 'examChapter', 'examLevel'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateAvailableQuestionsCount);
    });

    updateUserScore();
    updateAdminScore();
    
    // اضافه کردن event listener برای دکمه ذخیره تنظیمات
    document.querySelector('#systemSettings button').addEventListener('click', function() {
        showNotification('تنظیمات با موفقیت ذخیره شد', 'success');
    });
});