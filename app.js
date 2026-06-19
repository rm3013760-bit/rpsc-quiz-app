let currentQuestions = [];
let userAnswers = [];
let currentIndex = 0;
let answered = false;
let quizHistory = [];

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
  document.getElementById('totalTopics').textContent = syllabus.paper1.topics.length + syllabus.paper2.subjects.length;
  document.getElementById('paper1Stats').textContent = questionsData.filter(q => q.paper === 1).length + ' प्रश्न | ' + syllabus.paper1.totalMarks + ' अंक';
  document.getElementById('paper2Stats').textContent = syllabus.paper2.subjects.length + ' विषय | ' + syllabus.paper2.totalMarks + ' अंक';
}

function showPaperTopics() {
  showScreen('topicScreen');
  document.getElementById('topicScreenTitle').textContent = syllabus.paper1.name;
  const list = document.getElementById('topicList');
  list.innerHTML = '';

  const allQuestions = questionsData.filter(q => q.paper === 1);
  if (allQuestions.length > 0) {
    const allCard = document.createElement('div');
    allCard.className = 'topic-card';
    allCard.innerHTML = `
      <div class="topic-card-header">
        <span class="topic-icon">📚</span>
        <span class="topic-name">सभी प्रश्न (All Questions)</span>
        <span class="topic-count">${allQuestions.length} प्रश्न</span>
      </div>
    `;
    allCard.querySelector('.topic-card-header').onclick = () => startQuiz({ paper: 1, topicId: null, subtopicId: null });
    list.appendChild(allCard);
  }

  syllabus.paper1.topics.forEach(topic => {
    const topicQuestions = questionsData.filter(q => q.paper === 1 && q.topic === topic.id);
    if (topicQuestions.length === 0) return;

    const card = document.createElement('div');
    card.className = 'topic-card';

    let subtopicsHtml = '';
    topic.subtopics.forEach(sub => {
      const subCount = questionsData.filter(q => q.paper === 1 && q.topic === topic.id && q.subtopic === sub.id).length;
      if (subCount === 0) return;
      subtopicsHtml += `<button class="subtopic-chip" data-topic="${topic.id}" data-subtopic="${sub.id}">${sub.name} (${subCount})</button>`;
    });

    card.innerHTML = `
      <div class="topic-card-header">
        <span class="topic-icon">${topic.icon}</span>
        <span class="topic-name">${topic.shortName}</span>
        <span class="topic-count">${topicQuestions.length} प्रश्न</span>
      </div>
      ${subtopicsHtml ? `<div class="subtopic-list">${subtopicsHtml}</div>` : ''}
    `;

    card.querySelector('.topic-card-header').onclick = () => startQuiz({ paper: 1, topicId: topic.id, subtopicId: null });

    card.querySelectorAll('.subtopic-chip').forEach(chip => {
      chip.onclick = (e) => {
        e.stopPropagation();
        startQuiz({ paper: 1, topicId: chip.dataset.topic, subtopicId: chip.dataset.subtopic });
      };
    });

    list.appendChild(card);
  });
}

function showPaperSubjects() {
  showScreen('subjectScreen');
  const list = document.getElementById('subjectList');
  list.innerHTML = '';

  const p2Questions = questionsData.filter(q => q.paper === 2);

  if (p2Questions.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔜</div>
        <h3>जल्द आ रहा है</h3>
        <p>Paper 2 के प्रश्न जल्द ही जोड़े जाएंगे।</p>
        <button class="btn btn-outline" onclick="showHome()">वापस जाएँ</button>
      </div>
    `;
    return;
  }

  syllabus.paper2.subjects.forEach(subj => {
    const count = questionsData.filter(q => q.paper === 2 && q.topic === subj.id).length;
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subj-icon">${subj.icon}</div>
      <div class="subj-name">${subj.name}</div>
      <div class="subj-count">${count} प्रश्न</div>
    `;
    card.onclick = () => startQuiz({ paper: 2, topicId: subj.id, subtopicId: null });
    list.appendChild(card);
  });
}

function startQuiz(filter) {
  if (filter.paper === 1) {
    if (filter.topicId && filter.subtopicId) {
      currentQuestions = questionsData.filter(q => q.paper === 1 && q.topic === filter.topicId && q.subtopic === filter.subtopicId);
    } else if (filter.topicId) {
      currentQuestions = questionsData.filter(q => q.paper === 1 && q.topic === filter.topicId);
    } else {
      currentQuestions = questionsData.filter(q => q.paper === 1);
    }
  } else if (filter.paper === 2) {
    if (filter.topicId) {
      currentQuestions = questionsData.filter(q => q.paper === 2 && q.topic === filter.topicId);
    } else {
      currentQuestions = questionsData.filter(q => q.paper === 2);
    }
  } else {
    currentQuestions = [...questionsData];
  }

  if (currentQuestions.length === 0) return;

  currentQuestions.sort(() => Math.random() - 0.5);
  userAnswers = new Array(currentQuestions.length).fill(null);
  currentIndex = 0;
  answered = false;
  quizHistory = [];

  showScreen('quizScreen');
  document.getElementById('totalQ').textContent = currentQuestions.length;
  renderQuestion();
}

function getPaperLabel(paper) {
  return paper === 1 ? 'Paper 1' : 'Paper 2';
}

function getTopicLabel(topicId) {
  const topic = syllabus.paper1.topics.find(t => t.id === topicId);
  if (topic) return topic.shortName;
  const subject = syllabus.paper2.subjects.find(s => s.id === topicId);
  return subject ? subject.name : '';
}

function renderQuestion() {
  const q = currentQuestions[currentIndex];
  answered = false;

  document.getElementById('currentQ').textContent = currentIndex + 1;
  document.getElementById('qNumber').textContent = currentIndex + 1;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('quizPaperBadge').textContent = getPaperLabel(q.paper);
  document.getElementById('quizTopicBadge').textContent = getTopicLabel(q.topic);

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
