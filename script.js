// Constants
const MAX_HISTORY_SIZE = 20;
const ANIMATION_DURATION = 300;
const MIN_NICKNAME_LENGTH = 2;
const MAX_NICKNAME_LENGTH = 8;

// 자주 쓰이는 한국어 음절 (카테고리별)
const COMMON_SYLLABLES = {
    cute: ['나', '미', '유', '리', '아', '민', '지', '은', '하', '서', '연', '수', '예', '다', '소', '별', '달', '구름', '꽃', '봄', '여름', '가을', '겨울', '노을', '바다', '하늘', '사랑', '희망', '빛', '요', '니', '루', '모', '보', '로', '코', '토', '포', '빈', '송', '이', '새', '린', '채', '단', '솔', '담', '해', '샛', '별님', '달님', '초롱', '향기', '방울', '반짝', '포근', '보송', '몽실', '보들', '노리', '두리', '동글', '말랑', '쫑긋', '토실', '통통', '방긋', '포실', '무지개', '은하수', '별빛', '햇살'],
    cool: ['강', '혁', '준', '석', '진', '태', '현', '호', '철', '범', '건', '성', '용', '승', '찬', '우', '훈', '영', '무', '검', '칼', '불', '천', '왕', '제', '군', '장', '신', '성', '투', '크', '스', '엑', '제트', '블랙', '다크', '레드', '블루', '룡', '호랑', '맹호', '백호', '청룡', '흑룡', '적룡', '금강', '백전', '무패', '절대', '극한', '초월', '암흑', '폭풍', '번개', '천둥', '화염', '빙결', '섬광', '진격', '돌격', '맹렬', '격파', '필살', '격전', '혈투', '결전'],
    funny: ['뿡', '빵', '똥', '방', '퐁', '팡', '퍽', '퉁', '쿵', '덩', '두', '부', '쿠', '푸', '루', '무', '뚱', '뿌', '삐', '뽀', '뚜', '또', '호호', '키키', '흐흐', '뭉', '몽', '봉', '롱', '콩', '땅콩', '호박', '감자', '고구마', '당근', '깡총', '껑충', '폴짝', '통통', '덜렁', '뒹굴', '데굴', '뿅', '꾸물', '아용', '냠냠', '쩝쩝', '우물', '뚱땡', '둥둥', '엉금', '꼬물', '촐랑', '덜컥', '허겁', '벌컥', '쭈욱', '쪼그', '굴렁', '딱딱이', '말랑이', '흔들이', '둥글이'],
    fantasy: ['엘', '리', '아', '스', '라', '미', '카', '사', '나', '에', '르', '드', '다', '루', '시', '온', '안', '레', '디', '오', '제', '린', '로', '샤', '리엘', '미르', '세라', '루나', '노바', '스타', '오로라', '네오', '아리아', '레온', '카이', '제로', '루시', '아스', '트라', '엘리', '실버', '크리스', '알렉', '세이', '프리', '라파', '가브', '우리', '미카', '라지', '소피', '테오', '리안', '니엘', '윈', '플로', '에테', '아르', '벨라', '셀레', '아제', '베르', '클라', '엘사', '이리스', '페니', '키라', '젤다', '하이', '제피', '루비', '에스', '실리', '엔젤'],
    random: ['민', '서', '준', '하', '도', '윤', '우', '지', '현', '수', '은', '주', '아', '진', '영', '소', '예', '연', '희', '정', '경', '미', '선', '나', '다', '라', '유', '리', '시', '호', '원', '재', '성', '태', '건', '범', '석', '철', '용', '승', '찬', '훈', '강', '혁', '빈', '율', '후', '효', '혜', '채', '린', '이', '결', '안', '완', '욱', '열', '규', '상', '인', '찬', '형', '기', '동', '종', '명', '훈', '경', '준', '환', '재', '헌', '권', '한', '승', '영', '중', '균', '진', '성', '태', '용', '웅', '호', '휘']
};

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

    // 랜덤 한글 조합 생성 (음절 기반)
    _generateRandomKoreanNickname() {
        const targetLength = this._getDesiredLength();
        const syllables = COMMON_SYLLABLES.random;
        let nickname = '';
        let currentLength = 0;

        while (currentLength < targetLength) {
            const syllable = this._getRandomElement(syllables);

            // 남은 길이 체크
            if (currentLength + syllable.length <= targetLength) {
                nickname += syllable;
                currentLength += syllable.length;
            } else if (currentLength + 1 === targetLength) {
                // 1글자만 남았으면 1글자 음절 추가
                const singleSyllables = syllables.filter(s => s.length === 1);
                if (singleSyllables.length > 0) {
                    nickname += this._getRandomElement(singleSyllables);
                    currentLength += 1;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        return nickname || this._generateCategoryNickname();
    }

    _getDesiredLength() {
        if (this._currentLength === 'random') {
            return this._getRandomLength();
        }
        return parseInt(this._currentLength);
    }

    // 기존 카테고리 방식 생성
    _generateCategoryNickname() {
        const categories = this._getAvailableCategories();
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        // 글자수가 지정된 경우: 카테고리 느낌으로 음절 조합 생성
        if (this._currentLength !== 'random' && COMMON_SYLLABLES[randomCategory]) {
            return this._generateCategoryBasedKorean(randomCategory);
        }

        // 랜덤 글자수인 경우: 기존 단어 조합 방식
        const data = NICKNAME_DATA[randomCategory];
        const prefix = this._getRandomElement(data.prefixes);
        const suffix = this._getRandomElement(data.suffixes);

        const formats = [
            `${prefix}${suffix}`,
            `${suffix}${prefix}`,
        ];

        return this._getRandomElement(formats);
    }

    // 카테고리 느낌에 맞는 한글 생성 (음절 기반)
    _generateCategoryBasedKorean(category) {
        const targetLength = this._getDesiredLength();
        const syllables = COMMON_SYLLABLES[category] || COMMON_SYLLABLES.random;
        let nickname = '';
        let currentLength = 0;

        while (currentLength < targetLength) {
            const syllable = this._getRandomElement(syllables);

            // 남은 길이 체크
            if (currentLength + syllable.length <= targetLength) {
                nickname += syllable;
                currentLength += syllable.length;
            } else if (currentLength + 1 === targetLength) {
                // 1글자만 남았으면 1글자 음절 추가
                const singleSyllables = syllables.filter(s => s.length === 1);
                if (singleSyllables.length > 0) {
                    nickname += this._getRandomElement(singleSyllables);
                    currentLength += 1;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        return nickname || this._generateCategoryNickname();
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
