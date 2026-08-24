document.addEventListener('DOMContentLoaded', () => {

    const chatButton = document.getElementById('hipaChatButton');
    const chatWindow = document.getElementById('hipaChatWindow');
    const chatClose = document.getElementById('hipaChatClose');
    const chatWrapper = document.querySelector('.hipa-chatbot');

    const input = document.getElementById('hipaChatInput');
    const sendButton = document.getElementById('hipaSendButton');
    const messages = document.getElementById('hipaChatMessages');

    // ==========================================
    // 1. TIL TIZIMI - YANGI QO'SHILDI
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
        },
        ru: {
            title: "HIPA AI Assistant",
            online: "В сети",
            greeting: "Здравствуйте! 👋<br><br>Я виртуальный помощник HIPA. Я отвечу на ваши вопросы о курсах, услугах HIPA и бухгалтерии.",
            placeholder: "Напишите ваш вопрос...",
            demoReply: "Ваш вопрос принят. После подключения AI-помощника к бэкенду вы получите подробный ответ."
        }
    };

    function getCurrentLang() {
        const htmlLang = document.documentElement.lang?.toLowerCase().slice(0,2);
        if (htmlLang && HIPA_TRANSLATIONS[htmlLang]) return htmlLang;

        const path = window.location.pathname.toLowerCase();
        if (path.includes('/en')) return 'en';
        if (path.includes('/ru')) return 'ru';
        if (path.includes('/uz')) return 'uz';

        const urlLang = new URLSearchParams(window.location.search).get('lang');
        if (urlLang && HIPA_TRANSLATIONS[urlLang]) return urlLang;

        const savedLang = localStorage.getItem('hipa_lang') || localStorage.getItem('site_lang');
        if (savedLang && HIPA_TRANSLATIONS[savedLang]) return savedLang;

        // Sayt ingliz tilida turganini aniqlash uchun - rasmdagi muammo uchun eng muhimi
        const navText = document.body.innerText;
        if (navText.includes('About Us') && navText.includes('Courses')) return 'en';

        return 'uz';
    }

    function getT() {
        const lang = getCurrentLang();
        return HIPA_TRANSLATIONS[lang] || HIPA_TRANSLATIONS.uz;
    }

    function updateChatLanguage() {
        const t = getT();
        const titleEl = document.querySelector('.hipa-chat-title strong');
        const onlineEl = document.querySelector('.hipa-chat-title span');

        if (titleEl) titleEl.textContent = t.title;
        if (onlineEl) onlineEl.textContent = t.online;
        if (input) input.placeholder = t.placeholder;

        // Birinchi greeting xabarni ham tilga moslash (faqat birinchi marta)
        const firstBotMessage = messages?.querySelector('.hipa-message.hipa-message-content p');
        if (firstBotMessage && messages.children.length === 1) {
            firstBotMessage.innerHTML = t.greeting;
        }
    }

    // Boshlang'ich tilni sozlash
    updateChatLanguage();

    // ==========================================
    // 2. CHATNI OCHISH / YOPISH - YAXSHILANGAN
    // ==========================================

    // Chatni ochish
    chatButton.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        chatWrapper?.classList.toggle('active'); // CSS to'lqin to'xtashi uchun
        chatWrapper?.classList.toggle('wave-paused', chatWindow.classList.contains('active'));

        updateChatLanguage(); // Har ochilganda tilni tekshir

        if (chatWindow.classList.contains('active')) {
            setTimeout(() => input.focus(), 250);
        }
    });

    // Chatni yopish
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatWrapper?.classList.remove('active', 'wave-paused');
    });

    // ==========================================
    // 3. XABAR QO'SHISH - ASOSAN O'SHA, LEKIN XAVFSIZROQ
    // ==========================================

    function addMessage(text, type, isHtml = false) {
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
                    <p>${isHtml? text : escapeHtml(text)}</p>
                </div>
            `;
        }

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    // ==========================================
    // 4. XABAR YUBORISH - TILGA MOS JAVOB
    // ==========================================

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        const lang = getCurrentLang();
        const t = getT();

        addMessage(text, 'user');
        input.value = '';

        // Backendga yuborish uchun tilni ham qo'shib yuborish kerak bo'ladi
        // fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: text, lang: lang }) })

        setTimeout(() => {
            addMessage(t.demoReply, 'bot');
        }, 600);
    }

    sendButton.addEventListener('click', sendMessage);

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // ==========================================
    // 5. XSS HIMOYASI - O'SHA HOLICHA
    // ==========================================

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Tashqi hodisa: saytda til o'zgarsa chatbot ham o'zgarsin
    window.addEventListener('languageChanged', updateChatLanguage);
    // Ba'zi saytlarda localStorage orqali til o'zgaradi, shuni kuzatish
    window.addEventListener('storage', updateChatLanguage);
});
