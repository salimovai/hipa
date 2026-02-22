// ============================================
// HIPA Website - Main JavaScript
// Professional Accounting Education Center
// ============================================

// Configuration - www.hipa.uz (GitHub) + api.hipa.uz (AlwaysData)
const CONFIG = {
    API_BASE_URL: (() => {
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        return 'https://api.hipa.uz/api';
    })()
};

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initLanguageSwitcher();
    initAnimations();
    initCounters();
    initForms();
    initTestimonials();
    initBackToTop();
    initSmoothScroll();
    initDetailModal();
    initTeachersCarousel();
    initCoursesTimeline();
});

// ============================================
// Preloader
// ============================================

function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    });
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ============================================
// Language Switcher
// ============================================

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-uz][data-en]');
    
    // Get saved language or default to 'uz'
    let currentLang = localStorage.getItem('language') || 'uz';
    setLanguage(currentLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
    
    function setLanguage(lang) {
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update content
        translatableElements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else if (el.tagName === 'OPTION') {
                    el.textContent = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Testimonials tilni yangilash
        loadTestimonials();
    }
}

// ============================================
// Animations
// ============================================

function initAnimations() {
    // AOS (Animate On Scroll) initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ============================================
// Counter Animation
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Animation speed
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-count');
                
                animateCounter(counter, target, speed);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    function animateCounter(element, target, duration) {
        let current = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current);
            }
        }, 16);
    }
}

// ============================================
// Forms
// ============================================

function initForms() {
    initContactForm();
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const surnameInput = document.getElementById('contactSurname');
    const phoneInput = document.getElementById('contactPhone');
    const courseSelect = document.getElementById('contactCourse');

    const lang = () => localStorage.getItem('language') || 'uz';

    // Ism/Familiya: faqat harflar (lotin, kirill, o' g' kabi)
    const nameRegex = /^[\p{L}\s'-]*$/u;

    // Telefon: faqat raqamlar, +, bo'shliq, chiziq
    const phoneRegex = /^[\d\s+\-()]*$/;

    // Input cheklovi - Ism
    nameInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        e.target.value = val.replace(/[0-9]/g, '');
    });

    // Input cheklovi - Familiya
    surnameInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        e.target.value = val.replace(/[0-9]/g, '');
    });

    // Input cheklovi - Telefon: faqat raqamlar va + - ( )
    phoneInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        e.target.value = val.replace(/[^\d\s+\-()]/g, '');
    });

    function clearFieldErrors() {
        ['contactNameError', 'contactSurnameError', 'contactPhoneError', 'contactCourseError'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.textContent = ''; el.style.display = 'none'; }
        });
        [nameInput, surnameInput, phoneInput, courseSelect].forEach(el => {
            if (el) el.classList.remove('input-error');
        });
    }

    function showFieldError(fieldId, message) {
        const errEl = document.getElementById(fieldId);
        const inputEl = document.getElementById(fieldId.replace('Error', ''));
        if (errEl) {
            errEl.textContent = message;
            errEl.style.display = 'block';
        }
        if (inputEl) inputEl.classList.add('input-error');
    }

    function validateContactForm() {
        clearFieldErrors();
        let isValid = true;

        const name = (nameInput?.value || '').trim();
        const surname = (surnameInput?.value || '').trim();
        const phone = (phoneInput?.value || '').replace(/\s/g, '');
        const course = courseSelect?.value || '';

        if (!name) {
            const msg = lang() === 'uz' ? 'Ism maydonini to\'ldiring. Faqat harflar kiriting.' : 'Fill in the name. Enter only letters.';
            showFieldError('contactNameError', msg);
            isValid = false;
        } else if (!nameRegex.test(name)) {
            const msg = lang() === 'uz' ? 'Ismda faqat harflar bo\'lishi kerak. Raqam kiritmang.' : 'Name must contain only letters. Do not enter numbers.';
            showFieldError('contactNameError', msg);
            isValid = false;
        } else if (name.length < 2) {
            const msg = lang() === 'uz' ? 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak.' : 'Name must be at least 2 letters.';
            showFieldError('contactNameError', msg);
            isValid = false;
        }

        if (!surname) {
            const msg = lang() === 'uz' ? 'Familiya maydonini to\'ldiring. Faqat harflar kiriting.' : 'Fill in the surname. Enter only letters.';
            showFieldError('contactSurnameError', msg);
            isValid = false;
        } else if (!nameRegex.test(surname)) {
            const msg = lang() === 'uz' ? 'Familiyada faqat harflar bo\'lishi kerak. Raqam kiritmang.' : 'Surname must contain only letters. Do not enter numbers.';
            showFieldError('contactSurnameError', msg);
            isValid = false;
        } else if (surname.length < 2) {
            const msg = lang() === 'uz' ? 'Familiya kamida 2 ta harfdan iborat bo\'lishi kerak.' : 'Surname must be at least 2 letters.';
            showFieldError('contactSurnameError', msg);
            isValid = false;
        }

        if (!phone) {
            const msg = lang() === 'uz' ? 'Telefon raqamini kiriting. Faqat raqamlar.' : 'Enter phone number. Numbers only.';
            showFieldError('contactPhoneError', msg);
            isValid = false;
        } else if (!/^[\d+\-()]+$/.test(phone)) {
            const msg = lang() === 'uz' ? 'Telefon raqamida faqat raqamlar bo\'lishi kerak. Harf kiritmang.' : 'Phone must contain only numbers. Do not enter letters.';
            showFieldError('contactPhoneError', msg);
            isValid = false;
        } else if (phone.replace(/\D/g, '').length < 9) {
            const msg = lang() === 'uz' ? 'Telefon raqami kamida 9 ta raqamdan iborat bo\'lishi kerak.' : 'Phone number must be at least 9 digits.';
            showFieldError('contactPhoneError', msg);
            isValid = false;
        }

        if (!course) {
            const msg = lang() === 'uz' ? 'Kursni tanlang.' : 'Please select a course.';
            showFieldError('contactCourseError', msg);
            isValid = false;
        }

        if (!isValid) {
            const firstInvalid = document.querySelector('.contact-form .input-error');
            if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    }

    // Har bir maydon blur da xatolarni tozalash
    [nameInput, surnameInput, phoneInput].forEach(input => {
        input?.addEventListener('blur', () => {
            const id = input.id + 'Error';
            const errEl = document.getElementById(id);
            if (errEl && input.value.trim()) {
                errEl.textContent = '';
                errEl.style.display = 'none';
                input.classList.remove('input-error');
            }
        });
    });

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateContactForm()) {
            const msg = lang() === 'uz'
                ? 'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring.'
                : 'Please fill in all fields correctly.';
            showNotification(msg, 'error');
            return;
        }

        const name = (nameInput?.value || '').trim();
        const surname = (surnameInput?.value || '').trim();
        const phone = (phoneInput?.value || '').trim();
        const course = courseSelect?.value || '';
        const message = (document.getElementById('contactMessage')?.value || '').trim();

        const data = {
            type: 'contact',
            name,
            surname,
            phone,
            course,
            message,
            timestamp: new Date().toISOString()
        };

        const successMsg = lang() === 'uz'
            ? 'Xabaringiz muvaffaqiyatli yuborildi!'
            : 'Your message has been sent successfully!';

        const errorMsg = lang() === 'uz'
            ? 'Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.'
            : 'An error occurred. Please try again.';

        try {
            showLoader(contactForm);
            await saveToDatabase(data);
            showSuccess(contactForm, successMsg);
            contactForm.reset();
            clearFieldErrors();
        } catch (error) {
            console.error('Error:', error);
            showError(contactForm, errorMsg);
        }
    });
}


// ============================================
// API Integration
// ============================================

async function saveToDatabase(data) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Ma\'lumotlar bazasiga saqlashda xatolik');
        }
        
        return response.json();
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
}

// ============================================
// Testimonials
// ============================================

function initTestimonials() {
    loadTestimonials();
}

function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;
    displayTestimonials(getDefaultTestimonials());
}

function displayTestimonials(reviews) {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    
    if (!testimonialsGrid) return;
    
    const currentLang = localStorage.getItem('language') || 'uz';
    
    testimonialsGrid.innerHTML = reviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const text = currentLang === 'en' && review.textEn ? review.textEn : review.text;
        const position = currentLang === 'en' && review.positionEn ? review.positionEn : review.position;
        const avatarContent = review.photo 
            ? `<img src="${review.photo}" alt="${review.name} ${review.surname}" class="author-avatar-img">`
            : `<span class="author-initials">${review.name.charAt(0)}${review.surname.charAt(0)}</span>`;
        
        return `
            <div class="testimonial-card" data-aos="fade-up">
                <div class="testimonial-rating">${stars}</div>
                <p class="testimonial-text">"${text}"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${avatarContent}</div>
                    <div class="author-info">
                        <h4>${review.name} ${review.surname}</h4>
                        <p>${position}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Reinitialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function getDefaultTestimonials() {
    return [
        {
            name: 'Dilnoza',
            surname: 'Rasulova',
            position: 'Bosh buxgalter',
            positionEn: 'Chief Accountant',
            rating: 5,
            text: 'HIPA da o\'qish mening hayotimni butunlay o\'zgartirdi. Professional ustozlar va amaliy darslar tufayli men hozir yirik kompaniyada bosh buxgalter bo\'lib ishlayman. Har bir dars real ish tajribasiga asoslangan edi!',
            textEn: 'Studying at HIPA completely changed my life. Thanks to professional teachers and practical lessons, I now work as a chief accountant at a major company. Every lesson was based on real work experience!',
            photo: 'assets/dilnoza.png'
        },
        {
            name: 'Azizbek',
            surname: 'Karimov',
            position: 'Moliyaviy Tahlilchi',
            positionEn: 'Financial Analyst',
            rating: 5,
            text: 'O\'qishni tugatganimdan keyin HIPA menga professional kompaniyada ish topishda yordam berdi. Endi men nafaqat buxgalteriya balki moliyaviy tahlil bo\'yicha ham mutaxassisman. Rahmat HIPA jamoasiga!',
            textEn: 'After graduation, HIPA helped me find a job at a professional company. Now I am a specialist not only in accounting but also in financial analysis. Thank you to the HIPA team!',
            photo: 'assets/aziz.png'
        },
        {
            name: 'Madina',
            surname: 'Yo‘ldosheva',
            position: 'Tadbirkor',
            positionEn: 'Entrepreneur',
            rating: 5,
            text: 'HIPA ning eng katta afzalligi - bu zamonaviy yondashuv va amaliy bilimlar. Men hech qachon o\'ylamas edimki, 3 oyda buncha ko\'p narsa o\'rganib olaman. Hozir o\'z biznesimni yuritaman va moliyaviy jihatdan mustaqilman!',
            textEn: 'The biggest advantage of HIPA is its modern approach and practical knowledge. I never thought I could learn so much in 3 months. Now I run my own business and am financially independent!',
            photo: 'assets/madina.png'
        },
        {
            name: 'Muhammadali',
            surname: 'Ismoilov',
            position: 'Audit Mutaxassisi',
            positionEn: 'Audit Specialist',
            rating: 5,
            text: 'Xalqaro standartlar bo\'yicha o\'quv dasturlari va professional ustozlar HIPA ning asosiy kuchli tomonlari. Men bu yerda nafaqat nazariy bilim, balki real amaliy ko\'nikmalar ham oldim.',
            textEn: 'Training programs based on international standards and professional teachers are HIPA\'s main strengths. Here I gained not only theoretical knowledge but also real practical skills.',
            photo: 'assets/ali.png'
        },
        {
            name: 'Shahnoza',
            surname: 'Qodirova',
            position: 'Buxgalter',
            positionEn: 'Accountant',
            rating: 5,
            text: '1C dasturini professional darajada o\'rganish imkoniyati uchun HIPA ga minnatdorman. Hozir men istalgan kompaniyada ishlay olaman va o\'z bilimlarimga ishonaman!',
            textEn: 'I am grateful to HIPA for the opportunity to learn the 1C program at a professional level. Now I can work in any company and I am confident in my knowledge!',
            photo: 'assets/shahnoza.png'
        },
        {
            name: 'Jasur',
            surname: 'Tursunov',
            position: 'Moliya Direktori',
            positionEn: 'Finance Director',
            rating: 5,
            text: 'HIPA da olgan chuqur bilimlar menga moliya direktorligacha ko\'tarilishga yordam berdi. Bu yerda o\'qituvchilar nafaqat bilim beradi, balki real biznes tajribasini ham ulashadi.',
            textEn: 'The in-depth knowledge I gained at HIPA helped me rise to the position of finance director. Here teachers not only share knowledge but also real business experience.',
            photo: 'assets/jasur.png'
        }
    ];
}

// ============================================
// UI Helpers
// ============================================

function showLoader(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const lang = localStorage.getItem('language') || 'uz';

    const loadingText = lang === 'uz'
        ? 'Yuborilmoqda...'
        : 'Sending...';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            `<i class="fas fa-spinner fa-spin"></i> <span>${loadingText}</span>`;
    }
}

function showSuccess(form, message) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const lang = localStorage.getItem('language') || 'uz';

    const successText = lang === 'uz'
        ? 'Yuborildi!'
        : 'Sent!';

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
            `<i class="fas fa-check"></i> <span>${successText}</span>`;
        submitBtn.style.background = 'var(--success)';

        setTimeout(() => {
            resetButton(submitBtn);
        }, 3000);
    }

    showNotification(message, 'success');
}

function showError(form, message) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        resetButton(submitBtn);
    }
    
    showNotification(message, 'error');
}

function resetButton(btn) {
    const currentLang = localStorage.getItem('language') || 'uz';
    const text = currentLang === 'uz' ? 'Yuborish' : 'Send';
    btn.innerHTML = `<i class="fas fa-paper-plane"></i> <span>${text}</span>`;
    btn.style.background = '';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// Teachers Carousel
// ============================================

function initTeachersCarousel() {
    const carousel = document.getElementById('teachersCarousel');
    if (!carousel) return;

    // Clone teachers for seamless infinite loop
    const teachers = carousel.querySelectorAll('.teacher-card');
    if (teachers.length === 0) return;

    // Clone all teacher cards to create seamless loop (8 teachers = 16 total)
    teachers.forEach(teacher => {
        const clone = teacher.cloneNode(true);
        carousel.appendChild(clone);
    });

    // Ensure smooth infinite scrolling
    const totalWidth = carousel.scrollWidth / 2; // Half because we cloned
    
    // Animation will automatically loop due to CSS keyframes
}

// ============================================
// Courses Timeline
// ============================================

function initCoursesTimeline() {
    const courses = document.querySelectorAll('.timeline-course');
    const expandButtons = document.querySelectorAll('.btn-course-expand');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    courses.forEach(course => {
        observer.observe(course);
    });

    // Expand/Collapse functionality
    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = btn.getAttribute('data-course');
            const details = document.getElementById(`course-details-${courseId}`);
            
            if (details) {
                const isActive = details.classList.contains('active');
                
                // Close all other details
                document.querySelectorAll('.course-details-premium').forEach(detail => {
                    detail.classList.remove('active');
                });
                document.querySelectorAll('.btn-course-expand').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Toggle current
                if (!isActive) {
                    details.classList.add('active');
                    btn.classList.add('active');
                }
            }
        });
    });
}

// ============================================
// Detail Modal (Batafsil)
// ============================================

function initDetailModal() {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const batafsilButtons = document.querySelectorAll('[data-modal]');

    function openModal(contentId) {
        const contentEl = document.getElementById(contentId);
        if (!contentEl || !modal || !modalBody) return;

        const currentLang = localStorage.getItem('language') || 'uz';
        const titleEl = contentEl.querySelector('h3');
        const textEl = contentEl.querySelector('p');

        let title = '';
        if (titleEl) {
            const titleAttr = titleEl.getAttribute(`data-${currentLang}`);
            title = titleAttr || titleEl.textContent || '';
        }
        let text = '';
        if (textEl) {
            const fullAttr = textEl.getAttribute(`data-${currentLang}-full`);
            text = fullAttr || textEl.textContent || '';
        }

        modalBody.innerHTML = `
            <h3>${title}</h3>
            <p>${text}</p>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    batafsilButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contentId = btn.getAttribute('data-modal');
            if (contentId) openModal(contentId);
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
    });
}

// ============================================
// Back to Top Button
// ============================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Animation Styles (to be added via <style> tag or CSS)
// ============================================

const animationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);