let balance = 0;
let ProfitPerTap = 1;
let ProfitPerSecond = 1;
let ProfitPerHour = ProfitPerSecond * 3600;
let lastUpdateTime = Date.now();
let level = 1;
let offlineBalance = 0; // Define offlineBalance globally

const levelThresholds = [0, 5000, 25000, 100000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000];

const balanceNumber = document.getElementById('balance-text');
const ProfitPerHourNumber = document.getElementById('Profit-per-hour-text');
const ProfitPerTapNumber = document.getElementById('Profit-per-tap-text');
const levelNumber = document.getElementById('txt');
const clickImg = document.getElementById('click-img');
const offlineEarningsPopup = document.getElementById('offline-earnings-popup');
const offlineCarrotsElement = document.getElementById('offline-carrots');
const claimOfflineButton = document.getElementById('claim-offline');

function updateDisplay() {
    balanceNumber.textContent = formatNumber(balance);
    ProfitPerTapNumber.textContent = formatNumber(ProfitPerTap);
    ProfitPerHourNumber.textContent = formatNumber(ProfitPerHour);
    levelNumber.textContent = level + '/10';
}

function formatNumber(number) {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(2) + 'B';
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(2) + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(2) + 'k';
    }
    return number.toLocaleString(); // Format numbers with commas
}

clickImg.addEventListener('click', handleClick);
claimOfflineButton.addEventListener('click', claimOfflineEarnings);

function handleClick() {
    balance += ProfitPerTap;
    checkLevel();
    addClickEffect();
    updateDisplay();
    saveProgress();
}

function addClickEffect() {
    clickImg.classList.add('clicked');
    setTimeout(() => {
        clickImg.classList.remove('clicked');
    }, 100); // Duration of the click effect
}

function checkLevel() {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (balance >= levelThresholds[i]) {
            level = i + 1;
            break;
        }
    }
}

function saveProgress() {
    const now = Date.now();
    localStorage.setItem('balance', balance);
    localStorage.setItem('lastUpdateTime', now);
    localStorage.setItem('ProfitPerHour', ProfitPerHour);
    localStorage.setItem('ProfitPerTap', ProfitPerTap);
    localStorage.setItem('level', level);
}

function loadProgress() {
    const savedBalance = localStorage.getItem('balance');
    const savedLastUpdateTime = localStorage.getItem('lastUpdateTime');
    const savedProfitPerHour = localStorage.getItem('ProfitPerHour');
    const savedProfitPerTap = localStorage.getItem('ProfitPerTap');
    const savedLevel = localStorage.getItem('level');
    
    if (savedBalance && savedLastUpdateTime && savedProfitPerHour && savedProfitPerTap && savedLevel) {
        balance = parseInt(savedBalance, 10);
        lastUpdateTime = parseInt(savedLastUpdateTime, 10);
        ProfitPerHour = parseInt(savedProfitPerHour, 10);
        ProfitPerTap = parseInt(savedProfitPerTap, 10);
        level = parseInt(savedLevel, 10);

        const now = Date.now();
        const offlineTime = Math.floor((now - lastUpdateTime) / 1000);
        offlineBalance = offlineTime * ProfitPerSecond; // Set offlineBalance
        if (offlineBalance > 0) {
            offlineCarrotsElement.textContent = formatNumber(offlineBalance);
            showOfflineEarningsPopup(); // Show the popup
        }
    }
    updateDisplay();
    checkLevel();
}

function showOfflineEarningsPopup() {
    offlineEarningsPopup.classList.add('show');
}

function hideOfflineEarningsPopup() {
    offlineEarningsPopup.classList.remove('show');
}

function claimOfflineEarnings() {
    balance += offlineBalance;
    hideOfflineEarningsPopup();
    updateDisplay();
    saveProgress();
}

// Load progress when the page loads
window.onload = loadProgress;

// Function to generate a random position near the click point
function getRandomOffset() {
    return Math.random() * 20 - 10; // Random value between -10 and 10
}

// Function to create a floating number element
function createFloatingNumber(x, y, text) {
    const number = document.createElement('div');
    number.classList.add('floating-number');
    number.innerText = text;
    number.style.left = `${x + getRandomOffset()}px`;
    number.style.top = `${y + getRandomOffset()}px`;
    document.body.appendChild(number);

    // Remove the number element after the animation ends
    number.addEventListener('animationend', () => {
        document.body.removeChild(number);
    });
}

// Event listener for clicks on the click-img element
document.getElementById('click-img').addEventListener('click', (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    createFloatingNumber(event.clientX, event.clientY, '+' + ProfitPerTap); // Adjust text as needed
});
function startAutoClicker() {
    setInterval(() => {
        balance += ProfitPerSecond;
        updateDisplay();
        saveProgress();
    }, 1000);
}
window.addEventListener('load', () => {
    loadProgress();
    startAutoClicker();
});