export const services = [
  {
    id: "svc-crisis-line", slug: "crisis-line", category: "crisis_line", name: "Crisis Line",
    summary: "Support for people who need help right now.",
    description: "Our crisis line connects you with someone to talk to when things feel like too much to handle alone. A caring team member is here to listen, offer immediate support, and help you work out the next step.",
    howToAccess: "[PLACEHOLDER] Describe how someone accesses this service — phone, drop-in, referral, hours.",
    isPublished: true,
  },
  {
    id: "svc-accommodation", slug: "accommodation", category: "accommodation", name: "Accommodation",
    summary: "Short-term, safe places to stay for people who need them.",
    description: "We offer short-term, safe places to stay for people who need somewhere secure right now. Our team works with you to find a space that suits your situation and helps you plan what comes next.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-psychological-support", slug: "psychological-support", category: "psychological_support", name: "Psychological Support",
    summary: "Connecting people with mental health support and services.",
    description: "We connect people with psychological support services to help look after their mental wellbeing. Our team can help you find the right kind of support for where you're at.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-ndis", slug: "ndis", category: "ndis", name: "NDIS Services",
    summary: "Support connected to the National Disability Insurance Scheme.",
    description: "We help connect people with NDIS-related support, making it easier to understand your plan and access the services that are right for you.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-hh-kids", slug: "hh-kids", category: "hh_kids", name: "HH Kids",
    summary: "Programs and support for children and families.",
    description: "HH Kids runs programs that give children and families a supportive, welcoming place to connect, play, and grow together — from holiday programs to after-school activities.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-chaplaincy", slug: "chaplaincy", category: "chaplaincy", name: "Chaplaincy",
    summary: "Pastoral care and support, open to people of all beliefs and none.",
    description: "Our chaplaincy service offers pastoral care and a listening ear, open to people of all beliefs and none. It's a space to talk, reflect, and find a moment of calm.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-jobs-program", slug: "jobs-program", category: "jobs_program", name: "Jobs Program",
    summary: "Help with finding and keeping work.",
    description: "Our jobs program helps you build the skills and confidence to find and keep meaningful work, whether you're starting out or getting back into the workforce.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-antisemitism-resources", slug: "antisemitism-resources", category: "antisemitism_resources", name: "Antisemitism Resources",
    summary: "Support and resources for people affected by antisemitism.",
    description: "We provide support and resources for people affected by antisemitism, offering a safe space to talk and access to helpful information and referrals.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-social-work", slug: "social-work", category: "social_work", name: "Social Work",
    summary: "General social work support and referrals.",
    description: "Our social workers provide general support, guidance, and referrals to help you navigate whatever challenges you're facing, taking the time to understand your situation.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
];

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug && s.isPublished);
}

export function getPublishedServices() {
  return services.filter((s) => s.isPublished);
}