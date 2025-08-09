# 굿피커 UT 프리미엄 대체텍스트 생성기

깔끔한 SaaS 스타일의 이미지 URL 기반 대체텍스트 생성 도구입니다.

## 🚀 **라이브 데모**

GitHub Pages: [https://onepinetree.github.io/good_picker_ut_tool/](https://onepinetree.github.io/good_picker_ut_tool/)

## ✨ **주요 기능**

### 📋 **Product Type 선택**
- 일반 상품 (Common)
- 식품 (Food)
- 패션 (Fashion)  
- 생활용품 (Daily Supplies)

### 🖼️ **이미지 URL 관리**
- 최대 10개 URL 입력 가능
- 자동 HTTPS 처리
- 실시간 URL 유효성 검증
- 개별 에러 메시지 표시

### 🔧 **API 연동**
- JSON 데이터 자동 생성
- `goodpicker-server.onrender.com` API 호출
- 연결 테스트 기능
- 로딩 상태 관리
- 상세한 에러 진단

## 🛠️ **기술 스택**

- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 SaaS UI 디자인
- **Vanilla JavaScript**: ES6+ 문법
- **Fetch API**: 비동기 HTTP 통신

## 📱 **반응형 디자인**

- 데스크톱/모바일 최적화
- 터치 친화적 인터페이스
- 유연한 레이아웃

## 🚦 **사용법**

1. **Product Type 선택**: 4가지 카테고리 중 하나 선택
2. **이미지 URL 입력**: 개별 입력창에 이미지 URL 추가
3. **JSON 생성**: 데이터 검증 후 JSON 포맷 출력
4. **연결 테스트**: API 서버 상태 사전 확인 (선택사항)
5. **API 호출**: 실제 서버로 데이터 전송 및 결과 수신

## 🔍 **에러 진단**

- **URL 유효성 검사**: 이미지 형식, 길이, 패턴 검증
- **네트워크 진단**: CORS, 타임아웃, 연결 실패 구분
- **사용자 친화적 메시지**: 구체적인 해결 방법 제시

## 📄 **JSON 출력 형식**

```json
{
  "response_status": "success",
  "exception_message": "",
  "product_url_info": {
    "product_type": "fashion"
  },
  "image_url_list": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

## 🎨 **UI/UX 특징**

- **미니멀 디자인**: 컬러풀하지 않은 회색 톤 위주
- **부드러운 애니메이션**: 호버 및 상태 전환 효과
- **직관적 아이콘**: 시각적 피드백 강화
- **접근성 고려**: 키보드 탐색 지원

## 📈 **성능 최적화**

- **가벼운 구조**: 외부 라이브러리 미사용
- **빠른 로딩**: 최소한의 HTTP 요청
- **효율적 검증**: 클라이언트 사이드 미리 검사

---

**개발**: onepinetree  
**라이선스**: MIT
