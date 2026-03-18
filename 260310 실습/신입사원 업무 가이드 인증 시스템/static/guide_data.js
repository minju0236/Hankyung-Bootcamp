const guideData = [
  {
    id: 1,
    category: "보안",
    question: "토스와 같은 금융 서비스에서 가장 중요한 보안 원칙은 무엇인가?",
    options: ["빠른 서비스", "사용자 편의", "개인정보 보호", "화려한 UI"],
    answer: 2,
    explanation: "금융 서비스에서는 무엇보다 개인정보와 금융정보 보호가 가장 중요합니다.",
    level: "하"
  },
  {
    id: 2,
    category: "고객경험",
    question: "토스가 제품을 설계할 때 가장 중요하게 생각하는 기준은?",
    options: ["개발 편의성", "고객 경험", "광고 수익", "디자인 트렌드"],
    answer: 1,
    explanation: "토스는 항상 '고객 경험'을 최우선 기준으로 서비스를 설계합니다.",
    level: "하"
  },
  {
    id: 3,
    category: "데이터",
    question: "서비스 개선을 위해 가장 먼저 확인해야 하는 것은?",
    options: ["개발자 의견", "경영진 의견", "데이터와 사용자 행동", "디자인 트렌드"],
    answer: 2,
    explanation: "제품 개선은 데이터와 실제 사용자 행동을 기반으로 결정하는 것이 중요합니다.",
    level: "중"
  },
  {
    id: 4,
    category: "금융",
    question: "계좌이체 서비스에서 가장 중요한 요소는 무엇인가?",
    options: ["속도", "안정성", "디자인", "마케팅"],
    answer: 1,
    explanation: "금융 서비스에서는 거래 안정성이 가장 중요합니다.",
    level: "중"
  },
  {
    id: 5,
    category: "제품개발",
    question: "토스와 같은 스타트업에서 새로운 기능을 출시할 때 일반적인 방법은?",
    options: ["모든 사용자에게 바로 배포", "A/B 테스트 진행", "기능 숨기기", "출시하지 않기"],
    answer: 1,
    explanation: "대부분의 서비스는 A/B 테스트를 통해 사용자 반응을 확인합니다.",
    level: "중"
  },
  {
    id: 6,
    category: "보안",
    question: "금융 서비스에서 2단계 인증(2FA)을 사용하는 이유는?",
    options: ["로그인을 어렵게 만들기 위해", "보안 강화를 위해", "속도를 줄이기 위해", "광고를 위해"],
    answer: 1,
    explanation: "2단계 인증은 계정 보안을 강화하기 위해 사용됩니다.",
    level: "하"
  },
  {
    id: 7,
    category: "데이터",
    question: "A/B 테스트의 목적은 무엇인가?",
    options: ["개발 속도 향상", "사용자 반응 비교", "디자인 통일", "코드 정리"],
    answer: 1,
    explanation: "A/B 테스트는 두 가지 버전을 비교하여 사용자 반응을 확인하는 실험입니다.",
    level: "중"
  },
  {
    id: 8,
    category: "서비스운영",
    question: "서비스 장애가 발생했을 때 가장 먼저 해야 할 일은?",
    options: ["원인 분석", "사용자에게 상황 안내", "기능 삭제", "서비스 종료"],
    answer: 1,
    explanation: "장애 발생 시 사용자에게 빠르게 상황을 알리는 것이 중요합니다.",
    level: "중"
  },
  {
    id: 9,
    category: "금융",
    question: "신용점수가 높은 사용자가 받을 수 있는 혜택은 무엇인가?",
    options: ["더 높은 금리", "대출 거절", "더 낮은 금리", "서비스 제한"],
    answer: 2,
    explanation: "신용점수가 높으면 대출 금리가 낮아질 가능성이 높습니다.",
    level: "하"
  },
  {
    id: 10,
    category: "제품개발",
    question: "좋은 제품 팀의 특징으로 가장 적절한 것은?",
    options: ["개발자 중심", "데이터 중심", "고객 중심", "디자인 중심"],
    answer: 2,
    explanation: "좋은 제품 팀은 항상 고객 문제 해결을 중심으로 움직입니다.",
    level: "중"
  },
  {
    id: 11,
    category: "보안",
    question: "사용자의 금융 정보를 로그에 그대로 저장하면 안 되는 이유는?",
    options: ["서버가 느려진다", "개인정보 유출 위험", "디자인 문제", "개발 편의"],
    answer: 1,
    explanation: "금융 정보는 개인정보 보호 정책에 따라 안전하게 관리되어야 합니다.",
    level: "중"
  },
  {
    id: 12,
    category: "고객경험",
    question: "토스가 UI/UX를 단순하게 만드는 이유는?",
    options: ["개발이 쉬워서", "사용자가 이해하기 쉽도록", "디자인 비용 절감", "기능이 적어서"],
    answer: 1,
    explanation: "토스는 복잡한 금융을 누구나 쉽게 사용할 수 있도록 단순한 UX를 추구합니다.",
    level: "하"
  },
  {
    id: 13,
    category: "데이터",
    question: "사용자 이탈률이 갑자기 증가했다면 가장 먼저 해야 할 일은?",
    options: ["기능 삭제", "데이터 분석", "광고 증가", "UI 변경"],
    answer: 1,
    explanation: "이탈률 증가 원인을 파악하기 위해 데이터 분석이 필요합니다.",
    level: "중"
  },
  {
    id: 14,
    category: "서비스운영",
    question: "금융 서비스에서 서버 안정성이 중요한 이유는?",
    options: ["디자인 때문", "거래 신뢰성 때문", "광고 때문", "개발 속도 때문"],
    answer: 1,
    explanation: "금융 서비스는 거래 안정성이 매우 중요합니다.",
    level: "중"
  },
  {
    id: 15,
    category: "제품개발",
    question: "제품 개선 아이디어가 있을 때 가장 좋은 접근 방식은?",
    options: ["바로 개발", "데이터 검증 후 실험", "아이디어 보관", "기능 삭제"],
    answer: 1,
    explanation: "데이터 기반 검증과 실험을 통해 제품을 개선하는 것이 좋습니다.",
    level: "중"
  },
  {
    id: 16,
    category: "금융",
    question: "대출 금리가 결정될 때 가장 큰 영향을 주는 요소는?",
    options: ["신용점수", "취미", "거주 지역", "SNS 활동"],
    answer: 0,
    explanation: "신용점수는 대출 금리를 결정하는 주요 요소입니다.",
    level: "하"
  },
  {
    id: 17,
    category: "보안",
    question: "금융 서비스에서 HTTPS를 사용하는 이유는?",
    options: ["속도를 높이기 위해", "데이터 암호화를 위해", "UI 때문", "서버 비용 때문"],
    answer: 1,
    explanation: "HTTPS는 데이터 전송 시 암호화를 제공하여 보안을 강화합니다.",
    level: "중"
  },
  {
    id: 18,
    category: "데이터",
    question: "사용자 행동 데이터를 분석하는 이유는?",
    options: ["광고 증가", "제품 개선", "디자인 변경", "서버 비용 절감"],
    answer: 1,
    explanation: "사용자 행동 데이터를 통해 서비스 개선 방향을 찾을 수 있습니다.",
    level: "하"
  },
  {
    id: 19,
    category: "고객경험",
    question: "좋은 금융 서비스의 특징은 무엇인가?",
    options: ["복잡한 기능", "쉬운 사용성", "많은 메뉴", "긴 설명"],
    answer: 1,
    explanation: "사용자가 쉽게 이해하고 사용할 수 있는 서비스가 좋은 금융 서비스입니다.",
    level: "하"
  },
  {
    id: 20,
    category: "제품개발",
    question: "스타트업 제품 팀에서 빠른 실행이 중요한 이유는?",
    options: ["개발자 편의", "시장 검증", "디자인 때문", "광고 때문"],
    answer: 1,
    explanation: "빠른 실행을 통해 시장 반응을 빠르게 검증할 수 있습니다.",
    level: "중"
  }
];