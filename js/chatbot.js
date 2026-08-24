document.addEventListener('DOMContentLoaded', () => {

    const chatButton = document.getElementById('hipaChatButton');
    const chatWindow = document.getElementById('hipaChatWindow');
    const chatClose = document.getElementById('hipaChatClose');
    const chatWrapper = document.querySelector('.hipa-chatbot');

    const input = document.getElementById('hipaChatInput');
    const sendButton = document.getElementById('hipaSendButton');
    const messages = document.getElementById('hipaChatMessages');

    // ==========================================
    // TIL TIZIMI - FAQAT UZ va EN
    // ==========================================
    const HIPA_TRANSLATIONS = {
        uz: {
            title: "HIPA AI Assistant",
            online: "Online",
            greeting: "Assalomu alaykum! 👋<br><br>Men HIPA virtual yordamchisiman. HIPA kurslari va xizmatlari hamda buxgalteriya bo'yicha savollaringizga javob beraman.",
            placeholder: "Savolingizni yozing...",
            demoReply: "Savolingiz qabul qilindi. AI yordamchi backendga ulangandan so'ng sizga batafsil javob beradi."
        },
        en: {
            title: "HIPA AI Assistant",
            online: "Online",
            greeting: "Hello! 👋<br><br>I am HIPA's virtual assistant. I can answer your questions about HIPA courses, services, and accounting.",
            placeholder: "Type your question...",
            demoReply: "Your question has been received. Once the AI assistant is connected to the backend, it will provide a detailed answer."
        }
    };

    function getCurrentLang() {
        // 1. <html lang="en"> dan
        const htmlLang = document.documentElement.lang? document.documentElement.lang.toLowerCase().substring(0,2) : '';
        if (HIPA_TRANSLATIONS[htmlLang]) return htmlLang;

        // 2. URL dan /en
        if (window.location.pathname.toLowerCase().includes('/en') || window.location.search.toLowerCase().includes('lang=en')) {
            return 'en';
        }

        // 3. localStorage dan
        const saved = localStorage.getItem('hipa_lang') || localStorage.getItem('site_lang');
        if (HIPA_TRANSLATIONS[saved]) return saved;

        // 4. Menyu inglizcha bo'lsa - rasmdagi holat uchun
        const menu = document.querySelector('nav')? document.querySelector('nav').innerText : '';
        if (menu.includes('About Us') || menu.includes('Courses')) return 'en';

        return 'uz';
    }

    function updateChatLanguage() {
        const lang = getCurrentLang();
        const t = HIPA_TRANSLATIONS[lang];

        const titleEl = document.querySelector('.hipa-chat-title strong');
        const onlineEl = document.querySelector('.hipa-chat-title span');

        if (titleEl) titleEl.textContent = t.title;
        if (onlineEl) onlineEl.textContent = t.online;
        if (input) input.placeholder = t.placeholder;

        // Birinchi xabarni to'g'irlash
        if (messages) {
            const firstContent = messages.querySelector('.hipa-message-content p');
            if (firstContent && messages.children.length <= 1) {
                firstContent.innerHTML = t.greeting;
            }
        }
    }

    updateChatLanguage();

    // ==========================================
    // CHATNI OCHISH / YOPISH - SIZNI KOD O'SHA
    // ==========================================

    if (chatButton && chatWindow) {
        chatButton.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWrapper) {
                chatWrapper.classList.toggle('active');
            }
            updateChatLanguage();
            if (chatWindow.classList.contains('active') && input) {
                setTimeout(() => input.focus(), 200);
            }
        });
    }

    if (chatClose && chatWindow) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            if (chatWrapper) {
                chatWrapper.classList.remove('active');
            }
        });
    }

    // ==========================================
    // XABAR QO'SHISH - SIZNI KOD O'SHA
    // ==========================================
    function addMessage(text, type) {
        const message = document.createElement('div');

        if (type === 'user') {
            message.className = 'hipa-message';
            message.style.justifyContent = 'flex-end';
            message.innerHTML = `
                <div class="hipa-message-content"
                     style="
                        background: var(--primary-red);
                        color: #fff;
                        border-radius: 14px 4px 14px 14px;
                     ">
                    <p>${escapeHtml(text)}</p>
                </div>
            `;
        } else {
            message.className = 'hipa-message';
            message.innerHTML = `
                <div class="hipa-message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="hipa-message-content">
                    <p>${escapeHtml(text)}</p>
                </div>
            `;
        }

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        const lang = getCurrentLang();
        const replyText = HIPA_TRANSLATIONS[lang].demoReply;

        setTimeout(() => {
            addMessage(replyText, 'bot');
        }, 500);
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (input) {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
