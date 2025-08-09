let selectedProductType = null;
let linkCount = 1;
const maxLinks = 10;

// Product Type 버튼 이벤트
document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedProductType = this.dataset.type;
    });
});

// URL 추가 버튼 이벤트
document.getElementById('addLinkBtn').addEventListener('click', function() {
    if (linkCount < maxLinks) {
        linkCount++;
        const linkInputsDiv = document.getElementById('linkInputs');
        const newInputWrapper = document.createElement('div');
        newInputWrapper.className = 'link-input-wrapper';
        newInputWrapper.innerHTML = `
            <div class="input-row">
                <input type="text" class="link-input" placeholder="이미지 URL을 입력하세요">
                <button class="remove-btn" onclick="removeLink(this)">×</button>
            </div>
            <div class="error-message"></div>
        `;
        linkInputsDiv.appendChild(newInputWrapper);
        
        updateAddButton();
    }
});

// URL 제거 함수
function removeLink(btn) {
    btn.parentElement.remove();
    linkCount--;
    updateAddButton();
}

// 추가 버튼 상태 업데이트
function updateAddButton() {
    const addBtn = document.getElementById('addLinkBtn');
    if (linkCount >= maxLinks) {
        addBtn.disabled = true;
        addBtn.textContent = '최대 개수 도달';
    } else {
        addBtn.disabled = false;
        addBtn.textContent = `+ URL 추가 (${linkCount}/${maxLinks})`;
    }
}

// URL에 https 추가하는 함수
function ensureHttps(url) {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '';
    
    // 이미 http:// 또는 https://로 시작하는 경우 그대로 반환
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
    }
    
    // //로 시작하는 경우 https: 추가 (프로토콜 상대 URL)
    if (trimmedUrl.startsWith('//')) {
        return 'https:' + trimmedUrl;
    }
    
    // 그 외의 경우 https:// 추가
    return 'https://' + trimmedUrl;
}

// URL 유효성 검증 함수
function validateImageUrl(url) {
    if (!url || !url.trim()) {
        return { isValid: false, error: "빈 URL이 있습니다." };
    }

    const trimmedUrl = url.trim();
    
    // URL 길이 검사 (너무 짧으면 잘린 것으로 판단)
    if (trimmedUrl.length < 10) {
        return { isValid: false, error: `URL이 너무 짧습니다: ${trimmedUrl}` };
    }
    
    // 기본 URL 형식 검사 (https: 으로만 시작하는 것도 허용)
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(trimmedUrl)) {
        return { isValid: false, error: `올바르지 않은 URL 형식입니다: ${trimmedUrl}` };
    }
    
    // 이미지 확장자 검사
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
    if (!imageExtensions.test(trimmedUrl)) {
        return { isValid: false, error: `이미지 URL이 아닙니다 (jpg, png, gif, webp 등의 확장자가 필요): ${trimmedUrl}` };
    }
    
    // URL이 갑자기 끊어진 것처럼 보이는지 검사
    if (trimmedUrl.endsWith('/') || trimmedUrl.endsWith('?') || trimmedUrl.endsWith('&')) {
        return { isValid: false, error: `URL이 완전하지 않습니다: ${trimmedUrl}` };
    }
    
    // 연속된 특수문자나 이상한 패턴 검사
    if (/[\/]{3,}|[?&]{2,}|\.{3,}/.test(trimmedUrl)) {
        return { isValid: false, error: `URL에 이상한 패턴이 있습니다: ${trimmedUrl}` };
    }
    
    return { isValid: true };
}

// 모든 에러 메시지 지우기
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(errorDiv => {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    });
}

// 개별 에러 메시지 표시
function showError(input, message) {
    const wrapper = input.closest('.link-input-wrapper');
    const errorDiv = wrapper.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// JSON 생성 버튼 이벤트
document.getElementById('generateBtn').addEventListener('click', function() {
    // 먼저 모든 에러 메시지 지우기
    clearAllErrors();
    
    const imageUrls = [];
    let hasProductTypeError = false;
    let hasUrlError = false;
    
    // Product Type이 선택되지 않은 경우 검사
    if (!selectedProductType) {
        hasProductTypeError = true;
        alert('Product Type을 선택해주세요.');
        return;
    }

    // 모든 입력창 검사
    const inputs = document.querySelectorAll('.link-input');
    let hasValidUrl = false;
    
    inputs.forEach((input) => {
        if (input.value.trim()) {
            hasValidUrl = true;
            const httpsUrl = ensureHttps(input.value.trim());
            const validation = validateImageUrl(httpsUrl);
            
            if (validation.isValid) {
                imageUrls.push(httpsUrl);
            } else {
                showError(input, validation.error);
                hasUrlError = true;
            }
        }
    });

    // URL이 하나도 없는 경우
    if (!hasValidUrl) {
        alert('최소 하나의 이미지 URL을 입력해주세요.');
        return;
    }

    // JSON 생성 (항상 success로)
    const jsonData = {
        "response_status": "success",
        "exception_message": "",
        "product_url_info": {
            "product_type": selectedProductType
        },
        "image_url_list": imageUrls
    };

    const jsonOutputElement = document.getElementById('jsonOutput');
    jsonOutputElement.textContent = JSON.stringify(jsonData, null, 2);
    jsonOutputElement.classList.remove('error');
    
    // API 버튼 활성화 (유효한 URL이 하나라도 있으면)
    const sendApiBtn = document.getElementById('sendApiBtn');
    if (imageUrls.length > 0 && !hasUrlError) {
        sendApiBtn.disabled = false;
        sendApiBtn.setAttribute('data-json', JSON.stringify(jsonData));
    } else {
        sendApiBtn.disabled = true;
        sendApiBtn.removeAttribute('data-json');
    }
});

// API 서버 연결성 테스트 함수
async function testApiConnection() {
    const apiUrl = 'https://goodpicker-server.onrender.com/get-final-answer';
    
    try {
        // 간단한 연결 테스트 - HEAD 요청 또는 빈 POST 요청으로 서버 응답 확인
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test: true }),
            signal: controller.signal,
            mode: 'cors' // CORS 명시적 설정
        });
        
        clearTimeout(timeoutId);
        
        return { 
            success: true, 
            status: response.status, 
            statusText: response.statusText,
            cors: response.type !== 'opaque'
        };
        
    } catch (error) {
        return {
            success: false,
            errorType: error.name,
            errorMessage: error.message,
            isCorsError: error.message.includes('CORS') || error.message.includes('cross-origin'),
            isNetworkError: error instanceof TypeError && error.message.includes('fetch')
        };
    }
}

// API 호출 함수 (개선된 버전)
async function sendToAPI(jsonData) {
    const apiUrl = 'https://goodpicker-server.onrender.com/get-final-answer';
    
    try {
        // 타임아웃 설정 (30초)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        console.log('API 요청 시작:', {
            url: apiUrl,
            method: 'POST',
            data: jsonData
        });
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData),
            signal: controller.signal,
            mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        console.log('API 응답 받음:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
            
            // 구체적인 에러 메시지 가져오기
            try {
                const errorData = await response.text();
                if (errorData) {
                    errorMessage += `\n응답 내용: ${errorData}`;
                }
            } catch (e) {
                console.error('응답 내용 읽기 실패:', e);
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('API 응답 데이터:', result);
        return { success: true, data: result };
        
    } catch (error) {
        console.error('API 요청 에러:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'AbortError') {
            return { 
                success: false, 
                error: '⏱️ 요청 시간이 초과되었습니다 (30초)\n\n서버가 응답하지 않습니다. 서버 상태를 확인해주세요.',
                errorType: 'timeout'
            };
        }
        
        if (error instanceof TypeError) {
            if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
                return { 
                    success: false, 
                    error: '🌐 네트워크 연결 실패\n\n가능한 원인:\n1. 인터넷 연결 문제\n2. 서버가 다운되었을 수 있음\n3. CORS 정책으로 인한 차단\n\n브라우저 개발자 도구(F12)의 Network 탭을 확인해보세요.',
                    errorType: 'network'
                };
            }
        }
        
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
            return { 
                success: false, 
                error: '🚫 CORS 정책 위반\n\n브라우저가 보안상의 이유로 요청을 차단했습니다.\nAPI 서버에서 CORS 헤더 설정이 필요합니다.',
                errorType: 'cors'
            };
        }
        
        return { 
            success: false, 
            error: `❌ API 요청 실패\n\n에러: ${error.message}\n\n기술 정보:\n- 에러 타입: ${error.name}\n- 브라우저: ${navigator.userAgent}`,
            errorType: 'unknown'
        };
    }
}

// 연결 테스트 버튼 이벤트
document.getElementById('testConnectionBtn').addEventListener('click', async function() {
    const apiResultSection = document.getElementById('apiResultSection');
    const apiResultElement = document.getElementById('apiResult');
    
    // 로딩 상태 시작
    this.classList.add('loading');
    this.disabled = true;
    
    // 결과 섹션 표시
    apiResultSection.style.display = 'block';
    apiResultElement.className = 'api-result';
    apiResultElement.textContent = '🔍 API 서버 연결성을 테스트하고 있습니다...\n\n이 과정은 최대 10초가 소요될 수 있습니다.';
    
    try {
        const testResult = await testApiConnection();
        
        // 로딩 상태 종료
        this.classList.remove('loading');
        this.disabled = false;
        
        if (testResult.success) {
            apiResultElement.className = 'api-result success';
            apiResultElement.textContent = `✅ API 서버 연결 성공!\n\n서버 상태: ${testResult.status} ${testResult.statusText}\nCORS 지원: ${testResult.cors ? '✅' : '❌'}\n\n이제 "API로 결과 받기" 버튼을 안전하게 사용할 수 있습니다.`;
        } else {
            apiResultElement.className = 'api-result error';
            let errorMessage = `❌ API 서버 연결 실패\n\n`;
            
            if (testResult.isCorsError) {
                errorMessage += `🚫 CORS 정책 위반\n브라우저가 보안상의 이유로 요청을 차단했습니다.\n\n해결 방법:\n1. API 서버에서 CORS 설정 확인\n2. 프록시 서버 사용\n3. 브라우저 확장 프로그램 사용`;
            } else if (testResult.isNetworkError) {
                errorMessage += `🌐 네트워크 연결 문제\n\n가능한 원인:\n1. 인터넷 연결 불안정\n2. API 서버 다운\n3. 방화벽 차단\n\n해결 방법:\n1. 인터넷 연결 확인\n2. 나중에 다시 시도\n3. VPN 사용 시도`;
            } else {
                errorMessage += `기술적 세부사항:\n- 에러 타입: ${testResult.errorType}\n- 에러 메시지: ${testResult.errorMessage}`;
            }
            
            apiResultElement.textContent = errorMessage;
        }
        
        // 스크롤을 결과 영역으로 이동
        apiResultSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        // 예상치 못한 에러 처리
        this.classList.remove('loading');
        this.disabled = false;
        
        apiResultElement.className = 'api-result error';
        apiResultElement.textContent = `❌ 연결 테스트 중 오류 발생\n\n${error.message}`;
    }
});

// API 버튼 이벤트 (사전 진단 포함)
document.getElementById('sendApiBtn').addEventListener('click', async function() {
    const jsonData = JSON.parse(this.getAttribute('data-json'));
    const apiResultSection = document.getElementById('apiResultSection');
    const apiResultElement = document.getElementById('apiResult');
    
    // 로딩 상태 시작
    this.classList.add('loading');
    this.disabled = true;
    
    // API 결과 섹션 표시
    apiResultSection.style.display = 'block';
    apiResultElement.className = 'api-result';
    apiResultElement.textContent = '🔍 사전 연결 확인 중...\n\n서버 상태를 확인하고 있습니다.';
    
    try {
        // 먼저 간단한 연결 테스트 수행
        console.log('사전 연결 테스트 시작...');
        const preTest = await testApiConnection();
        
        if (!preTest.success) {
            // 연결 테스트 실패 시 바로 에러 표시
            this.classList.remove('loading');
            this.disabled = false;
            
            apiResultElement.className = 'api-result error';
            let errorMessage = `🚫 사전 연결 테스트 실패\n\nAPI 서버에 연결할 수 없습니다.\n\n`;
            
            if (preTest.isCorsError) {
                errorMessage += `원인: CORS 정책 위반\n해결: 브라우저 개발자 도구(F12)에서 Network 탭을 확인하세요.`;
            } else if (preTest.isNetworkError) {
                errorMessage += `원인: 네트워크 연결 문제\n해결: 인터넷 연결과 서버 상태를 확인하세요.`;
            } else {
                errorMessage += `에러: ${preTest.errorMessage}`;
            }
            
            apiResultElement.textContent = errorMessage;
            return;
        }
        
        console.log('사전 연결 테스트 성공, 실제 API 호출 시작...');
        apiResultElement.textContent = '✅ 연결 확인 완료\n\n📤 실제 데이터를 서버로 전송하고 있습니다...';
        
        // 실제 API 호출
        const result = await sendToAPI(jsonData);
        
        // 로딩 상태 종료
        this.classList.remove('loading');
        this.disabled = false;
        
        // 결과 표시
        if (result.success) {
            apiResultElement.className = 'api-result success';
            apiResultElement.textContent = JSON.stringify(result.data, null, 2);
        } else {
            apiResultElement.className = 'api-result error';
            apiResultElement.textContent = result.error + `\n\n📋 요청 데이터:\n${JSON.stringify(jsonData, null, 2)}`;
        }
        
        // 스크롤을 결과 영역으로 이동
        apiResultSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        // 예상치 못한 에러 처리
        this.classList.remove('loading');
        this.disabled = false;
        
        apiResultElement.className = 'api-result error';
        apiResultElement.textContent = `❌ 예상치 못한 오류 발생\n\n${error.message}\n\n🛠️ 문제 해결:\n1. 페이지 새로고침 후 다시 시도\n2. 브라우저 개발자 도구(F12) 확인\n3. 다른 브라우저로 시도`;
    }
});

// 페이지 로드 시 초기 상태 설정
document.addEventListener('DOMContentLoaded', function() {
    updateAddButton();
    
    // API 결과 영역 초기화
    const apiResultSection = document.getElementById('apiResultSection');
    apiResultSection.style.display = 'none';
    
    // API 버튼 초기 비활성화
    const sendApiBtn = document.getElementById('sendApiBtn');
    sendApiBtn.disabled = true;
});

// 초기 상태 설정
updateAddButton();