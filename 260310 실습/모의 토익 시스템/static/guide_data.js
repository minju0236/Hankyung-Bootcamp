const guideData = [
  {
    id: 1,
    part: 1,
    category: "LC",
    content: "사진을 보고 가장 적절한 설명을 고르시오.",
    media: {
      image: "static/office_meeting.jpg",
      audio: "static/audio/p1_q1.mp3"
    },
    options: [
      "사람들이 회의실에서 회의를 하고 있다.",
      "사람들이 운동을 하고 있다.",
      "사람들이 식사를 하고 있다.",
      "사람들이 쇼핑을 하고 있다."
    ],
    answer: 0,
    explanation: "사진에는 회의실에서 회의 중인 사람들이 보인다."
  },

  {
    id: 2,
    part: 2,
    category: "LC",
    content: "다음 질문에 가장 적절한 응답을 고르시오.",
    media: {
      audio: "/static/audio/p2_q1.mp3"
    },
    options: [
      "Yes, I finished it yesterday.",
      "At the office near the station.",
      "Because it was expensive.",
      "Three times a week."
    ],
    answer: 0,
    explanation: "질문이 완료 여부를 묻는 형태이므로 Yes 응답이 적절하다."
  },

  {
    id: 3,
    part: 3,
    category: "LC",
    content: "다음 대화를 듣고 질문에 답하시오.",
    media: {
      audio: "/static/audio/p3_q1.mp3"
    },
    options: [
      "회의 일정 변경",
      "출장 계획",
      "신규 프로젝트 시작",
      "고객 불만 처리"
    ],
    answer: 1,
    explanation: "대화에서 출장 계획을 논의하는 내용이 나온다."
  },

  {
    id: 4,
    part: 4,
    category: "LC",
    content: "다음 안내 방송을 듣고 질문에 답하시오.",
    media: {
      audio: "/static/audio/p4_q1.mp3"
    },
    options: [
      "항공편 지연 안내",
      "회의 공지",
      "제품 광고",
      "호텔 예약 안내"
    ],
    answer: 0,
    explanation: "방송에서 항공편 지연에 대해 안내하고 있다."
  },

  {
    id: 5,
    part: 5,
    category: "RC",
    content: "The manager asked the employees to submit their reports ____ Friday.",
    media: null,
    options: [
      "by",
      "with",
      "from",
      "about"
    ],
    answer: 0,
    explanation: "'by Friday'는 금요일까지라는 의미로 가장 적절하다."
  },

  {
    id: 6,
    part: 6,
    category: "RC",
    content: "다음 문장의 빈칸에 들어갈 가장 적절한 표현을 고르시오.\n\nThe company has decided to ____ a new policy to improve customer satisfaction.",
    media: null,
    options: [
      "implement",
      "borrow",
      "destroy",
      "complain"
    ],
    answer: 0,
    explanation: "정책을 시행한다는 의미로 implement가 적절하다."
  },

  {
    id: 7,
    part: 7,
    category: "RC",
    content: "다음 이메일을 읽고 질문에 답하시오.\n\nDear Team,\nThe meeting scheduled for tomorrow has been postponed due to unforeseen circumstances.",
    media: null,
    options: [
      "회의가 취소되었다",
      "회의가 연기되었다",
      "회의가 시작되었다",
      "회의가 온라인으로 변경되었다"
    ],
    answer: 1,
    explanation: "postponed는 '연기되었다'는 의미이다."
  }
];