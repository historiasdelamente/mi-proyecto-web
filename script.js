// Preguntas del test de detección narcisista
const questions = [
    {
        id: 1,
        text: "¿Tu pareja se enfada cuando no recibes la atención que considera que merece?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 2,
        text: "¿Te hace sentir culpable por tus propios logros o éxitos?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 3,
        text: "¿Critica constantemente tus decisiones o forma de hacer las cosas?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 4,
        text: "¿Se niega a reconocer cuando comete errores o hace daño?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 5,
        text: "¿Te aísla de tus amigos o familiares?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 6,
        text: "¿Manipula situaciones para hacerte sentir que estás loco(a) o exagerando?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 7,
        text: "¿Habla excesivamente sobre sí mismo(a) y sus logros?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 8,
        text: "¿Te interrumpe cuando hablas o ignora lo que dices?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 9,
        text: "¿Usa información personal tuya en tu contra durante las discusiones?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 10,
        text: "¿Te hace sentir que eres afortunado(a) de estar con él/ella?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 11,
        text: "¿Cambia de tema cuando intentas hablar sobre tus sentimientos?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 12,
        text: "¿Te compara negativamente con otras personas?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 13,
        text: "¿Se enoja cuando no haces exactamente lo que él/ella quiere?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 14,
        text: "¿Te hace dudar de tu propia memoria o percepción de los eventos?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 15,
        text: "¿Espera que adivines sus necesidades sin comunicarlas claramente?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 16,
        text: "¿Te critica en público o delante de otras personas?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 17,
        text: "¿Reacciona con rabia cuando le das feedback o críticas constructivas?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 18,
        text: "¿Te hace sentir que tus emociones no son válidas o importantes?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 19,
        text: "¿Controla aspectos de tu vida como dinero, trabajo o decisiones personales?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    },
    {
        id: 20,
        text: "¿Sientes que tienes que cambiar tu personalidad para evitar conflictos?",
        options: ["Nunca", "Pocas veces", "A menudo", "Siempre"]
    }
];

let currentQuestionIndex = 0;
let answers = [];
let userData = {};

// Elementos del DOM
const dataForm = document.getElementById('dataForm');
const testSection = document.getElementById('testSection');
const resultsSection = document.getElementById('resultsSection');
const userDataForm = document.getElementById('userDataForm');
const questionContainer = document.getElementById('questionContainer');
const currentQuestionSpan = document.getElementById('currentQuestion');
const progressBar = document.getElementById('progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resultContent = document.getElementById('resultContent');

// Event Listeners
userDataForm.addEventListener('submit', handleUserDataSubmit);
prevBtn.addEventListener('click', previousQuestion);
nextBtn.addEventListener('click', nextQuestion);

// Manejar envío de datos del usuario
function handleUserDataSubmit(e) {
    e.preventDefault();
    
    // Recopilar datos del usuario
    userData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value
    };
    
    // Enviar datos a Google Drive (implementar después)
    saveUserData(userData);
    
    // Mostrar test
    dataForm.style.display = 'none';
    testSection.style.display = 'block';
    
    // Cargar primera pregunta
    loadQuestion();
}

// Cargar pregunta actual
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    
    questionContainer.innerHTML = `
        <div class="question">
            <h4>${question.text}</h4>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option-label">
                        <input type="radio" name="question${question.id}" value="${index}" 
                               ${answers[currentQuestionIndex] === index ? 'checked' : ''}>
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Actualizar contador y barra de progreso
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    
    // Mostrar/ocultar botones
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Ver Resultados' : 'Siguiente →';
    
    // Event listener para las opciones
    const radioButtons = questionContainer.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[currentQuestionIndex] = parseInt(e.target.value);
        });
    });
}

// Pregunta anterior
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

// Siguiente pregunta o mostrar resultados
function nextQuestion() {
    if (answers[currentQuestionIndex] === undefined) {
        alert('Por favor selecciona una respuesta antes de continuar.');
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

// Mostrar resultados
function showResults() {
    testSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Calcular puntuación
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 3; // Máximo posible
    const percentage = (totalScore / maxScore) * 100;
    
    let resultText, recommendations;
    
    if (percentage < 25) {
        resultText = `
            <div class="result-low">
                <h4>🟢 Riesgo Bajo (${Math.round(percentage)}%)</h4>
                <p>Basado en tus respuestas, es poco probable que estés en una relación con 
                una persona con rasgos narcisistas patológicos. Sin embargo, todas las 
                relaciones pueden beneficiarse de una comunicación saludable.</p>
            </div>
        `;
        recommendations = `
            <h5>Recomendaciones:</h5>
            <ul>
                <li>Continúa fortaleciendo tu comunicación en la relación</li>
                <li>Mantén tu red de apoyo social</li>
                <li>Practica el autocuidado y la autoestima saludable</li>
            </ul>
        `;
    } else if (percentage < 50) {
        resultText = `
            <div class="result-medium">
                <h4>🟡 Riesgo Moderado (${Math.round(percentage)}%)</h4>
                <p>Tus respuestas sugieren algunos patrones preocupantes en tu relación. 
                Es importante prestar atención a estas señales y considerar buscar apoyo.</p>
            </div>
        `;
        recommendations = `
            <h5>Recomendaciones:</h5>
            <ul>
                <li>Considera hablar con un terapeuta especializado en relaciones</li>
                <li>Documenta incidentes problemáticos</li>
                <li>Fortalece tu red de apoyo</li>
                <li>Lee el libro que te hemos enviado</li>
            </ul>
        `;
    } else if (percentage < 75) {
        resultText = `
            <div class="result-high">
                <h4>🟠 Riesgo Alto (${Math.round(percentage)}%)</h4>
                <p>Tus respuestas indican patrones significativos que coinciden con 
                comportamientos narcisistas. Es muy importante que busques apoyo profesional 
                y consideres tu seguridad emocional.</p>
            </div>
        `;
        recommendations = `
            <h5>Recomendaciones Urgentes:</h5>
            <ul>
                <li>Busca apoyo profesional inmediatamente</li>
                <li>Conecta con amigos y familia de confianza</li>
                <li>Considera crear un plan de seguridad emocional</li>
                <li>Lee nuestro libro de apoyo y sigue las estrategias</li>
                <li>Únete a grupos de apoyo para víctimas</li>
            </ul>
        `;
    } else {
        resultText = `
            <div class="result-critical">
                <h4>🔴 Riesgo Crítico (${Math.round(percentage)}%)</h4>
                <p>Tus respuestas sugieren que estás en una relación altamente tóxica con 
                patrones narcisistas severos. Tu bienestar emocional y posiblemente físico 
                está en riesgo. Es crucial que busques ayuda profesional inmediatamente.</p>
            </div>
        `;
        recommendations = `
            <h5>Acción Inmediata Requerida:</h5>
            <ul>
                <li><strong>Contacta una línea de crisis o violencia doméstica</strong></li>
                <li>Busca terapia especializada en trauma y abuso narcisista</li>
                <li>Crea un plan de seguridad con profesionales</li>
                <li>No te aísles - busca apoyo en tu red de confianza</li>
                <li>Considera opciones legales si hay abuso</li>
            </ul>
        `;
    }
    
    resultContent.innerHTML = `
        ${resultText}
        ${recommendations}
        <div class="important-note">
            <p><strong>Importante:</strong> Este test es una herramienta educativa y no 
            reemplaza el diagnóstico profesional. Si estás en peligro inmediato, 
            contacta servicios de emergencia.</p>
        </div>
    `;
    
    // Guardar resultados
    saveTestResults(totalScore, percentage);
}

// Función para guardar datos del usuario (conectar con Google Drive)
async function saveUserData(data) {
    try {
        const response = await fetch('http://localhost:5000/api/save-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Datos guardados exitosamente');
        } else {
            console.error('Error guardando datos:', result.error);
            // Mostrar mensaje de error al usuario si es necesario
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        // Continuar con el test aunque haya error de guardado
    }
}

// Función para guardar resultados del test
async function saveTestResults(score, percentage) {
    const results = {
        userData: userData,
        score: score,
        percentage: percentage,
        answers: answers,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('http://localhost:5000/api/save-test-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(results)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Resultados guardados exitosamente');
        } else {
            console.error('Error guardando resultados:', result.error);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Smooth scroll para navegación
function smoothScroll(elementId) {
    document.getElementById(elementId).scrollIntoView({
        behavior: 'smooth'
    });
}