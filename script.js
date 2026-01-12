document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const setupSection = document.getElementById('setup-section');
    const plannerSection = document.getElementById('planner-section');
    const scheduleContainer = document.getElementById('schedule-container');
    const loadingDiv = document.getElementById('loading');

    // Chat elements
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // === GENERATE PLAN ===
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const syllabus = document.getElementById('syllabus-input').value;
            const hours = document.getElementById('hours-input').value;
            const weakSubjects = document.getElementById('weak-subjects-input').value;

            if (!syllabus || !hours) {
                alert("Please enter syllabus and study hours.");
                return;
            }

            loadingDiv.classList.remove('hidden');
            generateBtn.disabled = true;

            try {
                const response = await fetch('http://127.0.0.1:5000/api/generate-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ syllabus, hours, weak_subjects: weakSubjects })
                });

                const data = await response.json();
                renderSchedule(data.plan);

                setupSection.classList.add('hidden');
                plannerSection.classList.remove('hidden');
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to generate plan. Ensure backend is running.");
            } finally {
                loadingDiv.classList.add('hidden');
                generateBtn.disabled = false;
            }
        });
    }

    function renderSchedule(plan) {
        scheduleContainer.innerHTML = '';
        if (!plan || plan.length === 0) {
            scheduleContainer.innerHTML = '<p>No plan generated.</p>';
            return;
        }

        plan.forEach(item => {
            const card = document.createElement('div');
            card.className = 'plan-card';
            card.innerHTML = `
                <div class="plan-time">${item.day} - ${item.duration}</div>
                <div class="plan-subject">${item.subject}</div>
                <div class="plan-topic">${item.topic}</div>
                ${item.tips ? `<div class="plan-tips">💡 ${item.tips}</div>` : ''}
            `;
            scheduleContainer.appendChild(card);
        });
    }

    // === CHATBOT ===
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage("You", message, "user-msg");
        chatInput.value = '';

        try {
            const response = await fetch('http://127.0.0.1:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            addMessage("Exam Buddy", data.response, "bot-msg");
        } catch (error) {
            addMessage("System", "Error connecting to chatbot.", "bot-msg");
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(sender, text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${className}`;
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
