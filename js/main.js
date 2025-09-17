// Navdha Bhakti - Main JavaScript File
// Dynamic behavior and interactivity for the devotional website

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Calendar functionality
    initializeCalendar();
    
    // Fade in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.festival-card, .video-card, .update-item, .team-member').forEach(el => {
        observer.observe(el);
    });
    
    // Update current date and time
    updateCurrentDate();
    setInterval(updateCurrentDate, 60000); // Update every minute
    
    // Festival countdown timer
    initializeFestivalCountdown();
    
    // Video lazy loading
    initializeVideoLazyLoading();
    
    // Search functionality
    initializeSearch();
    
    // Theme toggle (if implemented)
    initializeThemeToggle();
    
    // Social media sharing
    initializeSocialSharing();
});

// Calendar Functions
function initializeCalendar() {
    const calendarContainer = document.querySelector('.calendar-grid');
    const monthYearElement = document.getElementById('calendar-month-year');
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (!calendarContainer) return;
    
    let currentDate = new Date();
    
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update month/year display
        if (monthYearElement) {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            monthYearElement.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear existing calendar days (keep headers)
        const existingDays = calendarContainer.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarContainer.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Highlight today
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Add festival markers (sample data)
            if (isFestivalDay(year, month, day)) {
                dayElement.classList.add('festival');
                dayElement.title = getFestivalName(year, month, day);
            }
            
            calendarContainer.appendChild(dayElement);
        }
    }
    
    // Navigation event listeners
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Initial render
    renderCalendar(currentDate);
}

// Festival data (sample)
function isFestivalDay(year, month, day) {
    const festivals = {
        '2024-9-18': 'Anant Chaturdashi',
        '2024-10-2': 'Gandhi Jayanti',
        '2024-10-15': 'Navratri Begins',
        '2024-10-24': 'Dussehra',
        '2024-11-12': 'Diwali'
    };
    
    const dateKey = `${year}-${month + 1}-${day}`;
    return festivals.hasOwnProperty(dateKey);
}

function getFestivalName(year, month, day) {
    const festivals = {
        '2024-9-18': 'Anant Chaturdashi',
        '2024-10-2': 'Gandhi Jayanti',
        '2024-10-15': 'Navratri Begins',
        '2024-10-24': 'Dussehra',
        '2024-11-12': 'Diwali'
    };
    
    const dateKey = `${year}-${month + 1}-${day}`;
    return festivals[dateKey] || '';
}

// Update current date display
function updateCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const hindiDateElement = document.getElementById('hindi-date');
    
    if (currentDateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    if (hindiDateElement) {
        // Sample Hindi date - in a real implementation, this would be calculated
        const hindiMonths = [
            'Chaitra', 'Vaisakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
            'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
        ];
        const currentMonth = hindiMonths[new Date().getMonth()];
        hindiDateElement.textContent = `${currentMonth} Shukla Paksha`;
    }
}

// Festival countdown timer
function initializeFestivalCountdown() {
    const countdownElements = document.querySelectorAll('.festival-countdown');
    
    countdownElements.forEach(element => {
        const targetDate = new Date(element.dataset.date);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                
                element.innerHTML = `${days}d ${hours}h ${minutes}m`;
            } else {
                element.innerHTML = 'Festival Started!';
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    });
}

// Video lazy loading
function initializeVideoLazyLoading() {
    const videoCards = document.querySelectorAll('.video-card iframe');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                }
                videoObserver.unobserve(iframe);
            }
        });
    });
    
    videoCards.forEach(iframe => {
        if (iframe.src) {
            iframe.dataset.src = iframe.src;
            iframe.src = '';
        }
        videoObserver.observe(iframe);
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
            if (searchResults) searchResults.style.display = 'none';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    function performSearch(query) {
        // Sample search implementation
        const searchableContent = [
            { title: 'Diwali Festival', url: 'festivals.html#diwali', type: 'Festival' },
            { title: 'Hanuman Chalisa', url: 'videos.html#bhajans', type: 'Video' },
            { title: 'Hindi Calendar', url: 'calendar.html', type: 'Calendar' },
            { title: 'About Us', url: 'about.html', type: 'Page' }
        ];
        
        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        
        if (searchResults) {
            if (results.length > 0) {
                searchResults.innerHTML = results.map(result => 
                    `<div class="search-result">
                        <a href="${result.url}">
                            <span class="result-title">${result.title}</span>
                            <span class="result-type">${result.type}</span>
                        </a>
                    </div>`
                ).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="no-results">No results found</div>';
                searchResults.style.display = 'block';
            }
        }
    }
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
            if (searchResults) searchResults.style.display = 'none';
        }
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button text/icon
        this.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
}

// Social media sharing
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent('Check out this devotional content from Navdha Bhakti');
            
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time for performance monitoring
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
