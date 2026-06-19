let currentQuestions = [];
let userAnswers = [];
let currentIndex = 0;
let answered = false;
let quizHistory = [];

const subjects = [
  { name: "राजस्थान का इतिहास एवं संस्कृति", icon: "🏛️" },
  { name: "राजस्थान का भूगोल", icon: "🗺️" },
  { name: "राजस्थान की राजव्यवस्था", icon: "⚖️" },
  { name: "सामान्य विज्ञान", icon: "🔬" },
  { name: "गणित", icon: "📐" },
  { name: "तर्कशक्ति", icon: "🧠" },
  { name: "समसामयिक घटनाएं", icon: "📰" }
];

function getSubjectIcon(subjectName) {
  const subj = subjects.find(s => s.name === subjectName);
  return subj ? subj.icon : "📚";
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showHome() {
  showScreen('homeScreen');
  updateHomeStats();
}

function updateHomeStats() {
  document.getElementById('totalQuestions').textContent = questionsData.length;
  document.getElementById('totalSubjects').textContent = subjects.length;
}

function showSubjects() {
  showScreen('subjectScreen');
  const list = document.getElementById('subjectList');
  list.innerHTML = '';
  subjects.forEach(subj => {
    const count = questionsData.filter(q => q.subject === subj.name).length;
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subj-icon">${subj.icon}</div>
      <div class="subj-name">${subj.name}</div>
      <div class="subj-count">${count} प्रश्न</div>
    `;
    card.onclick = () => startQuiz(subj.name);
    list.appendChild(card);
  });
}

function startQuiz(subjectFilter) {
  if (subjectFilter) {
    currentQuestions = questionsData.filter(q => q.subject === subjectFilter);
  } else {
    currentQuestions = [...questionsData];
    currentQuestions.sort(() => Math.random() - 0.5);
  }

  if (currentQuestions.length === 0) return;

  userAnswers = new Array(currentQuestions.length).fill(null);
  currentIndex = 0;
  answered = false;

  showScreen('quizScreen');
  document.getElementById('totalQ').textContent = currentQuestions.length;
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuestions[currentIndex];
  answered = false;

  document.getElementById('currentQ').textContent = currentIndex + 1;
  document.getElementById('qNumber').textContent = currentIndex + 1;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('quizSubject').textContent = getSubjectIcon(q.subject) + ' ' + q.subject;

  const progress = ((currentIndex) / currentQuestions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[i]}</span><span>${opt}</span>`;
    btn.dataset.index = i;
    btn.onclick = () => selectOption(i);
    container.appendChild(btn);
  });

  document.getElementById('explanationBox').style.display = 'none';
  document.getElementById('nextBtn').textContent =
    currentIndex === currentQuestions.length - 1 ? 'परिणाम देखें' : 'अगला प्रश्न';
}

function selectOption(index) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentIndex];
  userAnswers[currentIndex] = index;

  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.answer) btn.classList.add('correct');
    if (i === index && i !== q.answer) btn.classList.add('wrong');
    if (i === index) btn.classList.add('selected');
  });

  const correct = index === q.answer;
  document.getElementById('resultIcon').textContent = correct ? '✅' : '❌';
  document.getElementById('resultText').textContent = correct ? 'सही उत्तर!' : 'गलत उत्तर!';
  document.getElementById('resultText').style.color = correct ? '#2ecc71' : '#e74c3c';
  document.getElementById('explanationContent').innerHTML = q.explanation;
  document.getElementById('explanationBox').style.display = 'block';

  quizHistory.push({
    question: q.question,
    options: q.options,
    correct: q.answer,
    selected: index,
    explanation: q.explanation
  });
}

function nextQuestion() {
  if (currentIndex < currentQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResult();
  }
}

function confirmEnd() {
  if (confirm('क्या आप क्विज़ छोड़ना चाहते हैं? आपकी प्रगति सहेजी नहीं जाएगी।')) {
    quizHistory = [];
    showHome();
  }
}

function showResult() {
  showScreen('resultScreen');

  let correct = 0, wrong = 0, unattempted = 0;
  currentQuestions.forEach((q, i) => {
    if (userAnswers[i] === null) unattempted++;
    else if (userAnswers[i] === q.answer) correct++;
    else wrong++;
  });

  const total = currentQuestions.length;
  const percentage = Math.round((correct / total) * 100);

  document.getElementById('finalScore').textContent = correct;
  document.getElementById('finalTotal').textContent = total;
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('wrongCount').textContent = wrong;
  document.getElementById('unattemptedCount').textContent = unattempted;
  document.getElementById('percentageDisplay').textContent = percentage + '%';
}

function showReview() {
  showScreen('reviewScreen');
  const list = document.getElementById('reviewList');
  list.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];

  currentQuestions.forEach((q, i) => {
    const ans = userAnswers[i];
    const isCorrect = ans === q.answer;
    const isUnattempted = ans === null;

    let statusClass = 'correct';
    let statusText = 'सही';
    if (isUnattempted) { statusClass = 'unattempted'; statusText = 'छोड़ा'; }
    else if (!isCorrect) { statusClass = 'wrong'; statusText = 'गलत'; }

    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-status ${statusClass}">${statusText}</div>
      <div class="review-q">${q.question}</div>
      <div class="review-answer your-ans">
        <span class="label">आपका उत्तर:</span>
        ${isUnattempted ? 'कोई उत्तर नहीं' : labels[ans] + '. ' + q.options[ans]}
      </div>
      ${!isCorrect ? `<div class="review-answer correct-ans"><span class="label">सही उत्तर:</span> ${labels[q.answer]}. ${q.options[q.answer]}</div>` : ''}
      <div class="review-explanation">${q.explanation}</div>
    `;
    list.appendChild(item);
  });
}

showHome();
