// Global variables
let currentUser = null;
let currentBookId = null;
let allBooks = [];
let filteredBooks = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    // Load books data
    allBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    
    // Route to appropriate page functionality
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    switch(page) {
        case 'index.html':
        case '':
            if (currentUser) {
                window.location.href = 'dashboard.html';
            }
            initLoginPage();
            break;
        case 'signup.html':
            if (currentUser) {
                window.location.href = 'dashboard.html';
            }
            initSignupPage();
            break;
        case 'dashboard.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            }
            initDashboard();
            break;
        case 'books.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            }
            initBooksPage();
            break;
        case 'borrowed.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            }
            initBorrowedPage();
            break;
        case 'profile.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            }
            initProfilePage();
            break;
    }
});

// Login Page Functions
function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('libraryUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        showError('Invalid email or password');
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Signup Page Functions
function initSignupPage() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', handleSignup);
    }
    
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const membershipId = document.getElementById('membershipId').value;
    
    // Validation
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('libraryUsers')) || [];
    
    // Check if email or membership ID already exists
    if (users.some(u => u.email === email)) {
        showError('Email already registered');
        return;
    }
    
    if (users.some(u => u.membershipId === membershipId)) {
        showError('Membership ID already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password,
        membershipId,
        joinDate: new Date().toISOString().split('T')[0],
        borrowedBooks: [],
        readingHistory: []
    };
    
    users.push(newUser);
    localStorage.setItem('libraryUsers', JSON.stringify(users));
    
    // Auto-login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'dashboard.html';
}

function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!strengthIndicator) return;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    strengthIndicator.className = 'password-strength';
    if (strength < 3) {
        strengthIndicator.classList.add('weak');
    } else if (strength < 5) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }
}

// Dashboard Functions
function initDashboard() {
    updateUserInfo();
    updateDashboardStats();
    loadRecentActivity();
}

function updateUserInfo() {
    const userNameEl = document.getElementById('userName');
    const memberIdEl = document.getElementById('memberId');
    
    if (userNameEl && currentUser) {
        userNameEl.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    if (memberIdEl && currentUser) {
        memberIdEl.textContent = currentUser.membershipId;
    }
}

function updateDashboardStats() {
    if (!currentUser) return;
    
    const borrowedCountEl = document.getElementById('borrowedCount');
    const overdueCountEl = document.getElementById('overdueCount');
    
    if (borrowedCountEl) {
        borrowedCountEl.textContent = currentUser.borrowedBooks.length;
    }
    
    if (overdueCountEl) {
        const overdue = currentUser.borrowedBooks.filter(book => {
            const dueDate = new Date(book.dueDate);
            return dueDate < new Date();
        }).length;
        overdueCountEl.textContent = overdue;
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList || !currentUser) return;
    
    // Create mock recent activity
    const activities = [
        {
            type: 'borrowed',
            text: 'Borrowed "To Kill a Mockingbird"',
            time: '2 hours ago',
            icon: 'fas fa-book'
        },
        {
            type: 'returned',
            text: 'Returned "1984"',
            time: '1 day ago',
            icon: 'fas fa-undo'
        }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon activity-${activity.type}">
                <i class="${activity.icon}"></i>
            </div>
            <span class="activity-text">${activity.text}</span>
            <span class="activity-time">${activity.time}</span>
        </div>
    `).join('');
}

// Books Page Functions
function initBooksPage() {
    loadBooks();
    setupSearch();
    setupFilters();
}

function loadBooks() {
    allBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    filteredBooks = [...allBooks];
    displayBooks();
}

function displayBooks() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;
    
    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = '<div class="empty-state"><h3>No books found</h3><p>Try adjusting your search or filters</p></div>';
        return;
    }
    
    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-image">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <p class="book-genre">${book.genre} • ${book.year}</p>
                <div class="book-status">
                    <span class="status-badge ${book.available ? 'status-available' : 'status-unavailable'}">
                        ${book.available ? 'Available' : 'Unavailable'}
                    </span>
                    <span>${book.availableCopies}/${book.totalCopies} copies</span>
                </div>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterBooks, 300));
    }
}

function setupFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    if (genreFilter) {
        genreFilter.addEventListener('change', filterBooks);
    }
    
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', filterBooks);
    }
}

function filterBooks() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const genreFilter = document.getElementById('genreFilter')?.value || '';
    const availabilityFilter = document.getElementById('availabilityFilter')?.value || '';
    
    filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        const matchesGenre = !genreFilter || book.genre === genreFilter;
        const matchesAvailability = !availabilityFilter || 
                                   (availabilityFilter === 'available' && book.available);
        
        return matchesSearch && matchesGenre && matchesAvailability;
    });
    
    displayBooks();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Modal Functions
function openBookModal(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;
    
    currentBookId = bookId;
    
    document.getElementById('modalTitle').textContent = book.title;
    document.getElementById('modalAuthor').textContent = book.author;
    document.getElementById('modalGenre').textContent = book.genre;
    document.getElementById('modalYear').textContent = book.year;
    document.getElementById('modalCopies').textContent = `${book.availableCopies}/${book.totalCopies}`;
    document.getElementById('modalStatus').textContent = book.available ? 'Available' : 'Unavailable';
    document.getElementById('modalDescription').textContent = book.description;
    
    const borrowBtn = document.getElementById('borrowBtn');
    if (book.available && !isBookAlreadyBorrowed(bookId)) {
        borrowBtn.style.display = 'inline-block';
        borrowBtn.textContent = 'Borrow Book';
    } else if (isBookAlreadyBorrowed(bookId)) {
        borrowBtn.style.display = 'inline-block';
        borrowBtn.textContent = 'Already Borrowed';
        borrowBtn.disabled = true;
    } else {
        borrowBtn.style.display = 'none';
    }
    
    document.getElementById('bookModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
    currentBookId = null;
}

function isBookAlreadyBorrowed(bookId) {
    return currentUser.borrowedBooks.some(book => book.id === bookId);
}

function borrowBook() {
    if (!currentBookId || !currentUser) return;
    
    const book = allBooks.find(b => b.id === currentBookId);
    if (!book || !book.available) return;
    
    // Update book availability
    book.availableCopies--;
    if (book.availableCopies === 0) {
        book.available = false;
    }
    
    // Add to user's borrowed books
    const borrowedDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks
    
    const borrowedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        borrowedDate: borrowedDate.toISOString(),
        dueDate: dueDate.toISOString()
    };
    
    currentUser.borrowedBooks.push(borrowedBook);
    
    // Update localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(allBooks));
    
    const users = JSON.parse(localStorage.getItem('libraryUsers'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('libraryUsers', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal();
    displayBooks();
    showSuccess(`Successfully borrowed "${book.title}". Due date: ${dueDate.toLocaleDateString()}`);
}

// Borrowed Books Page Functions
function initBorrowedPage() {
    updateBorrowedSummary();
    loadBorrowedBooks();
}

function updateBorrowedSummary() {
    if (!currentUser) return;
    
    const totalBorrowedEl = document.getElementById('totalBorrowed');
    const totalOverdueEl = document.getElementById('totalOverdue');
    const totalDueSoonEl = document.getElementById('totalDueSoon');
    
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    let overdue = 0;
    let dueSoon = 0;
    
    currentUser.borrowedBooks.forEach(book => {
        const dueDate = new Date(book.dueDate);
        if (dueDate < now) {
            overdue++;
        } else if (dueDate <= threeDaysFromNow) {
            dueSoon++;
        }
    });
    
    if (totalBorrowedEl) totalBorrowedEl.textContent = currentUser.borrowedBooks.length;
    if (totalOverdueEl) totalOverdueEl.textContent = overdue;
    if (totalDueSoonEl) totalDueSoonEl.textContent = dueSoon;
}

function loadBorrowedBooks() {
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    const emptyState = document.getElementById('emptyState');
    
    if (!currentUser || !borrowedBooksList) return;
    
    if (currentUser.borrowedBooks.length === 0) {
        borrowedBooksList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    borrowedBooksList.style.display = 'block';
    
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    borrowedBooksList.innerHTML = currentUser.borrowedBooks.map(book => {
        const dueDate = new Date(book.dueDate);
        const borrowedDate = new Date(book.borrowedDate);
        
        let dueDateClass = '';
        if (dueDate < now) {
            dueDateClass = 'overdue';
        } else if (dueDate <= threeDaysFromNow) {
            dueDateClass = 'due-soon';
        }
        
        return `
            <div class="borrowed-book-item">
                <div class="book-image">
                    <i class="fas fa-book"></i>
                </div>
                <div class="borrowed-book-info">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p>Genre: ${book.genre}</p>
                    <p>Borrowed: ${borrowedDate.toLocaleDateString()}</p>
                    <p class="due-date ${dueDateClass}">Due: ${dueDate.toLocaleDateString()}</p>
                </div>
                <button class="btn-primary" onclick="returnBook(${book.id})">
                    <i class="fas fa-undo"></i>
                    Return Book
                </button>
            </div>
        `;
    }).join('');
}

function returnBook(bookId) {
    if (!currentUser) return;
    
    // Remove from borrowed books
    const bookIndex = currentUser.borrowedBooks.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;
    
    const returnedBook = currentUser.borrowedBooks.splice(bookIndex, 1)[0];
    
    // Update book availability
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
        book.availableCopies++;
        book.available = true;
    }
    
    // Add to reading history
    const historyEntry = {
        ...returnedBook,
        returnedDate: new Date().toISOString()
    };
    
    if (!currentUser.readingHistory) {
        currentUser.readingHistory = [];
    }
    currentUser.readingHistory.push(historyEntry);
    
    // Update localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(allBooks));
    
    const users = JSON.parse(localStorage.getItem('libraryUsers'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('libraryUsers', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Refresh displays
    updateBorrowedSummary();
    loadBorrowedBooks();
    showSuccess(`Successfully returned "${returnedBook.title}"`);
}

// Profile Page Functions
function initProfilePage() {
    loadProfileData();
    updateProfileStats();
    
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', handleProfileUpdate);
    }
}

function loadProfileData() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profileMemberId').textContent = currentUser.membershipId;
    document.getElementById('editFirstName').value = currentUser.firstName;
    document.getElementById('editLastName').value = currentUser.lastName;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('displayMemberId').value = currentUser.membershipId;
}

function updateProfileStats() {
    if (!currentUser) return;
    
    const totalBooksReadEl = document.getElementById('totalBooksRead');
    const currentlyBorrowedEl = document.getElementById('currentlyBorrowed');
    const memberSinceEl = document.getElementById('memberSince');
    
    if (totalBooksReadEl) {
        const totalRead = (currentUser.readingHistory || []).length;
        totalBooksReadEl.textContent = totalRead;
    }
    
    if (currentlyBorrowedEl) {
        currentlyBorrowedEl.textContent = currentUser.borrowedBooks.length;
    }
    
    if (memberSinceEl) {
        const joinYear = new Date(currentUser.joinDate).getFullYear();
        memberSinceEl.textContent = joinYear;
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const email = document.getElementById('editEmail').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate email uniqueness (except for current user)
    const users = JSON.parse(localStorage.getItem('libraryUsers'));
    if (users.some(u => u.email === email && u.id !== currentUser.id)) {
        showError('Email already in use by another account');
        return;
    }
    
    // Update basic info
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.email = email;
    
    // Handle password change if provided
    if (currentPassword || newPassword) {
        if (currentPassword !== currentUser.password) {
            showError('Current password is incorrect');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showError('New passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            showError('New password must be at least 6 characters long');
            return;
        }
        
        currentUser.password = newPassword;
    }
    
    // Update localStorage
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('libraryUsers', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Refresh display
    loadProfileData();
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    
    showSuccess('Profile updated successfully!');
}

function cancelEdit() {
    loadProfileData();
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

// Utility Functions
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    // Create a temporary success message element
    const successEl = document.createElement('div');
    successEl.className = 'success-message';
    successEl.textContent = message;
    successEl.style.position = 'fixed';
    successEl.style.top = '20px';
    successEl.style.right = '20px';
    successEl.style.zIndex = '9999';
    successEl.style.maxWidth = '300px';
    
    document.body.appendChild(successEl);
    
    setTimeout(() => {
        document.body.removeChild(successEl);
    }, 3000);
}

function toggleMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('mobile-active');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookModal');
    if (event.target === modal) {
        closeModal();
    }
};