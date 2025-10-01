// ===========================
// FAIR Platform - Interactive Features
// Following UI/UX Principles:
// - User Feedback
// - Hick's Law (simplify choices)
// - User Control & Freedom
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    // === MOBILE MENU TOGGLE ===
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle navigation visibility
            if (mainNav) {
                mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
            }
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (!isExpanded) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    }
    
    // === SEARCH FUNCTIONALITY ===
    const searchInput = document.getElementById('main-search');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Add loading state feedback
        searchInput.addEventListener('input', debounce(function() {
            // In real app: show search suggestions
            console.log('Search query:', this.value);
        }, 300));
    }
    
    function performSearch() {
        const query = searchInput?.value;
        const city = document.querySelector('.search-input-group select')?.value;
        
        if (query && query.trim() !== '') {
            // Provide feedback to user
            showNotification('Выполняется поиск...', 'info');
            
            // In real app: make API call and display results
            setTimeout(() => {
                showNotification(`Найдено объявлений по запросу "${query}"`, 'success');
            }, 1000);
        } else {
            showNotification('Введите поисковый запрос', 'warning');
        }
    }
    
    // === FAVORITE BUTTONS (User Control & Freedom) ===
    const favoriteButtons = document.querySelectorAll('.listing-actions .btn-outline');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            const isFavorited = icon.classList.contains('fas');
            
            if (isFavorited) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                showNotification('Удалено из избранного', 'info');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ef4444';
                showNotification('Добавлено в избранное', 'success');
            }
        });
    });
    
    // === WRITE MESSAGE BUTTONS (Feedback Principle) ===
    const writeButtons = document.querySelectorAll('.listing-actions .btn-primary');
    
    writeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const listingCard = this.closest('.listing-card');
            const listingTitle = listingCard.querySelector('h4')?.textContent;
            const authorName = listingCard.querySelector('.author')?.textContent;
            
            // Provide immediate feedback
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            this.disabled = true;
            
            // Simulate opening chat
            setTimeout(() => {
                openChatModal(listingTitle, authorName);
                this.innerHTML = 'Написать';
                this.disabled = false;
            }, 500);
        });
    });
    
    // === CATEGORY CARDS (Gestalt: Common Fate) ===
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.querySelector('span')?.textContent;
            showNotification(`Загрузка категории: ${categoryName}`, 'info');
            
            // In real app: navigate to category page
            setTimeout(() => {
                showNotification(`Показаны объявления в категории "${categoryName}"`, 'success');
            }, 800);
        });
    });
    
    // === SMOOTH SCROLL FOR NAVIGATION ===
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            }
        });
    });
    
    // === NOTIFICATION SYSTEM (Feedback Principle) ===
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Закрыть уведомление">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            font-size: 1rem;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    // === CHAT MODAL (Progressive Disclosure) ===
    function openChatModal(listingTitle, authorName) {
        // Remove existing modal
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title">Написать ${authorName}</h3>
                    <button class="modal-close" aria-label="Закрыть окно">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-listing-title">Объявление: <strong>${listingTitle}</strong></p>
                    <textarea 
                        placeholder="Здравствуйте! Интересует это объявление..." 
                        rows="5"
                        aria-label="Текст сообщения"
                    ></textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel">Отмена</button>
                    <button class="btn btn-primary modal-send">
                        <i class="fas fa-paper-plane"></i> Отправить
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            position: relative;
            background-color: white;
            border-radius: 0.75rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            animation: scaleIn 0.3s ease-out;
        `;
        
        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        `;
        
        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 1.5rem;
        `;
        
        const textarea = modal.querySelector('textarea');
        textarea.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #d1d5db;
            border-radius: 0.5rem;
            font-family: inherit;
            font-size: 1rem;
            resize: vertical;
            margin-top: 1rem;
        `;
        
        const footer = modal.querySelector('.modal-footer');
        footer.style.cssText = `
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
        `;
        
        document.body.appendChild(modal);
        
        // Focus on textarea
        setTimeout(() => textarea.focus(), 100);
        
        // Close handlers
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Send handler
        modal.querySelector('.modal-send').addEventListener('click', function() {
            const message = textarea.value.trim();
            
            if (message) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                this.disabled = true;
                
                setTimeout(() => {
                    closeModal();
                    showNotification('Сообщение отправлено!', 'success');
                }, 1000);
            } else {
                showNotification('Введите текст сообщения', 'warning');
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    // === UTILITY FUNCTIONS ===
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // === ANIMATIONS CSS (injected dynamically) ===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
            transition: color 0.2s;
        }
        
        .modal-close:hover {
            color: #1f2937;
        }
        
        .modal-listing-title {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
    
    // === INTERSECTION OBSERVER for animations ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards
    document.querySelectorAll('.listing-card, .category-card, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(el);
    });
    
    console.log('FAIR Platform loaded successfully! 🎉');
});
