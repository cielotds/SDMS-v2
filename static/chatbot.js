document.addEventListener('DOMContentLoaded', function() {
    function createChatbox() {
        if (!document.getElementById('chatboxContainer')) {
            let chatbox = document.createElement('div');
            chatbox.id = 'chatboxContainer';
            chatbox.innerHTML = `
                <div id="chatbox" class="chatbox">
                    <div class="chatbox-header">
                    <img src="static/images/FinGenius.png" alt="FinGenius Logo" class="logo"> <!-- Replace with your logo path -->
                    <h2 class="text-3xl font-bold text-white-700 mr-20 mt-3">FinGenius</h2>
                        <button id="closeChatbox">X</button>
                    </div>
                    <div class="chatbox-body">
                        <p>"Welcome! How can I assist you?</p>
                    </div>
                    <input type="text" id="chatInput" placeholder="Type a message..." /> <button id="sendButton">Send</button>
                </div>
            `;
            document.body.appendChild(chatbox);

            // Close button functionality
            document.getElementById('closeChatbox').addEventListener('click', function() {
                document.getElementById('chatboxContainer').remove();
            });

            // Send button functionality    
            document.getElementById('sendButton').addEventListener('click', function() {
                let chatInput = document.getElementById('chatInput');
                let chatboxBody = document.querySelector('.chatbox-body');
                let userMessage = chatInput.value;
                chatInput.value = '';

                // Display user message
                let userMessageElement = document.createElement('p');
                userMessageElement.className = 'user-message';
                userMessageElement.innerHTML = userMessage;
                chatboxBody.appendChild(userMessageElement);

                // Display chatbot response
                let chatbotResponse = getChatbotResponse(userMessage);
                let chatbotResponseElement = document.createElement('p');
                chatbotResponseElement.className = 'chatbot-response';
                chatbotResponseElement.innerHTML = chatbotResponse;
                chatboxBody.appendChild(chatbotResponseElement);
            });
        }
    }
    

    // Initialize chatbot when script is loaded
    createChatbox();
});

