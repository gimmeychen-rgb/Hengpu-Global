export type Locale = 'en' | 'zh';

export type CorporateContent = {
  navAbout: string;
  navCapabilities: string;
  navProjects: string;
  navContact: string;
  heroEyebrow: string;
  heroDescription: string;
  exploreLabel: string;
  conversationLabel: string;
  aboutLabel: string;
  aboutTitle: string;
  aboutDescription: string;
  capabilitiesLabel: string;
  sourcingTitle: string;
  sourcingDescription: string;
  technologyTitle: string;
  technologyDescription: string;
  collaborationTitle: string;
  collaborationDescription: string;
  tradeTitle: string;
  tradeDescription: string;
  focusLabel: string;
  miningTitle: string;
  equipmentTitle: string;
  hardwareTitle: string;
  focusTradeTitle: string;
  workLabel: string;
  understandStep: string;
  identifyStep: string;
  connectStep: string;
  supportStep: string;
  growStep: string;
  contactLabel: string;
  contactTitle: string;
  heroTitleFirstLine: string;
  heroTitleSecondLine: string;
  brand: string;
  chineseLabel: string;
  englishLabel: string;
  contactEmail: string;
};

// Corporate copy mirrors the existing homepage in both languages.
export const siteContent = {
  "en": {
    "navAbout": "About",
    "navCapabilities": "Capabilities",
    "navProjects": "Projects",
    "navContact": "Contact",
    "heroEyebrow": "Global Supply Chain · Technology · Collaboration",
    "heroDescription": "Hengpu connects international demand with trusted Chinese resources, technology, manufacturers and long-term partners.",
    "exploreLabel": "Explore Hengpu",
    "conversationLabel": "Start a Conversation",
    "aboutLabel": "About Hengpu",
    "aboutTitle": "Making cross-border collaboration clearer and more reliable.",
    "aboutDescription": "Hengpu is not a single-product supplier. We are building a collaboration infrastructure that connects global demand with Chinese resources and long-term partners, with a focus on real needs, trusted resources and lasting value.",
    "capabilitiesLabel": "Capabilities",
    "sourcingTitle": "Global Sourcing & Supply Chain",
    "sourcingDescription": "From understanding demand and identifying resources to supplier verification, sourcing and export support.",
    "technologyTitle": "Technology & Equipment",
    "technologyDescription": "Connecting Chinese manufacturing capabilities and industrial technologies with real projects overseas.",
    "collaborationTitle": "Project Collaboration",
    "collaborationDescription": "Building long-term collaboration networks around mining, resources and industrial projects.",
    "tradeTitle": "Cross-border Trade Services",
    "tradeDescription": "Supporting sourcing, export agency, logistics coordination and international transactions.",
    "focusLabel": "Focus Areas",
    "miningTitle": "Mining & Resources",
    "equipmentTitle": "Industrial Equipment",
    "hardwareTitle": "Hardware & Small Appliances",
    "focusTradeTitle": "Cross-border Trade",
    "workLabel": "How We Work",
    "understandStep": "Understand",
    "identifyStep": "Identify",
    "connectStep": "Connect",
    "supportStep": "Support",
    "growStep": "Grow",
    "contactLabel": "Contact",
    "contactTitle": "If you have a real need, we are ready to start a meaningful conversation.",
    "heroTitleFirstLine": "Connecting Global Demand",
    "heroTitleSecondLine": "with Trusted Resources.",
    "brand": "HENGPU",
    "chineseLabel": "中",
    "englishLabel": "EN",
    "contactEmail": "gimmey@hengpuglobal.com"
  },
  "zh": {
    "navAbout": "关于恒普",
    "navCapabilities": "业务能力",
    "navProjects": "项目",
    "navContact": "联系我们",
    "heroEyebrow": "全球供应链 · 技术 · 协作",
    "heroDescription": "恒普连接国际需求与值得信赖的中国资源、技术、制造商及长期合作伙伴。",
    "exploreLabel": "了解恒普",
    "conversationLabel": "开始交流",
    "aboutLabel": "关于恒普",
    "aboutTitle": "让跨境合作变得更清晰、更可靠。",
    "aboutDescription": "恒普不是单一产品供应商，而是一座连接全球需求、中国资源与长期合作伙伴的协作基础设施。我们关注真实需求、可信资源与长期价值。",
    "capabilitiesLabel": "业务能力",
    "sourcingTitle": "全球采购与供应链",
    "sourcingDescription": "从需求理解、资源寻找，到供应商筛选、采购与出口支持。",
    "technologyTitle": "技术与设备",
    "technologyDescription": "连接中国制造能力、工业技术与海外真实项目需求。",
    "collaborationTitle": "项目协作",
    "collaborationDescription": "围绕矿业、资源与产业项目建立长期合作网络。",
    "tradeTitle": "跨境贸易服务",
    "tradeDescription": "提供代理出口、采购、物流协调及交易支持。",
    "focusLabel": "重点领域",
    "miningTitle": "矿业与资源",
    "equipmentTitle": "工业设备",
    "hardwareTitle": "五金与小家电",
    "focusTradeTitle": "跨境贸易",
    "workLabel": "合作方式",
    "understandStep": "理解需求",
    "identifyStep": "寻找资源",
    "connectStep": "验证与连接",
    "supportStep": "支持交易",
    "growStep": "长期合作",
    "contactLabel": "联系我们",
    "contactTitle": "如果你有真实的需求，我们愿意开始一次认真交流。",
    "heroTitleFirstLine": "连接全球需求",
    "heroTitleSecondLine": "与值得信赖的资源。",
    "brand": "HENGPU",
    "chineseLabel": "中",
    "englishLabel": "EN",
    "contactEmail": "gimmey@hengpuglobal.com"
  }
} satisfies Record<Locale, CorporateContent>;
