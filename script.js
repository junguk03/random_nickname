// Constants
const MAX_HISTORY_SIZE = 20;
const ANIMATION_DURATION = 300;
const MIN_NICKNAME_LENGTH = 2;
const MAX_NICKNAME_LENGTH = 8;

// 한글 자음과 모음
const CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];
const FINAL_CONSONANTS = ['', 'ㄱ', 'ㄴ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

// 발음하기 어려운 조합 필터링
const AWKWARD_COMBINATIONS = [
    'ㅃㅃ', 'ㅉㅉ', 'ㄸㄸ', 'ㄲㄲ',
    'ㅆㅆ', 'ㅎㅎ', 'ㅋㅋ',
];

// Nickname data by category (기존 단어 조합용)
const NICKNAME_DATA = {
    cute: {
        prefixes: ['귀여운', '사랑스런', '포근한', '달콤한', '보들보들', '뽀송뽀송', '몽글몽글', '폭신폭신', '아기', '꼬마', '미니'],
        suffixes: ['토끼', '햄스터', '강아지', '고양이', '판다', '코알라', '다람쥐', '병아리', '펭귄', '구름', '솜사탕', '마시멜로', '별', '달']
    },
    cool: {
        prefixes: ['멋진', '강력한', '냉철한', '어둠의', '전설의', '무적의', '최강', '불멸의'],
        suffixes: ['늑대', '독수리', '호랑이', '용', '사자', '매', '전사', '기사', '암살자', '검사', '마법사', '현자', '제왕', '군주']
    },
    funny: {
        prefixes: ['웃긴', '황당한', '빵터지는', '어이없는', '이상한', '괴상한', '엉뚱한', '말도안되는', '미친'],
        suffixes: ['감자', '고구마', '양파', '당근', '호박', '피자', '치킨', '떡볶이', '라면', '김밥', '돈까스', '햄버거', '만두', '순대']
    },
    fantasy: {
        prefixes: ['신성한', '전설의', '불멸의', '영원한', '고대의', '신비한', '마법의', '초월한', '신화의'],
        suffixes: ['드래곤', '피닉스', '유니콘', '그리폰', '히드라', '켄타우로스', '페가수스', '요정', '엘프', '마법사', '현자', '성기사']
    }
};

// State management
class NicknameGenerator {
    constructor() {
        this._currentCategory = 'random';
        this._currentLength = 'random';
        this._currentNickname = null;
        this._history = this._loadHistory();
        this._init();
    }

    _init() {
        this._bindEvents();
        this._renderHistory();
    }

    _bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this._handleGenerate());
        document.getElementById('copyBtn').addEventListener('click', () => this._handleCopy());

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this._handleCategoryChange(e));
        });

        document.querySelectorAll('.length-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this._handleLengthChange(e));
        });
    }

    _handleGenerate() {
        const nickname = this._generateNickname();
        this._displayNickname(nickname);
        this._addToHistory(nickname);
        this._showCopyButton();
    }

    _handleCopy() {
        if (!this._currentNickname) return;

        navigator.clipboard.writeText(this._currentNickname)
            .then(() => this._showCopyFeedback())
            .catch(err => console.error('복사 실패:', err));
    }

    _handleCategoryChange(event) {
        const btn = event.target;
        const category = btn.dataset.category;

        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this._currentCategory = category;
    }

    _handleLengthChange(event) {
        const btn = event.target;
        const length = btn.dataset.length;

        document.querySelectorAll('.length-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this._currentLength = length;
    }

    _generateNickname() {
        if (this._currentCategory === 'random') {
            return this._generateRandomKoreanNickname();
        }

        return this._generateCategoryNickname();
    }

    // 랜덤 한글 조합 생성
    _generateRandomKoreanNickname() {
        const length = this._getDesiredLength();
        let nickname = '';
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            nickname = this._createKoreanWord(length);

            if (this._isValidNickname(nickname)) {
                return nickname;
            }

            attempts++;
        }

        // 실패하면 카테고리 방식으로 폴백
        return this._generateCategoryNickname();
    }

    _getDesiredLength() {
        if (this._currentLength === 'random') {
            return this._getRandomLength();
        }
        return parseInt(this._currentLength);
    }

    _createKoreanWord(length) {
        let word = '';

        for (let i = 0; i < length; i++) {
            const consonant = this._getRandomElement(CONSONANTS);
            const vowel = this._getRandomElement(VOWELS);

            // 70% 확률로 받침 없이, 30% 확률로 받침 추가
            const finalConsonant = Math.random() < 0.7
                ? ''
                : this._getRandomElement(FINAL_CONSONANTS);

            const char = this._assembleHangul(consonant, vowel, finalConsonant);
            word += char;
        }

        return word;
    }

    // 한글 조합 함수
    _assembleHangul(consonant, vowel, finalConsonant = '') {
        const HANGUL_START = 0xAC00;
        const CONSONANT_BASE = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const VOWEL_BASE = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        const FINAL_BASE = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

        const consonantIndex = CONSONANT_BASE.indexOf(consonant);
        const vowelIndex = VOWEL_BASE.indexOf(vowel);
        const finalIndex = FINAL_BASE.indexOf(finalConsonant);

        if (consonantIndex === -1 || vowelIndex === -1 || finalIndex === -1) {
            return '';
        }

        const code = HANGUL_START + (consonantIndex * 21 * 28) + (vowelIndex * 28) + finalIndex;
        return String.fromCharCode(code);
    }

    _isValidNickname(nickname) {
        if (!nickname || nickname.length < MIN_NICKNAME_LENGTH) return false;
        if (nickname.length > MAX_NICKNAME_LENGTH) return false;

        // 이상한 조합 체크
        for (const awkward of AWKWARD_COMBINATIONS) {
            if (nickname.includes(awkward)) return false;
        }

        // 같은 글자가 3번 이상 반복되는지 체크
        if (/(.)\1{2,}/.test(nickname)) return false;

        return true;
    }

    // 기존 카테고리 방식 생성
    _generateCategoryNickname() {
        const categories = this._getAvailableCategories();
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const data = NICKNAME_DATA[randomCategory];

        const prefix = this._getRandomElement(data.prefixes);
        const suffix = this._getRandomElement(data.suffixes);

        const formats = [
            `${prefix}${suffix}`,
            `${suffix}${prefix}`,
            `${prefix}_${suffix}`,
        ];

        return this._getRandomElement(formats);
    }

    _getAvailableCategories() {
        if (this._currentCategory === 'random' || this._currentCategory === 'all') {
            return Object.keys(NICKNAME_DATA);
        }
        return [this._currentCategory];
    }

    _getRandomLength() {
        return Math.floor(Math.random() * (MAX_NICKNAME_LENGTH - MIN_NICKNAME_LENGTH + 1)) + MIN_NICKNAME_LENGTH;
    }

    _getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    _displayNickname(nickname) {
        const nicknameEl = document.getElementById('nickname');

        nicknameEl.style.opacity = '0';
        nicknameEl.style.transform = 'scale(0.9)';

        setTimeout(() => {
            this._currentNickname = nickname;
            nicknameEl.textContent = nickname;
            nicknameEl.style.transition = `all ${ANIMATION_DURATION}ms ease`;
            nicknameEl.style.opacity = '1';
            nicknameEl.style.transform = 'scale(1)';
        }, 100);
    }

    _showCopyButton() {
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.style.display = 'block';
    }

    _showCopyFeedback() {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;

        copyBtn.textContent = '복사 완료!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = 'white';
        copyBtn.style.borderColor = '#10b981';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 1500);
    }

    _addToHistory(nickname) {
        if (this._history.includes(nickname)) return;

        this._history.unshift(nickname);

        if (this._history.length > MAX_HISTORY_SIZE) {
            this._history = this._history.slice(0, MAX_HISTORY_SIZE);
        }

        this._saveHistory();
        this._renderHistory();
    }

    _renderHistory() {
        const historyEl = document.getElementById('nicknameHistory');

        if (this._isHistoryEmpty()) {
            historyEl.innerHTML = '<p class="empty-message">아직 생성된 닉네임이 없습니다</p>';
            return;
        }

        historyEl.innerHTML = this._history
            .map(nickname => this._createHistoryItemHTML(nickname))
            .join('');

        this._bindHistoryItemEvents();
    }

    _isHistoryEmpty() {
        return this._history.length === 0;
    }

    _createHistoryItemHTML(nickname) {
        return `<div class="history-item" data-nickname="${nickname}">${nickname}</div>`;
    }

    _bindHistoryItemEvents() {
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const nickname = e.target.dataset.nickname;
                this._displayNickname(nickname);
                this._showCopyButton();
            });
        });
    }

    _loadHistory() {
        try {
            const saved = localStorage.getItem('nicknameHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('히스토리 로드 실패:', error);
            return [];
        }
    }

    _saveHistory() {
        try {
            localStorage.setItem('nicknameHistory', JSON.stringify(this._history));
        } catch (error) {
            console.error('히스토리 저장 실패:', error);
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new NicknameGenerator();
});
