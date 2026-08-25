document.addEventListener('DOMContentLoaded', () => {

    const chatButton = document.getElementById('hipaChatButton');
    const chatWindow = document.getElementById('hipaChatWindow');
    const chatClose = document.getElementById('hipaChatClose');
    const chatWrapper = document.querySelector('.hipa-chatbot');

    const input = document.getElementById('hipaChatInput');
    const sendButton = document.getElementById('hipaSendButton');
    const messages = document.getElementById('hipaChatMessages');

    // ==========================================
    // HIPA CHATBOT TRANSLATIONS
    // ==========================================

    const HIPA_TRANSLATIONS = {

        uz: {
            title: "HIPA AI Assistant",
            online: "Online",

            greeting: `
                <p>Assalomu alaykum! 👋</p>
                <p>
                    Men HIPA virtual yordamchisiman.
                    HIPA kurslari va xizmatlari hamda
                    buxgalteriya bo‘yicha savollaringizga
                    javob beraman.
                </p>
            `,

            placeholder: "Savolingizni yozing...",

            demoReply:
                "Savolingiz qabul qilindi. AI yordamchi backendga ulangandan so‘ng sizga batafsil javob beradi."
        },

        en: {
            title: "HIPA AI Assistant",
            online: "Online",

            greeting: `
                <p>Hello! 👋</p>
                <p>
                    I’m HIPA’s virtual assistant.
                    I can answer your questions about
                    HIPA courses, services and accounting.
                </p>
            `,

            placeholder: "Type your question...",

            demoReply:
                "Your question has been received. Once the AI assistant is connected to the backend, it will provide a detailed answer."
        }
    };


    // ==========================================
    // SAYTNING HOZIRGI TILINI ANIQLASH
    // ==========================================

    function getCurrentLang() {

        // 1. Faol til tugmasini tekshiramiz
        const activeLangButton = document.querySelector('.lang-btn.active');

        if (activeLangButton) {

            const buttonLang =
                activeLangButton.getAttribute('data-lang');

            if (buttonLang === 'uz' || buttonLang === 'en') {
                return buttonLang;
            }
        }


        // 2. localStorage
        const savedLanguage =
            localStorage.getItem('language');

        if (savedLanguage === 'uz' || savedLanguage === 'en') {
            return savedLanguage;
        }


        // 3. HTML lang
        const htmlLang =
            (document.documentElement.lang || '')
            .toLowerCase()
            .substring(0, 2);

        if (htmlLang === 'uz' || htmlLang === 'en') {
            return htmlLang;
        }


        // 4. Sayt menyusidagi matnni tekshirish
        const navText =
            document.querySelector('.nav-menu')?.innerText || '';

        if (
            navText.includes('About Us') ||
            navText.includes('Courses') ||
            navText.includes('Contact')
        ) {
            return 'en';
        }


        // Default
        return 'uz';
    }


    // ==========================================
    // CHATBOT TILINI YANGILASH
    // ==========================================

    function updateChatLanguage() {

        const lang = getCurrentLang();
        const translation = HIPA_TRANSLATIONS[lang];

        // Header
        const title =
            document.querySelector('.hipa-chat-title strong');

        const online =
            document.querySelector('.hipa-chat-title span');

        if (title) {
            title.textContent = translation.title;
        }

        if (online) {
            online.textContent = translation.online;
        }


        // Input
        if (input) {
            input.placeholder = translation.placeholder;
        }


        // Birinchi bot xabarini TO‘LIQ almashtiramiz
        if (messages) {

            const firstMessage =
                messages.querySelector('.hipa-bot-message');

            if (firstMessage && messages.children.length === 1) {

                const content =
                    firstMessage.querySelector(
                        '.hipa-message-content'
                    );

                if (content) {
                    content.innerHTML =
                        translation.greeting;
                }
            }
        }
    }


    // Dastlabki tilni o‘rnatish
    updateChatLanguage();


    // ==========================================
    // CHATNI OCHISH
    // ==========================================

    if (chatButton && chatWindow) {

        chatButton.addEventListener('click', () => {

            chatWindow.classList.toggle('active');

            if (chatWrapper) {
                chatWrapper.classList.toggle('active');
            }

            updateChatLanguage();

            if (
                chatWindow.classList.contains('active') &&
                input
            ) {
                setTimeout(() => {
                    input.focus();
                }, 200);
            }
        });
    }


    // ==========================================
    // CHATNI YOPISH
    // ==========================================

    if (chatClose && chatWindow) {

        chatClose.addEventListener('click', () => {

            chatWindow.classList.remove('active');

            if (chatWrapper) {
                chatWrapper.classList.remove('active');
            }
        });
    }


    // ==========================================
    // XABAR QO‘SHISH
    // ==========================================

    function addMessage(text, type) {

        const message =
            document.createElement('div');


        if (type === 'user') {

            message.className = 'hipa-message';

            message.style.justifyContent = 'flex-end';

            message.innerHTML = `
                <div
                    class="hipa-message-content"
                    style="
                        background: var(--primary-red);
                        color: #fff;
                        border-radius:
                        14px 4px 14px 14px;
                    "
                >
                    <p>${escapeHtml(text)}</p>
                </div>
            `;

        } else {

            message.className =
                'hipa-message hipa-bot-message';

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

        messages.scrollTop =
            messages.scrollHeight;
    }


    // ==========================================
    // XABAR YUBORISH
    // ==========================================
    // ==========================================
// CHATBOT BACKEND
// ==========================================

const API_BASE_URL =
    'https://hipa-backend-tj22.onrender.com/api';


// Chat tarixi
const chatHistory = [];


// ==========================================
// XABAR YUBORISH
// ==========================================

async function sendMessage() {

    const text =
        input.value.trim();

    if (!text) return;


    // Hozirgi sayt tili
    const lang =
        getCurrentLang();


    // User xabarini ko‘rsatish
    addMessage(text, 'user');

    input.value = '';


    // Loading xabar
    addMessage(
        lang === 'uz'
            ? 'Javob tayyorlanmoqda...'
            : 'Preparing an answer...',
        'bot'
    );


    // Loading xabarini topish
    const loadingMessage =
        messages.lastElementChild;


    try {

        // Backendga yuborish
        const response =
            await fetch(
                `${API_BASE_URL}/chat`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        message: text,

                        language: lang,

                        history: chatHistory

                    })
                }
            );


        // HTTP xatosini tekshirish
        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        // JSON javob
        const data =
            await response.json();


        // Backend xatosi
        if (!data.success) {

            throw new Error(
                data.error ||
                'Backend error'
            );

        }


        // AI javobi
        const reply =
            data.reply ||
            (
                lang === 'uz'
                    ? 'Kechirasiz, javob olishda xatolik yuz berdi.'
                    : 'Sorry, an error occurred while getting the answer.'
            );


        // Loading xabarini o‘chirish
        if (loadingMessage) {
            loadingMessage.remove();
        }


        // AI javobini chiqarish
        addMessage(
            reply,
            'bot'
        );


        // Chat tarixiga user xabarini qo‘shish
        chatHistory.push({
            role: 'user',
            content: text
        });


        // Chat tarixiga AI javobini qo‘shish
        chatHistory.push({
            role: 'assistant',
            content: reply
        });


        // Juda katta history bo‘lib ketmasin
        if (chatHistory.length > 20) {

            chatHistory.splice(
                0,
                chatHistory.length - 20
            );

        }

    } catch (error) {

        console.error(
            'HIPA Chatbot Error:',
            error
        );


        // Loading xabarini o‘chirish
        if (loadingMessage) {
            loadingMessage.remove();
        }


        // Foydalanuvchiga xato
        addMessage(
            lang === 'uz'
                ? 'Kechirasiz, hozircha AI yordamchiga ulanishda muammo yuz berdi. Iltimos, birozdan keyin qayta urinib ko‘ring.'
                : 'Sorry, there was a problem connecting to the AI assistant. Please try again later.',
            'bot'
        );

    }
}
    // Send tugmasi
    if (sendButton) {

        sendButton.addEventListener(
            'click',
            sendMessage
        );
    }


    // Enter
    if (input) {

        input.addEventListener(
            'keydown',
            (event) => {

                if (event.key === 'Enter') {
                    sendMessage();
                }
            }
        );
    }


    // ==========================================
    // SAYT TILI ALMASHGANDA CHATBOT HAM ALMASHADI
    // ==========================================

    const languageButtons =
        document.querySelectorAll('.lang-btn');


    languageButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                // main.js tilni almashtirib bo‘lgandan keyin
                setTimeout(() => {
                    updateChatLanguage();
                }, 50);
            }
        );
    });


    // ==========================================
    // HTML LANG O‘ZGARISHINI KUZATISH
    // ==========================================

    const languageObserver =
        new MutationObserver(() => {

            updateChatLanguage();

        });


    languageObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: ['lang']
        }
    );


    // ==========================================
    // XAVFSIZ HTML
    // ==========================================

    function escapeHtml(text) {

        const div =
            document.createElement('div');

        div.textContent = text;

        return div.innerHTML;
    }

});
