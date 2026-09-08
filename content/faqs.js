// FAQ entity — placeholder content. Replace answers with approved copy.

export const faqs = [
  {
    id: "faq-what-is-haven-house",
    question: "What is Haven House?",
    answer:
      "[PLACEHOLDER] Haven House is a not-for-profit support organisation based in Bondi, Sydney. Replace with approved description.",
    relatedServiceIds: [],
    category: "general",
    isPublished: true,
  },
  {
    id: "faq-is-this-free",
    question: "Is there a cost to access Haven House services?",
    answer: "[PLACEHOLDER] Confirm cost/fee information with Haven House.",
    relatedServiceIds: [],
    category: "general",
    isPublished: true,
  },
  {
    id: "faq-chatbot-scope",
    question: "What can this digital assistant help with?",
    answer:
      "This assistant can help you find information about Haven House services, answer general questions, give basic eligibility guidance, and show contact details. It cannot provide medical, psychological, legal, or crisis advice.",
    relatedServiceIds: [],
    category: "general",
    isPublished: true,
  },
  {
    id: "faq-chat-privacy",
    question: "Is my conversation with the assistant saved?",
    answer:
      "No. This assistant does not save chat history or messages. Nothing you type is stored after your conversation ends.",
    relatedServiceIds: [],
    category: "privacy",
    isPublished: true,
  },
  {
    id: "faq-talk-to-person",
    question: "Can I speak to a real person through this website?",
    answer:
      "This website doesn't provide live chat or direct transfer to staff. For direct contact, please use the phone number or details on the Contact page.",
    relatedServiceIds: [],
    category: "general",
    isPublished: true,
  },
  {
    id: "faq-accommodation-how",
    question: "How do I ask about temporary accommodation?",
    answer: "[PLACEHOLDER] Describe the process for enquiring about temporary accommodation.",
    relatedServiceIds: ["svc-temporary-accommodation"],
    category: "service_specific",
    isPublished: true,
  },
  {
    id: "faq-ndis-how",
    question: "Do I need an NDIS plan already to get support?",
    answer: "[PLACEHOLDER] Confirm NDIS-related eligibility details with Haven House.",
    relatedServiceIds: ["svc-ndis"],
    category: "service_specific",
    isPublished: true,
  },
];

export function getPublishedFaqs() {
  return faqs.filter((f) => f.isPublished);
}

export function getFaqsForService(serviceId) {
  return faqs.filter((f) => f.isPublished && f.relatedServiceIds.includes(serviceId));
}
