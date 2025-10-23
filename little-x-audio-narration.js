// ============================================
// LITTLE X AUDIO NARRATION SYSTEM
// Add this script to any Little X book
// ============================================

// Create audio controls UI
function createAudioControls() {
    const controlsHTML = `
        <div id="audioControls" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 15px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            gap: 10px;
            align-items: center;
        ">
            <button id="playPauseBtn" onclick="toggleNarration()" style="
                background: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">▶️</button>
            
            <button id="stopBtn" onclick="stopNarration()" style="
                background: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">⏹️</button>
            
            <div style="display: flex; flex-direction: column; color: white;">
                <label style="font-size: 12px; margin-bottom: 5px;">Speed:</label>
                <input type="range" id="speedSlider" min="0.5" max="2" step="0.1" value="1" 
                    oninput="changeSpeed(this.value)"
                    style="width: 100px;">
                <span id="speedDisplay" style="font-size: 10px; text-align: center;">1x</span>
            </div>
            
            <div style="display: flex; flex-direction: column; color: white;">
                <label style="font-size: 12px; margin-bottom: 5px;">Voice:</label>
                <select id="voiceSelect" onchange="changeVoice()" style="
                    padding: 5px;
                    border-radius: 5px;
                    border: none;
                    font-size: 12px;
                "></select>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', controlsHTML);
}

// Speech synthesis setup
let utterance = null;
let isPaused = false;
let currentTextIndex = 0;
let allTextNodes = [];

// Initialize speech synthesis
function initNarration() {
    // Get all text content on the page
    allTextNodes = [];
    
    // Get all paragraphs, headings, and text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, div.text-content');
    
    textElements.forEach(element => {
        const text = element.textContent.trim();
        if (text && text.length > 10) { // Only include substantial text
            allTextNodes.push({
                element: element,
                text: text
            });
        }
    });
    
    console.log(`🔊 Found ${allTextNodes.length} text sections for narration`);
    
    // Load available voices
    loadVoices();
}

function loadVoices() {
    const voiceSelect = document.getElementById('voiceSelect');
    const voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
        // Voices not loaded yet, wait for them
        speechSynthesis.onvoiceschanged = loadVoices;
        return;
    }
    
    voiceSelect.innerHTML = '';
    
    // Prefer English voices
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    const voicesToShow = englishVoices.length > 0 ? englishVoices : voices;
    
    voicesToShow.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.default) option.selected = true;
        voiceSelect.appendChild(option);
    });
}

function speakText(text) {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voiceSelect');
    if (voices[voiceSelect.value]) {
        utterance.voice = voices[voiceSelect.value];
    }
    
    // Set speed
    const speed = parseFloat(document.getElementById('speedSlider').value);
    utterance.rate = speed;
    
    // Set pitch and volume
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Highlight text being spoken
    utterance.onstart = () => {
        if (allTextNodes[currentTextIndex]) {
            allTextNodes[currentTextIndex].element.style.background = 'rgba(255, 215, 0, 0.3)';
            allTextNodes[currentTextIndex].element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    };
    
    utterance.onend = () => {
        // Remove highlight
        if (allTextNodes[currentTextIndex]) {
            allTextNodes[currentTextIndex].element.style.background = '';
        }
        
        // Move to next text
        currentTextIndex++;
        
        if (currentTextIndex < allTextNodes.length) {
            speakText(allTextNodes[currentTextIndex].text);
        } else {
            // Finished all text
            stopNarration();
        }
    };
    
    speechSynthesis.speak(utterance);
}

function toggleNarration() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        // Pause
        speechSynthesis.pause();
        playPauseBtn.textContent = '▶️';
        isPaused = true;
    } else if (speechSynthesis.paused) {
        // Resume
        speechSynthesis.resume();
        playPauseBtn.textContent = '⏸️';
        isPaused = false;
    } else {
        // Start from beginning or current position
        if (currentTextIndex >= allTextNodes.length) {
            currentTextIndex = 0;
        }
        
        if (allTextNodes[currentTextIndex]) {
            speakText(allTextNodes[currentTextIndex].text);
            playPauseBtn.textContent = '⏸️';
        }
    }
}

function stopNarration() {
    speechSynthesis.cancel();
    
    // Remove all highlights
    allTextNodes.forEach(node => {
        node.element.style.background = '';
    });
    
    currentTextIndex = 0;
    document.getElementById('playPauseBtn').textContent = '▶️';
}

function changeSpeed(value) {
    document.getElementById('speedDisplay').textContent = value + 'x';
    
    // If currently speaking, restart with new speed
    if (speechSynthesis.speaking) {
        const wasPlaying = !speechSynthesis.paused;
        speechSynthesis.cancel();
        
        if (wasPlaying && allTextNodes[currentTextIndex]) {
            speakText(allTextNodes[currentTextIndex].text);
        }
    }
}

function changeVoice() {
    // If currently speaking, restart with new voice
    if (speechSynthesis.speaking) {
        const wasPlaying = !speechSynthesis.paused;
        speechSynthesis.cancel();
        
        if (wasPlaying && allTextNodes[currentTextIndex]) {
            speakText(allTextNodes[currentTextIndex].text);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    createAudioControls();
    initNarration();
    
    console.log('🎤 Audio Narration Ready! Click play button to start.');
});

// Export functions for external use
window.audioNarration = {
    init: initNarration,
    play: toggleNarration,
    stop: stopNarration,
    setSpeed: changeSpeed
};
