<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Growth Assessment</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">

    <script src="https://cdn.jsdelivr.net/npm/ipaddr.js@2.0.1/lib/ipaddr.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <style>
        :root {
            --golden-gradient: linear-gradient(135deg, #e8be35, #ecd899 , #e8be35, #664c18);
            --grey-gradient: linear-gradient(90deg, #484747, #7c7c7ca5, #303030);
            --grey-gradient-reverse: linear-gradient(90deg, #484747, #303030,#303030, #484747); /* Reversed grey gradient */
            --primary-color: #ba942b;
            --secondary-color: #4f4f4f;
            --text-color: #ecf0f1;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: #1a1b26;
            color: var(--text-color);
        }

        .container {
            max-width: 100%;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }

        .quiz-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 10px;
        }

        .question-card {
            background: var(--grey-gradient);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            opacity: 1;
            position: relative;
            transform: translateY(20px);
            transition: opacity 0.5s, transform 0.5s;
            z-index: 10; /* Ensure it stays above other content */
        }

        .question-card.active {
            opacity: 1;
            transform: translateY(0);
        }

        .question-title {
            
        position: sticky;
        top: 0;
        background: #1a1b26c2; /* Use the golden gradient as the background */
        padding: 10px;
        margin-bottom: 20px;
        z-index: 10; /* Ensure it stays above other content */
        font-size: 1.3rem;
        border-radius: 10px; /* Add rounded corners */
        color: goldenrod; /* Set text color to contrast with the background */
        text-align: center; /* Center the text */
    }

        .options-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }

        .option-button {
            background: transparent;
            border: 2px solid var(--primary-color);
            color: var(--text-color);
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: left;
            font-size: 1rem;
            font-weight: bold; /* Make the text bold on hover */

        }

        .option-button:hover {
            background: var(--golden-gradient);
            color: #1a1b26;
            
        }

        .progress-bar {
            height: 4px;
            background: var(--secondary-color);
            border-radius: 2px;
            margin: 20px 0;
            overflow: hidden;
        }

        .progress {
            height: 100%;
            background: var(--golden-gradient);
            width: 0%;
            transition: width 0.3s ease;
        }

        .image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .image-option {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .image-frame {
            width: 100%;
            padding-top: 100%; /* This creates a 1:1 aspect ratio */
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid transparent;
            transition: all 0.3s;
        }

        .image-frame img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-option .image-text {
            margin-top: 10px;
            color: rgb(186, 186, 186);
            font-size: 0.9rem;
            font-weight: bold;
            text-align: center;
            transition: color 0.3s, background 0.3s; /* Add background transition */
            background: transparent; /* Ensure background is transparent by default */
            padding: 5px; /* Add padding to match the hover effect */
            border-radius: 5px; /* Add border-radius to match the hover effect */
        }

        .image-option:hover .image-text {
            background: var(--golden-gradient); /* Change background on hover */
            border-radius: 10px;
            width: 100%; /* Extend width to full width of the parent */
            color: #1a1b26 !important; /* Force the text color to black on hover */

            

        }

        .result-card {
            text-align: center;
        }

        .result-description {
            margin: 20px 0;
            font-weight: bold;
            line-height: 1.6;
            color: rgb(255, 255, 255); /* Set the text color to golden */
            text-shadow: 0 0 10px rgba(218,165,32, 0.8), 0 0 20px rgb(247, 193, 57), 0 0 30px rgba(250, 223, 118, 0.689); /* Create the glow effect */
        }

        .email-form {
            margin-top: 30px;
            padding: 0 20px;  /* Add padding to match card padding */
        }

        .email-input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;  /* Changed from 10px 10px to 10px 0 */
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            background: transparent;
            color: var(--text-color);
            font-size: 1rem;
            box-sizing: border-box;  /* Include padding and border in the width calculation */
        }

        .submit-button {
            background: var(--golden-gradient);
            color: #1a1b26;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 15px;
            transition: transform 0.2s;
            width: 100%;  /* Make button full width */
            box-sizing: border-box;  /* Include padding in the width calculation */
        }

        .submit-button:hover {
            transform: translateY(-2px);
        }

        .start-button {
            background: var(--golden-gradient);
            color: #1a1b26;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 15px;
            transition: transform 0.2s;
            width: 100%;
            max-width: 300px;
            box-sizing: border-box;
            font-weight: bold;
        }

        .start-button:hover {
            transform: translateY(-2px);
        }

        .intro-text {
            margin: 20px 0;
            line-height: 1.6;
            font-size: 1.1rem;
        }

        .intro-card {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

    



                                        /* Additional styles for very small screens */
                                        @media (max-width: 320px) {
                                            .question-card {
                                                padding: 10px;
                                            }

                                            .question-title {
                                                font-size: 1rem;
                                            }

                                            .option-button, .email-input, .submit-button {
                                                padding: 10px;
                                                font-size: 0.8rem;
                                            }
                                        }

                                        /* Styles for larger screens, to ensure proper layout */
                                        @media (min-width: 769px) {
                                            .quiz-container {
                                                max-width: 800px; /* Increased from 600px */
                                                margin: 0 auto;
                                            }

                                            .question-card {
                                                padding: 30px; /* Increased padding for wider cards */
                                            }

                                            .image-grid {
                                                grid-template-columns: repeat(2, 1fr);
                                                gap: 20px; /* Increased gap for more space between images */
                                            }

                                            .image-frame {
                                                width: 100%;
                                                padding-top: 60%; /* This creates a 6:10 aspect ratio (60% of width) */
                                                max-width: none; /* Remove the max-width constraint */
                                            }

                                            .image-text {
                                                font-size: 1rem; /* Slightly larger font for wider screens */
                                            }

                                            /* Make image cards bigger and text cards smaller */
                                            .question-card.image-question {
                                                padding: 40px;
                                            }

                                            .question-card.text-question {
                                                max-width: 600px;
                                                margin-left: auto;
                                                margin-right: auto;
                                            }

                                            /* Restore hover effects */
                                            .image-option:hover .image-frame {
                                                border-color: var(--primary-color);
                                            }

                                            .image-option:hover .image-text {
                                                color: var(--primary-color);
                                            }

                                            /* Style for result image */
                                            .result-image {
                                                max-width: 100%;
                                                height: auto;
                                                margin: 20px 0;
                                                border-radius: 10px;
                                            }
                                        }

                                        /* Additional styles for very small screens */
                                        @media (max-width: 320px) {
                                            .image-frame {
                                                max-width: 120px; /* Adjust this value as needed */
                                            }
                                        }

    </style>


<style>
                    /* Adjust font size for MOBILE */
                @media (max-width: 768px) {



                    .disable-hover {
                        pointer-events: none !important;
                    }

                    .disable-hover * {
                        pointer-events: none !important;
                                    }


                .container {
                    padding: 10px;
                }

                .quiz-container {
                    max-width: 100%;
                    padding: 10px;
                }

                .question-card {
                    padding: 15px;
                    margin-bottom: 15px;
                }

                .question-title {
                    font-size: 1.1rem;
                    margin-bottom: 15px;
                    font-weight: bold;
                }

                .options-grid {
                    gap: 10px;
                }

                .option-button {
                    padding: 12px;
                    font-size: 0.9rem;
                }

                .image-grid {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .image-option {
                    max-width: 100%;
                    width: 100%;
                    border: 2px solid var(--primary-color);
                    border-radius: 10px;
                    padding: 10px;
                }

                .image-frame {
                    width: inherit;
                    padding-top: 100%; /* Maintain the 1:1 aspect ratio */
                }

                .result-image {
                    max-height: 300px;
                     /* Adjust this value as needed */
    }               

                .image-option.selected .image-frame,
                .option-button.selected {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 12px var(--primary-color);
                }

                .image-option.selected .image-text,
                .option-button.selected {
                    color: #1a1b26 !important;
                    font-weight: bold;
                }

                /* Add transition for smoother visual feedback */
                .image-option,
                .option-button {
                    transition: all 0.3s ease;
                }

                .image-text {
                    font-size: 0.8rem;
                }

                .email-input,
                .submit-button {
                    font-size: 0.9rem;
                }



        }

</style>

</head>
<body>
    <div class="container">
        <div class="quiz-container">
            <div class="progress-bar">
                <div class="progress" id="progress"></div>
            </div>
            <div id="questionContainer"></div>
        </div>
    </div>

    <script>
        const questions = [
            {
                id: 1,
                title: "How much of your income is automatically saved/invested?",
                type: "image",
                options: [
                    { img: "/images/empty-wallet.jpg", text: "I live paycheck-to-paycheck.", score: { level2: 2, level4: 1, level5: 1 } },
                    { img: "/images/piggy-bank.jpg", text: "I save leftovers manually.", score: { level2: 1, level3: 2, level4: 2 } },
                    { img: "/images/auto-invest.jpg", text: "10-20% automated savings.", score: { level3: 3, level4: 1 } },
                    { img: "/images/passive-income.jpg", text: "Assets fund my lifestyle.", score: { level1: 3, level5: 2 } }
                ]
            },
            {
                id: 2,
                title: "When did you last monetize a new skill?",
                type: "text",
                options: [
                    { text: "I use school-era skills.", score: { level4: 3, level5: 1 } },
                    { text: "Learning but not applying.", score: { level2: 1, level3: 2, level5: 2 } },
                    { text: "Earned $500+ recently.", score: { level1: 3, level3: 1 } },
                    { text: "Built a revenue-generating tool.", score: { level2: 3, level3: 2, level4: 1 } }
                ]
            },
            {
                id: 3,
                title: "Who did you last ask for advice?",
                type: "text",
                options: [
                    { text: "Reddit/YouTube comments.", score: { level3: 1, level5: 3 } },
                    { text: "A colleague at work.", score: { level2: 2, level3: 3, level4: 2 } },
                    { text: "Someone ahead of me.", score: { level1: 2, level2: 1, level3: 2 } },
                    { text: "A niche industry leader.", score: { level4: 3, level5: 1 } }
                ]
            },
            {
                id: 4,
                title: "How long to launch a simple MVP?",
                type: "text",
                options: [
                    { text: "Still ideating.", score: { level2: 2 } },
                    { text: "Need 6+ months to plan.", score: { level3: 1, level4: 2, level5: 1 } },
                    { text: "Could build in 30 days.", score: { level1: 3, level3: 2 } },
                    { text: "Shipped 3+ projects.", score: { level2: 1, level3: 3, level5: 2 } }
                ]
            },
            {
                id: 5,
                title: "How many days/week do you exercise?",
                type: "text",
                options: [
                    { text: "0-1 days.", score: { level4: 3, level5: 1 } },
                    { text: "2-3 days inconsistently.", score: { level2: 1, level3: 1, level5: 3 } },
                    { text: "4-5 days consistently.", score: { level1: 3, level3: 2 } },
                    { text: "6-7 days + nutrition tracking.", score: { level2: 3, level3: 1, level4: 1 } }
                ]
            },
            {
                id: 6,
                title: "How do people find you online?",
                type: "image",
                options: [
                    { img: "/images/no-online-presence.jpg", text: "They don't.", score: { level2: 2, level5: 2 } },
                    { img: "/images/inconsistent-posting.jpg", text: "I post inconsistently.", score: { level3: 2, level4: 3, level5: 1 } },
                    { img: "/images/audience-building.jpg", text: "Build an audience.", score: { level1: 3, level3: 1 } },
                    { img: "/images/community-leader.jpg", text: "Lead a niche community.", score: { level4: 2, level5: 2 } }
                ]
            },
            {
                id: 7,
                title: "How do you handle financial risk?",
                type: "text",
                options: [
                    { text: "Avoid all risk.", score: { level4: 2, level5: 2 } },
                    { text: "Only safe investments.", score: { level3: 1, level4: 1, level5: 3 } },
                    { text: "Invest 10-20% in growth.", score: { level2: 3, level3: 2 } },
                    { text: "Back high-risk ventures.", score: { level1: 3, level4: 1 } }
                ]
            },
            {
                id: 8,
                title: "Where does your energy go weekly?",
                type: "text",
                options: [
                    { text: "Survival + distractions.", score: { level2: 3 } },
                    { text: "Busywork, little progress.", score: { level3: 1, level4: 3 } },
                    { text: "Focused on key goals.", score: { level3: 3, level5: 3 } },
                    { text: "Systems work for me.", score: { level1: 3, level5: 2 } }
                ]
            },
            {
                id: 9,
                title: "How will people remember your work?",
                type: "text",
                options: [
                    { text: "Just did my job.", score: { level2: 2, level5: 2 } },
                    { text: "Helped a few people.", score: { level3: 2, level4: 1, level5: 3 } },
                    { text: "Built a lasting community.", score: { level1: 3, level3: 1 } },
                    { text: "Changed an industry.", score: { level4: 3, level5: 1 } }
                ]
            },
            {
                id: 10,
                title: "How do you use AI tools?",
                type: "image",
                options: [
                    { img: "/images/traditional-methods.jpg", text: "I don't – prefer old ways.", score: { level2: 2, level4: 2 } },
                    { img: "/images/basic-ai-use.jpg", text: "For simple tasks.", score: { level3: 2, level5: 3 } },
                    { img: "/images/workflow-automation.jpg", text: "Automate 30%+ of work.", score: { level1: 3, level4: 2 } },
                    { img: "/images/advanced-ai-systems.jpg", text: "Setup AI agents for my niche.", score: { level3: 1, level4: 2, level5: 2 } }
                ]
            },
            {
                id: 11,
                title: "How do you handle sudden change?",
                type: "text",
                options: [
                    { text: "Overwhelmed and stuck.", score: { level4: 3, level5: 1 } },
                    { text: "Need time to adjust.", score: { level3: 3, level5: 3 } },
                    { text: "Pivot quickly.", score: { level1: 3, level3: 1 } },
                    { text: "Thrive in chaos.", score: { level2: 3, level4: 1 } }
                ]
            },
            {
                id: 12,
                title: "What does success look like in 5 years?",
                type: "text",
                options: [
                    { text: "Stable job, no debt.", score: { level3: 2, level5: 3 } },
                    { text: "Profitable side hustle.", score: { level2: 2, level3: 3, level4: 2 } },
                    { text: "Scalable business empire.", score: { level1: 3, level4: 2 } },
                    { text: "Industry-defining legacy.", score: { level4: 2, level5: 2 } }
                ]
            }
        ];

        let currentQuestion = 0;
let scores = {
    level1: 0, level2: 0, level3: 0, level4: 0, level5: 0
};

let userIP = '';
let userCountry = '';
let selectedTexts = [];
let baserowRowId = null; // To store the Baserow row ID

function renderIntroPage() {
    // Check if user has already taken the quiz
    if (localStorage.getItem('quizCompleted')) {
        showAlreadyCompletedMessage();
        return;
    }
    
    const container = document.getElementById('questionContainer');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'question-card';

    const title = document.createElement('h1');
    title.className = 'question-title';
    title.textContent = "Personal Growth Assessment: Discover Your Path";
    card.appendChild(title);

    const description = document.createElement('p');
    description.className = 'result-description';
    description.innerHTML = "<br>Find out which of the five growth levels best describes your current journey.<br><br><br>This assessment will help identify your strengths and next steps for advancement.<br><br>Ready to discover where you stand?";
    description.style.textAlign = 'center'; // Center the text
    card.appendChild(description);

    const startButton = document.createElement('button');
    startButton.className = 'submit-button';
    startButton.textContent = "Start Quiz";
    startButton.onclick = startQuiz; // Use the startQuiz function
    card.appendChild(startButton);

    card.style.textAlign = 'center'; // Center the content in the card
    container.appendChild(card);
}

// Function to show message when user has already completed the quiz
function showAlreadyCompletedMessage() {
    const container = document.getElementById('questionContainer');
    const card = document.createElement('div');
    card.className = 'question-card result-card active';
    
    card.innerHTML = `
        <h2 class="question-title">You've Already Completed This Assessment</h2>
        <p class="result-description">Our records show you've already taken this assessment.</p>
        <p class="result-description"> Each person can only take the assessment once to ensure accurate results.</p>
        <p class="result-description">Thank you for your participation.</p>
        `;
    
    container.innerHTML = '';
    container.appendChild(card);
    
    // Update progress bar to 100%
    const progress = document.getElementById('progress');
    progress.style.width = '100%';
}

function renderQuestion(question) {
    const container = document.getElementById('questionContainer');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'question-card';

    const title = document.createElement('h2');
    title.className = 'question-title';
    title.textContent = question.title;
    card.appendChild(title);

    if (question.type === 'image') {
        const grid = document.createElement('div');
        grid.className = 'image-grid';
        question.options.forEach(option => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-option';

            const imgFrame = document.createElement('div');
            imgFrame.className = 'image-frame';
            const img = document.createElement('img');
            img.src = option.img;
            img.alt = option.text;
            imgFrame.appendChild(img);
            imgContainer.appendChild(imgFrame);

            const text = document.createElement('span');
            text.className = 'image-text';
            text.textContent = option.text;
            imgContainer.appendChild(text);

            imgContainer.onclick = (e) => handleSelection(e, option.score, option.text);
            grid.appendChild(imgContainer);
        });
        card.appendChild(grid);
    } else {
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'options-grid';
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option.text;
            button.onclick = (e) => handleSelection(e, option.score, option.text);
            optionsGrid.appendChild(button);
        });
        card.appendChild(optionsGrid);
    }

    container.appendChild(card);
    updateProgress();
}

function handleSelection(event, score, text) {
    const element = event.currentTarget;
    element.classList.add('selected');
    disableOptions();

    setTimeout(() => {
        element.classList.remove('selected');
        selectOption(score, text);
    }, 300);
}

function disableOptions() {
    const options = document.querySelectorAll('.option-button');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

function enableOptions() {
    const options = document.querySelectorAll('.option-button');
    options.forEach(option => {
        option.style.pointerEvents = 'auto';
    });
}

function selectOption(score, text) {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
        selectedTexts.push({ question: questions[currentQuestion].title, answer: text });
        Object.keys(score).forEach(key => {
            scores[key] += score[key];
        });
        currentQuestion++;
        if (currentQuestion < questions.length) {
            renderQuestion(questions[currentQuestion]);
        } else {
            showResults();
        }
    } else {
        console.error('Error: currentQuestion is out of bounds:', currentQuestion);
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const totalSteps = questions.length + 1; // +1 for the "Thank You" page
    const percentage = (currentQuestion / totalSteps) * 100;
    progress.style.width = `${percentage}%`;
}

function showResults() {
    const container = document.getElementById('questionContainer');
    const highestScore = Object.entries(scores).reduce((a, b) => 
        (a[1] > b[1] ? a : b)
    );
    
    const resultType = highestScore[0];
    const resultContent = getResultContent(resultType);
    
    const card = document.createElement('div');
    card.className = 'question-card result-card active';
    
    let cardContent = `
        <h2 class="question-title">${resultContent.title}</h2>
        <p class="result-description">${resultContent.description}</p>
    `;

    if (resultType !== 'level1') {
        cardContent += `
            <div class="email-form">
                <p>If you need help with the ${resultContent.title} level, you can get a personalized action plan based on your assessment!</p>
                <input type="email" id="email" placeholder="Enter your email address" class="email-input">
                <button onclick="submitResults()" class="submit-button">I want to receive more information</button>
            </div>
        `;
    }
    
    card.innerHTML = cardContent;
   
    container.innerHTML = '';
    container.appendChild(card);

    // Update progress bar to 90%
    const progress = document.getElementById('progress');
    progress.style.width = '90%';
    
    // Trigger celebratory confetti animation for profile reveal
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
    });
    
    // Add more confetti after a small delay for a better effect
    setTimeout(() => {
        confetti({
            particleCount: 70,
            angle: 60,
            spread: 60,
            origin: { x: 0 }
        });
        
        confetti({
            particleCount: 70,
            angle: 120,
            spread: 60,
            origin: { x: 1 }
        });
    }, 500);

    // Send first request to Baserow
    sendFirstRequest();
}

const resultContents = {
    level1: {
        title: "The Crisis Navigator",
        description: `
            <h2>Navigating the Day-to-Day: Finding Room to Grow</h2>
            <h3>You Might Recognize This Stage If:</h3>
            <p>Your primary focus is on meeting immediate needs, often feeling like you're just keeping things afloat.</p>
            <p>Big changes or risks feel daunting—stability takes precedence over long-term goals.</p>
            <p>Your network offers social support but lacks mentors or peers focused on growth, leaving you feeling isolated in your ambitions.</p>
            
            <img src="/images/profile-crisis.jpg" alt="profile-crisis" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 10px;">
            
            <h3>Trajectory If Things Stay the Same:</h3>
            <p>Sustained financial pressure, making it harder to get ahead or handle unexpected setbacks.</p>
            <p>Skills may stagnate, leaving you vulnerable to shifts in the job market.</p>
            <p>Opportunities for growth might feel perpetually out of reach, reinforcing a sense of being stuck.</p>
            
            <h3>Key Steps to Build Momentum:</h3>
            <p><strong>Automate a Small Step:</strong> Set up a tiny automatic savings transfer (e.g., $20/month). The habit matters more than the amount.</p>
            <p><strong>Invest 10 Minutes Daily:</strong> Learn something new via free resources (YouTube, podcasts).</p>
            <p><strong>Expand Your Circle Digitally:</strong> Join online communities (Reddit, Discord) to break isolation and discover new ideas.</p>
            
            <h3>Next Challenge:</h3>
            <p>As you create breathing room, the shift from reactive to proactive planning begins. Avoid over-planning without action.</p>
            
            <h3>Encouragement:</h3>
            <p>"Awareness is your advantage. Small, consistent steps build agency—many successful people started right where you are."</p>
        `,
    },
    level2: {
        title: "The Ready Dreamer",
        description: `
            <h2>Bridging the Gap Between Ideas and Action</h2>
            <h3>You Might Recognize This Stage If:</h3>
            <p>You have detailed plans but struggle to launch ("I need more research" or "It's not perfect yet").</p>
            <p>Efforts are inconsistent—bursts of activity followed by pauses—preventing traction.</p>
            <p>You default to "safe" paths (e.g., stable jobs) despite bigger ambitions.</p>
            
            <img src="/images/profile-ready.jpg" alt="profile-ready" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 10px;">
            
            <h3>Trajectory If Things Stay the Same:</h3>
            <p>Regret as others act on similar ideas while yours remain unrealized.</p>
            <p>Slow erosion of confidence from stalled projects.</p>
            <p>Linear growth instead of exponential leaps.</p>
            
            <h3>Key Steps to Gain Traction:</h3>
            <p><strong>Launch a 'Good Enough' MVP:</strong> Use no-code tools to test an idea in 7–14 days.</p>
            <p><strong>Time-Bound Decisions:</strong> Give yourself 48 hours to commit to actions (e.g., sending a pitch).</p>
            <p><strong>Monetize One Skill:</strong> Offer freelance services (even at $5/hour) to validate demand.</p>
            
            <h3>Next Challenge:</h3>
            <p>Transitioning from planning to consistent execution. Beware of burnout from scattered efforts.</p>
            
            <h3>Encouragement:</h3>
            <p>"Your ability to plan is a strength—now unleash it through action. Progress beats perfection."</p>
        `,
    },
    level3: {
        title: "The Consistent Implementer",
        description: `
            <h2>Building Momentum: Turning Action into Results</h2>
            <h3>You Might Recognize This Stage If:</h3>
            <p>You have moved past major hesitation and are consistently taking action, executing on ideas or skills.</p>
            <p>You're seeing tangible results—first clients, initial sales, completed projects—but it requires significant personal effort and feels like a constant juggle.</p>
            <p>Your focus is primarily on doing the work and delivering; less time is spent on optimizing processes or long-term strategy.</p>
            <p>Learning happens rapidly through trial-and-error; you're gaining real-world experience but might lack clear systems.</p>
            
            <img src="/images/profile-consistent.jpg" alt="profile-consistent" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 10px;">
            
            <h3>Trajectory If Things Stay the Same:</h3>
            <p>Efforts yield results, but income or impact scales directly (and often linearly) with the hours you put in.</p>
            <p>High risk of burnout due to sustained, high-effort execution without efficiency gains ("busy trap").</p>
            <p>Potential to get stuck as a high-performing "technician" or freelancer, unable to step back and work on the venture/career instead of just in it.</p>
            <p>Success feels directly tied to your constant presence and effort, making growth fragile and vacations difficult.</p>
            
            <h3>Key Steps to Build Sustainable Effort:</h3>
            <p><strong>Identify & Amplify What Works (80/20):</strong> Analyze your actions. Which 20% are driving 80% of your results? Double down on those high-leverage activities and start pruning low-impact tasks.</p>
            <p><strong>Seek Direct Feedback & Iterate:</strong> Actively solicit feedback from clients, customers, or stakeholders on your output. Use this data to quickly refine your offering or process for better results.</p>
            <p><strong>Document One Core Process:</strong> Choose one repeatable task crucial to your results (e.g., client onboarding, content creation steps) and simply write down the steps. This is the first move towards future systemization or delegation.</p>
            <p><strong>Implement Basic Energy Management:</strong> Block specific time for focused work. Learn to say "no" to distractions or low-value demands. Protect your capacity to execute consistently.</p>
            
            <h3>Next Challenge:</h3>
            <p>Recognizing that simply working harder isn't the path forward. The next step involves shifting from doing everything yourself to building leverage through basic systems, optimization, and potentially initial delegation to escape the time-for-money trap.</p>
            
            <h3>Encouragement:</h3>
            <p>"You're making things happen—the proof is in the results! This consistent action builds undeniable momentum and real-world validation. Now, it's time to refine that effort for sustainable growth."</p>
        `,
    },
    level4: {
        title: "The Action-Taking Optimizer",
        description: `
            <h2>From Hustle to System: Scaling Your Success</h2>
            <h3>You Might Recognize This Stage If:</h3>
            <p>You have monetized skills or side hustles but lack systems to scale.</p>
            <p>Time is your bottleneck (trading hours for dollars).</p>
            <p>Growth feels fragile (e.g., client-dependent income).</p>
            
            <img src="/images/profile-action-taker.jpg" alt="profile-action-taker" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 10px;">
            
            <h3>Trajectory If Things Stay the Same:</h3>
            <p>Income plateaus despite hard work.</p>
            <p>Burnout from juggling too many roles.</p>
            <p>Missed opportunities for larger impact.</p>
            
            <h3>Key Steps to Build Leverage:</h3>
            <p><strong>Delegate/ Automate:</strong> Hire a VA ($5/hour) for repetitive tasks.</p>
            <p><strong>Productize Services:</strong> Turn expertise into a course or SaaS tool.</p>
            <p><strong>Build an Audience:</strong> Post daily for 30 days to attract opportunities.</p>
            
            <h3>Next Challenge:</h3>
            <p>Shifting from doing to leading. Complexity replaces hustle.</p>
            
            <h3>Encouragement:</h3>
            <p>"You're creating real value! Now design systems to scale beyond your time."</p>
        `,
        },
    level5: {
        title: "The Entrepreneurial Scaler",
        description: `
            <h2>Scaling Impact: Building Legacy Systems</h2>
            <h3>You Might Recognize This Stage If:</h3>
            <p>Your assets/systems generate income with minimal direct effort.</p>
            <p>Your focus shifts to legacy, industry influence, or values-aligned growth.</p>
            <p>Few peers understand your challenges, leading to professional isolation.</p>
            
            <img src="/images/profile-entrepreneur.jpg" alt="profile-entrepreneur" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 10px;">
            
            <h3>Trajectory If Things Stay the Same:</h3>
            <p>Complacency ("good enough") vs. continued innovation.</p>
            <p>Misalignment between scale and core values.</p>
            <p>Insulation from emerging trends.</p>
            
            <h3>Key Steps for Sustained Growth:</h3>
            <p><strong>Mentor Others:</strong> Teaching refines your own mastery.</p>
            <p><strong>Invest in R&D:</strong> Allocate 10% of revenue and time to innovation.</p>
            <p><strong>Schedule Reflection:</strong> Quarterly retreats to reassess strategy.</p>
            
            <h3>Next Challenge:</h3>
            <p>Balancing impact with sustainability in dynamic markets.</p>
            
            <h3>Encouragement:</h3>
            <p>"You've built something significant—now refine it, inspire others, and amplify your impact."</p>
        `,
        
    }
};

function getResultContent(type) {
    return resultContents[type];
}

async function sendFirstRequest() {
    const highestScore = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    const resultContent = getResultContent(highestScore);
    const formattedAnswers = selectedTexts.map(item => `${item.question}:${item.answer}`).join('\n');
    
    // Convert HTML to plain text by removing HTML tags
    const plainTextDescription = resultContent.description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim();                  // Trim whitespace
    
    // Determine user level based on result type
    const userLevel = (highestScore === 'level1' || highestScore === 'level2') ? 'beginner' : 'advanced';
    
    const payload = {
        IP: userIP || 'unknown',
        COUNTRY: userCountry || 'unknown',
        RESULT: resultContent.title,
        ANSWERS: formattedAnswers,
        FULLRESULT: plainTextDescription,
        USER_LEVEL: userLevel
    };

    try {
        const response = await fetch('/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            baserowRowId = data.id || 'temp-id'; // Store the Baserow row ID with fallback
            console.log('Quiz results successfully submitted');
            
            // Mark quiz as completed in localStorage
            localStorage.setItem('quizCompleted', 'true');
            localStorage.setItem('quizCompletedDate', new Date().toISOString());
        } else {
            console.error('Server response not OK:', response.status);
            // Set a temporary ID to avoid null errors
            baserowRowId = 'temp-id';
        }
    } catch (error) {
        console.error('Error in sendFirstRequest:', error);
        // Set a temporary ID to avoid null errors
        baserowRowId = 'temp-id';
    }
}

async function submitResults() {
    const email = document.getElementById('email').value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    // Check if we have a valid baserowRowId
    if (!baserowRowId || baserowRowId === 'temp-id') {
        // If no valid ID, just show thank you page without API call
        showThankYou();
        console.log('Skipping email update due to missing row ID');
        return;
    }

    try {
        const payload = {
            EMAIL: email
        };

        const response = await fetch(`/api/update-quiz/${baserowRowId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showThankYou();
        } else {
            console.error('Failed to update email, but continuing to thank you page');
            showThankYou(); // Still show thank you page even if update fails
        }
    } catch (error) {
        console.error('Error:', error);
        // Still show thank you page instead of error alert
        showThankYou();
    }
}

function showThankYou() {
    const container = document.getElementById('questionContainer');
    const card = document.createElement('div');
    card.className = 'question-card result-card active';
    
    card.innerHTML = `
        <h2 class="question-title">Thank You!</h2>
        <p class="result-description">We've received your request and will be in touch soon with personalized recommendations.</p>
    `;
    
    container.innerHTML = '';
    container.appendChild(card);

    // Update progress bar to 100%
    const progress = document.getElementById('progress');
    progress.style.width = '100%';
    
    // Trigger subtle, slower confetti for thank you page
    confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.5 },
        gravity: 0.5,  // Lower gravity makes confetti fall slower
        scalar: 0.8,   // Smaller confetti particles
        ticks: 300     // Longer animation duration
    });
    
    // Add a few more gentle confetti pieces after a delay
    setTimeout(() => {
        confetti({
            particleCount: 15,
            spread: 40,
            origin: { y: 0.4 },
            gravity: 0.4,
            scalar: 0.7,
            ticks: 250
        });
    }, 1000);
}

// Get user's IP and country
$.getJSON('/api/get-ip-info', function(data) {
    userIP = data.ip;
    userCountry = data.country;
    console.log('User IP:', userIP);
    console.log('User Country:', userCountry);
}).fail(function(error) {
    console.error('Failed to fetch IP information:', error);
    // Set fallback values if IP detection fails
    userIP = 'unknown';
    userCountry = 'unknown';
});
function startQuiz() {
    renderQuestion(questions[0]);
}

// Start the quiz with the intro page
renderIntroPage();
    </script>
</body>
</html>
