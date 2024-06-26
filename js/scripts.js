document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('input', resizeTextarea);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

document.getElementById('set-context-btn').addEventListener('click', setContext);
document.getElementById('context-input').addEventListener('input', resizeTextarea);
document.getElementById('context-input').addEventListener('click', resizeTextarea);
const contextTextarea = document.getElementById('context-input'); // Get the textarea element
const initialContextHeight = getComputedStyle(contextTextarea).getPropertyValue('height');
document.getElementById('context-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        setContext();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
  
    if (message) {
      addMessageToChat('user', message);
      userInput.value = '';
      resizeTextarea.call(userInput);
  
      try {
        // Send message to your API endpoint
        const response = await fetch('http://localhost:3000/chat', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: message, 
          })
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const data = await response.json();
        const botResponse = data.response;
        addMessageToChat('bot', botResponse);
  
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors, e.g., display an error message to the user
      }
    }
}

async function setContext() {
    const contextInput = document.getElementById('context-input');
    const context = contextInput.value.trim();
    if (context) {
        // Handle context setting logic here
        console.log("Context set:", context);
        contextInput.style.height = initialContextHeight
        try {
            // Send message to your API endpoint
            const response = await fetch('http://localhost:3000/context', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                context: context, 
              })
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
      
            const data = await response.json();
            console.log("context response", context)
            addMessageToChat('context', "CONTEXT: "+context);
      
          } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors, e.g., display an error message to the user
          }
    }
}

function resizeTextarea() {
    this.style.height = 'auto'; // Reset height to auto
    this.style.height = this.scrollHeight + 'px'; // Adjust height to fit content
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;

    // Create a <pre> element to preserve newlines
    const preElement = document.createElement('pre');
    preElement.textContent = message;

    // Append the <pre> to the messageElement
    messageElement.appendChild(preElement);

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


