document.addEventListener('DOMContentLoaded', () => {

    const chatButton = document.getElementById('hipaChatButton');
    const chatWindow = document.getElementById('hipaChatWindow');
    const chatClose = document.getElementById('hipaChatClose');

    const input = document.getElementById('hipaChatInput');
    const sendButton = document.getElementById('hipaSendButton');
    const messages = document.getElementById('hipaChatMessages');


    // Chatni ochish
    chatButton.addEventListener('click', () => {
        chatWindow.classList.toggle('active');

        if (chatWindow.classList.contains('active')) {
            setTimeout(() => input.focus(), 200);
        }
    });


    // Chatni yopish
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });


    // Xabar qo‘shish
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


    // Hozircha demo javob
    function sendMessage() {

        const text = input.value.trim();

        if (!text) return;

        addMessage(text, 'user');

        input.value = '';

        setTimeout(() => {

            addMessage(
                "Savolingiz qabul qilindi. AI yordamchi backendga ulangandan so‘ng sizga batafsil javob beradi.",
                'bot'
            );

        }, 500);
    }


    sendButton.addEventListener('click', sendMessage);


    input.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {
            sendMessage();
        }

    });


    // XSS himoyasi
    function escapeHtml(text) {

        const div = document.createElement('div');

        div.textContent = text;

        return div.innerHTML;
    }

});
