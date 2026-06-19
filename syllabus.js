const syllabus = {
  paper1: {
    name: "Paper 1 - सामान्य ज्ञान",
    fullName: "सामान्य ज्ञान (General Knowledge)",
    totalQuestions: 100,
    totalMarks: 200,
    duration: "2 घंटे",
    topics: [
      {
        id: "rajasthan-gk",
        name: "राजस्थान का भूगोल, इतिहास, संस्कृति एवं सामान्य ज्ञान",
        shortName: "राजस्थान GK",
        icon: "\u{1F3DB}\u{FE0F}",
        count: 40,
        marks: 80,
        subtopics: [
          { id: "raj-geo", name: "राजस्थान का भूगोल" },
          { id: "ancient-culture", name: "प्राचीन संस्कृति एवं सभ्यता" },
          { id: "raj-history", name: "राजस्थान का इतिहास (8वीं-18वीं शताब्दी)" },
          { id: "freedom-struggle", name: "स्वतंत्रता संग्राम एवं राजनीतिक जागरण" },
          { id: "integration", name: "राजस्थान का एकीकरण" },
          { id: "society-religion", name: "समाज एवं धर्म" },
          { id: "raj-polity", name: "राजनीतिक एवं प्रशासनिक व्यवस्था" }
        ]
      },
      {
        id: "rajasthan-current",
        name: "राजस्थान के समसामयिक घटनाक्रम",
        shortName: "राजस्थान करंट अफेयर्स",
        icon: "\u{1F4F0}",
        count: 10,
        marks: 20,
        subtopics: [
          { id: "raj-current", name: "राजस्थान से संबंधित समसामयिक घटनाएँ" }
        ]
      },
      {
        id: "world-india-gk",
        name: "विश्व एवं भारत का सामान्य ज्ञान",
        shortName: "विश्व एवं भारत GK",
        icon: "\u{1F30D}",
        count: 30,
        marks: 60,
        subtopics: [
          { id: "general-science", name: "सामान्य विज्ञान" },
          { id: "math", name: "गणित" },
          { id: "reasoning", name: "तर्कशक्ति एवं मानसिक योग्यता" },
          { id: "current-affairs", name: "समसामयिक घटनाएँ (राष्ट्रीय/अंतर्राष्ट्रीय)" },
          { id: "world-geo", name: "विश्व भूगोल" },
          { id: "india-geo", name: "भारत का भूगोल" },
          { id: "indian-economy", name: "भारतीय अर्थव्यवस्था" },
          { id: "indian-constitution", name: "भारतीय संविधान एवं राजनीतिक व्यवस्था" },
          { id: "indian-foreign-policy", name: "भारतीय विदेश नीति" }
        ]
      },
      {
        id: "edu-psychology",
        name: "शैक्षिक मनोविज्ञान",
        shortName: "शैक्षिक मनोविज्ञान",
        icon: "\u{1F9E0}",
        count: 20,
        marks: 40,
        subtopics: [
          { id: "meaning-scope", name: "अर्थ एवं क्षेत्र" },
          { id: "learner-development", name: "शिक्षार्थी का विकास" },
          { id: "learning-theories", name: "अधिगम के सिद्धांत" },
          { id: "personality", name: "व्यक्तित्व" },
          { id: "intelligence-creativity", name: "बुद्धि एवं सृजनात्मकता" },
          { id: "motivation", name: "अभिप्रेरणा" },
          { id: "individual-differences", name: "वैयक्तिक विभिन्नताएँ" }
        ]
      }
    ]
  },
  paper2: {
    name: "Paper 2 - विषय विशेष",
    fullName: "विषय विशेष (Subject Specific)",
    totalQuestions: 150,
    totalMarks: 300,
    duration: "2 घंटे 30 मिनट",
    subjects: [
      { id: "hindi", name: "हिंदी", icon: "\u{1F4DD}" },
      { id: "english", name: "अंग्रेज़ी", icon: "\u{1F4D6}" },
      { id: "sanskrit", name: "संस्कृत", icon: "\u{1FAB7}" },
      { id: "math", name: "गणित", icon: "\u{1F4D0}" },
      { id: "science", name: "विज्ञान", icon: "\u{1F52C}" },
      { id: "social-science", name: "सामाजिक विज्ञान", icon: "\u{1F30F}" }
    ]
  }
};
