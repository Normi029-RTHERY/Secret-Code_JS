export async function sendMessage() {
    console.log('Envoi du message...');

    const input = document.getElementById('chat-input').value;
    const responseBox = document.getElementById('response');
    responseBox.textContent = '⏳ Réponse en cours...';

    try {
        const result = await puter.ai.chat(input, {
            model: "gpt-4.1-nano"
        });
        responseBox.textContent = result;
    } catch (error) {
        responseBox.textContent = '❌ Erreur : ' + error.message;
    }
}