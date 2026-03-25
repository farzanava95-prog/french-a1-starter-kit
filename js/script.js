// French Learning App - Premium A1 Starter Kit

class FrenchLearningApp {
    constructor() {
        this.currentAudio = null;
        this.currentSpeed = 1;
        this.isPlayingAll = false;
        this.currentAudioIndex = 0;
        this.quizScore = 0;
        this.currentQuestion = 0;
        this.quizQuestions = [];
        this.userAnswers = [];
        
        // French phrases data
        this.phrases = [
            {
                french: "Bonjour",
                english: "Hello/Good morning",
                phonetic: "bon-ZHOOR",
                tip: "Use before noon. Most common greeting.",
                category: "greeting"
            },
            {
                french: "Excusez-moi",
                english: "Excuse me",
                phonetic: "ex-kew-zay-MWAH",
                tip: "Polite way to get attention or apologize.",
                category: "politeness"
            },
            {
                french: "Parlez-vous anglais?",
                english: "Do you speak English?",
                phonetic: "par-lay voo on-GLAY",
                tip: "Essential for travelers. Always ask politely.",
                category: "question"
            },
            {
                french: "Oui",
                english: "Yes",
                phonetic: "wee",
                tip: "Simple but powerful. Use confidently.",
                category: "response"
            },
            {
                french: "Non",
                english: "No",
                phonetic: "noh",
                tip: "Equally important. Clear and direct.",
                category: "response"
            },
            {
                french: "Merci",
                english: "Thank you",
                phonetic: "mer-SEE",
                tip: "Always say this. Shows appreciation.",
                category: "politeness"
            },
            {
                french: "S'il vous plaît",
                english: "Please",
                phonetic: "see voo PLEH",
                tip: "Makes requests polite and respectful.",
                category: "politeness"
            },
            {
                french: "Je suis désolé(e)",
                english: "I'm sorry",
                phonetic: "zhuh swee day-zo-LAY",
                tip: "Add 'e' if you're female. Shows empathy.",
                category: "politeness"
            },
            {
                french: "Comment allez-vous?",
                english: "How are you? (formal)",
                phonetic: "koh-mahn tah-lay voo",
                tip: "Formal version. Use with strangers/elders.",
                category: "greeting"
            },
            {
                french: "Au revoir",
                english: "Goodbye",
                phonetic: "oh ruh-VWAHR",
                tip: "Formal goodbye. Use in any situation.",
                category: "farewell"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.renderPhrases();
        this.renderAudioCards();
        this.setupEventListeners();
        this.generateQuizQuestions();
    }
    
    renderPhrases() {
        const container = document.getElementById('phrasesScroll');
        container.innerHTML = '';
        
        this.phrases.forEach((phrase, index) => {
            const card = document.createElement('div');
            card.className = 'phrase-card';
            card.innerHTML = `
                <div class="phrase-french">${phrase.french}</div>
                <div class="phrase-english">${phrase.english}</div>
                <div class="phrase-phonetic">${phrase.phonetic}</div>
                <div class="phrase-tip">💡 ${phrase.tip}</div>
            `;
            container.appendChild(card);
        });
    }
    
    renderAudioCards() {
        const container = document.getElementById('audioCards');
        container.innerHTML = '';
        
        this.phrases.forEach((phrase, index) => {
            const card = document.createElement('div');
            card.className = 'audio-card';
            card.innerHTML = `
                <div class="audio-content">
                    <div class="phrase-info">
                        <div class="phrase-french-large">${phrase.french}</div>
                        <div class="phrase-english-small">${phrase.english}</div>
                        <div class="phonetic-badge">${phrase.phonetic}</div>
                    </div>
                    <button class="play-btn" data-index="${index}" onclick="app.playAudio(${index})">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="audio-visualizer" id="visualizer-${index}">
                    <div class="audio-bar"></div>
                    <div class="audio-bar"></div>
                    <div class="audio-bar"></div>
                    <div class="audio-bar"></div>
                    <div class="audio-bar"></div>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    setupEventListeners() {
        // Speed controls
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentSpeed = parseFloat(e.target.dataset.speed);
            });
        });
        
        // Play all button
        document.getElementById('playAllBtn').addEventListener('click', () => {
            this.togglePlayAll();
        });
    }
    
    playAudio(index) {
        // Stop current audio if playing
        if (this.currentAudio) {
            this.stopAudio();
        }
        
        const phrase = this.phrases[index];
        const playBtn = document.querySelector(`[data-index="${index}"]`);
        const visualizer = document.getElementById(`visualizer-${index}`);
        
        // Use Web Speech API for pronunciation
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(phrase.french);
            utterance.lang = 'fr-FR';
            utterance.rate = this.currentSpeed;
            utterance.pitch = 1;
            
            // Update UI
            playBtn.classList.add('playing');
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            visualizer.style.display = 'flex';
            
            utterance.onend = () => {
                this.stopAudio();
                if (this.isPlayingAll) {
                    this.currentAudioIndex++;
                    if (this.currentAudioIndex < this.phrases.length) {
                        setTimeout(() => this.playAudio(this.currentAudioIndex), 500);
                    } else {
                        this.isPlayingAll = false;
                        document.getElementById('playAllBtn').innerHTML = '<i class="fas fa-play"></i> Play All';
                    }
                }
            };
            
            this.currentAudio = utterance;
            speechSynthesis.speak(utterance);
        } else {
            // Fallback for browsers without speech synthesis
            alert('Audio pronunciation not supported in this browser. Please use Chrome, Safari, or Edge.');
        }
    }
    
    stopAudio() {
        if (this.currentAudio) {
            speechSynthesis.cancel();
            const index = this.currentAudioIndex;
            const playBtn = document.querySelector(`[data-index="${index}"]`);
            const visualizer = document.getElementById(`visualizer-${index}`);
            
            if (playBtn) {
                playBtn.classList.remove('playing');
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
            if (visualizer) {
                visualizer.style.display = 'none';
            }
            
            this.currentAudio = null;
        }
    }
    
    togglePlayAll() {
        const playAllBtn = document.getElementById('playAllBtn');
        
        if (this.isPlayingAll) {
            this.isPlayingAll = false;
            this.stopAudio();
            playAllBtn.innerHTML = '<i class="fas fa-play"></i> Play All';
        } else {
            this.isPlayingAll = true;
            this.currentAudioIndex = 0;
            playAllBtn.innerHTML = '<i class="fas fa-stop"></i> Stop All';
            this.playAudio(0);
        }
    }
    
    generateQuizQuestions() {
        this.quizQuestions = [];
        
        // Create multiple choice questions
        for (let i = 0; i < this.phrases.length; i++) {
            const phrase = this.phrases[i];
            const answers = [phrase.english];
            
            // Add 3 wrong answers from other phrases
            const wrongAnswers = this.phrases
                .filter(p => p.english !== phrase.english)
                .map(p => p.english)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
            
            answers.push(...wrongAnswers);
            answers.sort(() => Math.random() - 0.5);
            
            this.quizQuestions.push({
                question: `What does "${phrase.french}" mean?`,
                correctAnswer: phrase.english,
                answers: answers,
                type: 'multiple-choice'
            });
        }
    }
    
    startQuiz() {
        this.currentQuestion = 0;
        this.quizScore = 0;
        this.userAnswers = [];
        
        document.getElementById('quiz-intro').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';
        
        this.renderQuestion();
    }
    
    renderQuestion() {
        const question = this.quizQuestions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quizQuestions.length) * 100;
        
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('questionNumber').textContent = `Question ${this.currentQuestion + 1} of ${this.quizQuestions.length}`;
        document.getElementById('questionText').textContent = question.question;
        
        const answersGrid = document.getElementById('answersGrid');
        answersGrid.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.onclick = () => this.selectAnswer(answer);
            answersGrid.appendChild(button);
        });
        
        document.getElementById('feedback').innerHTML = '';
    }
    
    selectAnswer(selectedAnswer) {
        const question = this.quizQuestions[this.currentQuestion];
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        this.userAnswers.push({
            question: question.question,
            selectedAnswer: selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect
        });
        
        // Update UI
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
        feedback.innerHTML = `
            <i class="fas fa-${isCorrect ? 'check' : 'times'}"></i>
            ${isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${question.correctAnswer}`}
        `;
        
        if (isCorrect) {
            this.quizScore++;
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.quizQuestions.length) {
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        document.getElementById('quiz').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        
        // Update score display
        const scoreElement = document.getElementById('scoreNumber');
        const levelElement = document.getElementById('levelText');
        const levelBadge = document.getElementById('levelBadge');
        
        scoreElement.textContent = `${this.quizScore}/${this.quizQuestions.length}`;
        
        // Determine level based on score
        let level, levelIcon;
        if (this.quizScore <= 3) {
            level = 'Beginner';
            levelIcon = 'fa-seedling';
            levelBadge.style.background = '#EF4444';
        } else if (this.quizScore <= 7) {
            level = 'Improving';
            levelIcon = 'fa-chart-line';
            levelBadge.style.background = '#F59E0B';
        } else {
            level = 'Strong Start';
            levelIcon = 'fa-trophy';
            levelBadge.style.background = '#10B981';
        }
        
        levelElement.textContent = level;
        levelBadge.innerHTML = `<i class="fas ${levelIcon}"></i> <span>${level}</span>`;
        
    }
    

}

// Utility functions
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function startQuiz() {
    app.startQuiz();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FrenchLearningApp();
});
