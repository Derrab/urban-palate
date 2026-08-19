const { formatBookingMessage } = require('../utils/formatters');

class WhatsAppService {
  constructor() {
    this.provider = process.env.WHATSAPP_PROVIDER || 'twilio';
  }

  async sendBookingNotification(booking) {
    const message = formatBookingMessage(booking);
    return this.sendMessage(message);
  }

  async sendMessage(text) {
    if (this.provider === 'twilio') {
      return this.sendViaTwilio(text);
    }
    if (this.provider === 'callmebot') {
      return this.sendViaCallMeBot(text);
    }
    console.warn(`Unknown WhatsApp provider: ${this.provider}`);
    return { sent: false, reason: 'unknown_provider' };
  }

  async sendViaTwilio(text) {
    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_WHATSAPP_FROM,
      OWNER_WHATSAPP_NUMBER
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !OWNER_WHATSAPP_NUMBER) {
      console.warn('Missing Twilio environment variables');
      return { sent: false, reason: 'missing_config' };
    }

    try {
      const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const message = await twilio.messages.create({
        from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${OWNER_WHATSAPP_NUMBER}`,
        body: text
      });
      return { sent: true, sid: message.sid };
    } catch (error) {
      console.error('Twilio error:', error.message);
      return { sent: false, reason: error.message };
    }
  }

  async sendViaCallMeBot(text) {
    const { OWNER_WHATSAPP_NUMBER, CALLMEBOT_API_KEY } = process.env;

    if (!OWNER_WHATSAPP_NUMBER || !CALLMEBOT_API_KEY) {
      console.warn('Missing CallMeBot environment variables');
      return { sent: false, reason: 'missing_config' };
    }

    const phone = OWNER_WHATSAPP_NUMBER.replace(/[^\d]/g, '');
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&apikey=${CALLMEBOT_API_KEY}&text=${encodeURIComponent(text)}`;

    try {
      const response = await fetch(url);
      const body = await response.text();
      return { sent: response.ok, reason: body };
    } catch (error) {
      console.error('CallMeBot error:', error.message);
      return { sent: false, reason: error.message };
    }
  }
}

module.exports = new WhatsAppService();