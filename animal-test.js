const faceImage = document.querySelector('#faceImage');
const imagePreview = document.querySelector('#imagePreview');
const animalForm = document.querySelector('#animalForm');
const animalResult = document.querySelector('#animalResult');

const animalTypes = {
    bright: {
        friendly: ['강아지상', '밝고 편안한 에너지가 먼저 보입니다.'],
        elegant: ['사슴상', '맑고 단정한 분위기가 강합니다.'],
        cool: ['고양이상', '또렷하면서도 여유 있는 인상이 돋보입니다.']
    },
    calm: {
        friendly: ['토끼상', '부드럽고 다정한 분위기가 잘 어울립니다.'],
        elegant: ['사슴상', '차분하고 깨끗한 인상이 중심입니다.'],
        cool: ['여우상', '조용하지만 선명한 매력이 있습니다.']
    },
    sharp: {
        friendly: ['고양이상', '선명한 인상 안에 친근한 느낌이 있습니다.'],
        elegant: ['여우상', '세련되고 집중도 높은 분위기가 강합니다.'],
        cool: ['호랑이상', '강한 존재감과 카리스마가 먼저 보입니다.']
    }
};

faceImage.addEventListener('change', () => {
    const file = faceImage.files?.[0];

    if (!file) {
        imagePreview.innerHTML = '<p class="loading">이미지 미리보기가 여기에 표시됩니다.</p>';
        return;
    }

    const imageUrl = URL.createObjectURL(file);
    imagePreview.innerHTML = `<img src="${imageUrl}" alt="선택한 얼굴 사진 미리보기">`;
});

animalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(animalForm);
    const impression = data.get('impression');
    const mood = data.get('mood');
    const result = animalTypes[impression]?.[mood];

    if (!result) {
        return;
    }

    animalResult.innerHTML = `
        <p class="best-label">결과</p>
        <h2>${result[0]}</h2>
        <p class="best-reason">${result[1]}</p>
        <p class="weather-note">다음 단계에서는 얼굴 특징 분석 모델이나 질문지를 더 붙일 수 있습니다.</p>
    `;
});
