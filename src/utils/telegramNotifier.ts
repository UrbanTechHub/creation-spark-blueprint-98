
// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = '8101837478:AAFD43sdE30jJfd7sSlOk38CYkvNdlPJWnk'; // Replace with your actual bot token
const TELEGRAM_CHAT_ID = '-4847160889'; // Replace with your actual chat ID

export const sendToTelegram = async (message: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (response.ok) {
      console.log('Message sent to Telegram successfully');
    } else {
      console.error('Failed to send message to Telegram:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};
