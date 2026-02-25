export interface ChatResponse {
  text: string;
  type: 'answer' | 'escalate' | 'greeting';
}

const STORE_INFO = {
  name: 'G&S MEDICAL',
  email: 'gauravsaswade@gsgroupswebstore.in',
  customerCare: '+91 9766343454',
  ceoPhone: '+91 9270556455',
  cofounderPhone: '+91 9156896495',
  whatsapp: '+91 9766343454',
};

const FAQ_RESPONSES: Array<{ patterns: string[]; response: string }> = [
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],
    response: `Hello! Welcome to G&S MEDICAL! 🌿 I'm your virtual assistant. How can I help you today? You can ask me about our medicines, ordering process, contact information, or seller registration.`,
  },
  {
    patterns: ['order', 'buy', 'purchase', 'how to order', 'place order', 'ordering'],
    response: `To place an order at G&S MEDICAL:\n\n1. Browse our medicines section on the website\n2. Contact our customer care at ${STORE_INFO.customerCare}\n3. WhatsApp us at ${STORE_INFO.whatsapp}\n4. Our team will assist you with availability and delivery\n\nWe ensure quality medicines at the best prices! 💊`,
  },
  {
    patterns: ['medicine', 'medicines', 'drug', 'drugs', 'tablet', 'capsule', 'syrup', 'injection', 'available'],
    response: `G&S MEDICAL offers a wide range of quality medicines including:\n\n• Prescription medicines\n• OTC (Over-the-counter) drugs\n• Vitamins & supplements\n• Ayurvedic products\n• Medical equipment\n\nFor specific medicine availability, please call us at ${STORE_INFO.customerCare} or check our Medicines section. 🏥`,
  },
  {
    patterns: ['contact', 'phone', 'call', 'number', 'reach', 'helpline'],
    response: `📞 G&S MEDICAL Contact Information:\n\n• Customer Care: ${STORE_INFO.customerCare}\n• CEO (Gaurav Sasvade): ${STORE_INFO.ceoPhone}\n• Co-Founder (Shushant Waghmare): ${STORE_INFO.cofounderPhone}\n• Email: ${STORE_INFO.email}\n\nWe're here to help you! 😊`,
  },
  {
    patterns: ['whatsapp', 'chat', 'message', 'text'],
    response: `💬 You can reach us on WhatsApp:\n\n• Customer Care: ${STORE_INFO.whatsapp}\n• CEO: ${STORE_INFO.ceoPhone}\n• Co-Founder: ${STORE_INFO.cofounderPhone}\n\nClick the WhatsApp links on our Contact section for quick access!`,
  },
  {
    patterns: ['seller', 'register', 'become seller', 'join', 'partner', 'distributor', 'vendor'],
    response: `🤝 Want to become a seller with G&S MEDICAL?\n\nWe welcome qualified medical distributors and pharmacies to join our network!\n\nTo register as a seller:\n1. Contact us at ${STORE_INFO.customerCare}\n2. Email us at ${STORE_INFO.email}\n3. Our team will guide you through the registration process\n\nJoin India's trusted medical network! 🌟`,
  },
  {
    patterns: ['price', 'cost', 'rate', 'discount', 'offer', 'cheap', 'affordable'],
    response: `💰 G&S MEDICAL offers competitive pricing on all medicines!\n\n• We provide genuine medicines at fair prices\n• Special discounts for bulk orders\n• Regular offers and promotions\n\nFor specific pricing, please contact us at ${STORE_INFO.customerCare} or browse our medicines section. We believe quality healthcare should be affordable! 🏥`,
  },
  {
    patterns: ['delivery', 'shipping', 'deliver', 'home delivery', 'courier'],
    response: `🚚 G&S MEDICAL Delivery Information:\n\n• We offer home delivery services\n• Fast and reliable shipping\n• Medicines delivered in proper packaging\n\nFor delivery details and availability in your area, please contact:\n📞 ${STORE_INFO.customerCare}\n💬 WhatsApp: ${STORE_INFO.whatsapp}`,
  },
  {
    patterns: ['timing', 'hours', 'open', 'close', 'time', 'working hours'],
    response: `🕐 G&S MEDICAL Store Hours:\n\n• Monday to Saturday: 9:00 AM - 9:00 PM\n• Sunday: 10:00 AM - 6:00 PM\n\nFor urgent requirements, contact our customer care:\n📞 ${STORE_INFO.customerCare}\n\nWe're always here for your healthcare needs! 💊`,
  },
  {
    patterns: ['location', 'address', 'where', 'find', 'store', 'shop'],
    response: `📍 G&S MEDICAL Store Location:\n\nFor our exact address and directions, please contact us:\n📞 ${STORE_INFO.customerCare}\n📧 ${STORE_INFO.email}\n\nOur team will provide you with complete location details and help you find us easily! 🗺️`,
  },
  {
    patterns: ['prescription', 'doctor', 'prescription medicine', 'rx'],
    response: `💊 Prescription Medicines at G&S MEDICAL:\n\n• We stock a wide range of prescription medicines\n• Valid prescription required for Rx medicines\n• Our pharmacists ensure proper dispensing\n• We maintain complete medicine records\n\nFor prescription medicine queries, call us at ${STORE_INFO.customerCare}. Your health is our priority! 🏥`,
  },
  {
    patterns: ['quality', 'genuine', 'authentic', 'original', 'fake', 'trust'],
    response: `✅ G&S MEDICAL Quality Assurance:\n\n• 100% genuine and authentic medicines\n• Sourced directly from licensed manufacturers\n• Proper storage conditions maintained\n• All medicines within expiry date\n• Licensed and certified pharmacy\n\nYour health and safety is our top priority! 🌟`,
  },
  {
    patterns: ['ceo', 'founder', 'gaurav', 'sasvade', 'owner'],
    response: `👨‍💼 About Our CEO - Gaurav Sasvade:\n\nMr. Gaurav Sasvade is the visionary Founder & CEO of G&S MEDICAL. With his dedication to making quality healthcare accessible to all, he has built G&S MEDICAL into a trusted name in the medical industry.\n\n📞 CEO Contact: ${STORE_INFO.ceoPhone}\n\nHis commitment to excellence drives our mission every day! 🌟`,
  },
  {
    patterns: ['cofounder', 'co-founder', 'shushant', 'waghmare', 'director'],
    response: `👨‍💼 About Our Co-Founder - Shushant Waghmare:\n\nMr. Shushant Waghmare is the Co-Founder & Director of G&S MEDICAL. His strategic vision and operational expertise have been instrumental in building our robust distribution network.\n\n📞 Co-Founder Contact: ${STORE_INFO.cofounderPhone}\n\nHis leadership ensures we deliver excellence every day! 🌟`,
  },
  {
    patterns: ['thank', 'thanks', 'thank you', 'great', 'helpful', 'good'],
    response: `😊 You're most welcome! G&S MEDICAL is always here to serve you.\n\nFor any further assistance:\n📞 ${STORE_INFO.customerCare}\n📧 ${STORE_INFO.email}\n\nStay healthy and take care! 💚`,
  },
  {
    patterns: ['bye', 'goodbye', 'see you', 'take care', 'exit'],
    response: `👋 Thank you for visiting G&S MEDICAL!\n\nRemember, we're always here for your healthcare needs.\n📞 ${STORE_INFO.customerCare}\n\nStay healthy and take care! 💚`,
  },
];

export function getBotResponse(userQuery: string): ChatResponse {
  const query = userQuery.toLowerCase().trim();

  if (!query) {
    return {
      text: "Please type your question and I'll be happy to help! 😊",
      type: 'answer',
    };
  }

  // Check FAQ patterns
  for (const faq of FAQ_RESPONSES) {
    for (const pattern of faq.patterns) {
      if (query.includes(pattern)) {
        return {
          text: faq.response,
          type: 'answer',
        };
      }
    }
  }

  // Escalation for unrecognized queries
  return {
    text: `I'm sorry, I couldn't find a specific answer to your query. 🙏\n\nPlease contact our customer care team for personalized assistance:\n\n📞 Call: ${STORE_INFO.customerCare}\n💬 WhatsApp: ${STORE_INFO.whatsapp}\n📧 Email: ${STORE_INFO.email}\n\nOur team is ready to help you! 😊`,
    type: 'escalate',
  };
}

export function getWelcomeMessage(): string {
  return `👋 Welcome to G&S MEDICAL Assistant!\n\nI'm here to help you with:\n• Medicine information\n• Ordering process\n• Contact details\n• Seller registration\n• Store information\n\nHow can I assist you today? 💊`;
}
