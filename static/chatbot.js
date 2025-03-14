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
                    <input type="text" id="chatInput" placeholder="Type a message..." /> 
                </div>
            `;
            document.body.appendChild(chatbox);

            // Close button functionality
            document.getElementById('closeChatbox').addEventListener('click', function() {
                document.getElementById('chatboxContainer').remove();
            });
        }
    }
    

    // Initialize chatbot when script is loaded
    createChatbox();
});

