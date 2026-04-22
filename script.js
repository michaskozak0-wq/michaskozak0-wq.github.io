 // ========== GENERATORY DANYCH ==========
function generatePesel() {
    const year = Math.floor(Math.random() * 40) + 1980;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    let yy = year.toString().slice(-2);
    let mm = month.toString().padStart(2, '0');
    let dd = day.toString().padStart(2, '0');
    if (year >= 2000) mm = (month + 20).toString();
    const randomSeq = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const peselBase = yy + mm + dd + randomSeq;
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(peselBase[i]) * weights[i];
    const control = (10 - (sum % 10)) % 10;
    return peselBase + control;
}

function generateDocumentNumber(prefix = '', length = 9) {
    const letters = 'ABCDEFGHJKLMNPRSTUWXYZ';
    const numbers = '0123456789';
    let result = prefix;
    for (let i = 0; i < 3; i++) result += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 6; i++) result += numbers[Math.floor(Math.random() * numbers.length)];
    return result;
}

function generateRandomDate(startYear = 2020, endYear = 2035) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

function generateRandomName() {
    const names = ['JAN', 'ANNA', 'PIOTR', 'MARIA', 'KRZYSZTOF', 'BARBARA', 'ANDRZEJ', 'KATARZYNA', 'TOMASZ', 'MAGDALENA', 'PAWEŁ', 'AGNIESZKA', 'MICHAŁ', 'JOANNA'];
    const surnames = ['KOWALSKI', 'NOWAK', 'WIŚNIEWSKI', 'DĄBROWSKI', 'LEWANDOWSKI', 'WÓJCIK', 'KAMIŃSKI', 'ZIELIŃSKI', 'SZYMAŃSKI', 'WOŹNIAK'];
    return { first: names[Math.floor(Math.random() * names.length)], last: surnames[Math.floor(Math.random() * surnames.length)] };
}

// ========== ZARZĄDZANIE DANYMI I KODAMI ==========
let userData = JSON.parse(localStorage.getItem('userData')) || null;
let activeCodes = JSON.parse(localStorage.getItem('activeCodes')) || {};
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let isActivated = localStorage.getItem('isActivated') === 'true';
const ADMIN_PASSWORD = 'admin2025'; // hasło do panelu admina (możesz zmienić)

function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function generateNewUserData() {
    const name = generateRandomName();
    const pesel = generatePesel();
    const birthDate = peselToBirthDate(pesel);
    return {
        firstName: name.first,
        lastName: name.last,
        citizenship: 'POLSKIE',
        birthDate: birthDate,
        pesel: pesel,
        mDowodNr: generateDocumentNumber('', 9),
        mDowodValid: generateRandomDate(2025, 2035),
        mDowodIssue: generateRandomDate(2024, 2026),
        dowodNr: generateDocumentNumber('', 9),
        dowodOrgan: 'PREZYDENT MIASTA GDAŃSK',
        fatherName: 'ANDRZEJ',
        motherName: 'BARBARA',
        birthPlace: 'GDAŃSK',
        address: 'UL. POLNA 90/46',
        postalCode: '08-503 GDAŃSK',
        registrationDate: generateRandomDate(2020, 2025),
        photo: null
    };
}

function peselToBirthDate(pesel) {
    const year = parseInt(pesel.substring(0, 2));
    let month = parseInt(pesel.substring(2, 4));
    const day = parseInt(pesel.substring(4, 6));
    let century = 1900;
    if (month > 80) { century = 1800; month -= 80; }
    else if (month > 60) { century = 2200; month -= 60; }
    else if (month > 40) { century = 2100; month -= 40; }
    else if (month > 20) { century = 2000; month -= 20; }
    const fullYear = century + year;
    return ${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')};
}

function generateActivationCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) code += '-';
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
    function activateApp(code) {
    if (activeCodes[code] && !activeCodes[code].used) {
        activeCodes[code].used = true;
        activeCodes[code].usedAt = new Date().toISOString();
        localStorage.setItem('activeCodes', JSON.stringify(activeCodes));
        localStorage.setItem('isActivated', 'true');
        isActivated = true;
        userData = generateNewUserData();
        saveUserData();
        return true;
    }
    return false;
}

// ========== RENDEROWANIE INTERFEJSU ==========
function renderMDowod() {
    if (!userData) return;
    const container = document.getElementById('mDowódDetails');
    container.innerHTML = 
        <div class="detail-row"><span class="detail-label">Imię (Imiona)</span><span class="detail-value">${userData.firstName}</span></div>
        <div class="detail-row"><span class="detail-label">Nazwisko</span><span class="detail-value">${userData.lastName}</span></div>
        <div class="detail-row"><span class="detail-label">Obywatelstwo</span><span class="detail-value">${userData.citizenship}</span></div>
        <div class="detail-row"><span class="detail-label">Data urodzenia</span><span class="detail-value">${userData.birthDate}</span></div>
        <div class="detail-row"><span class="detail-label">Numer PESEL</span><span class="detail-value">${userData.pesel}</span></div>
        <div class="detail-row"><span class="detail-label">Seria i numer mDowodu</span><span class="detail-value">${userData.mDowodNr}</span></div>
        <div class="detail-row"><span class="detail-label">Termin ważności mDowodu</span><span class="detail-value">${userData.mDowodValid}</span></div>
        <div class="detail-row"><span class="detail-label">Data wydania mDowodu</span><span class="detail-value">${userData.mDowodIssue}</span></div>
        <div class="detail-row"><span class="detail-label">Seria i numer dowodu</span><span class="detail-value">${userData.dowodNr}</span></div>
        <div class="detail-row"><span class="detail-label">Organ wydający</span><span class="detail-value">${userData.dowodOrgan}</span></div>
        <div class="detail-row"><span class="detail-label">Imię ojca</span><span class="detail-value">${userData.fatherName}</span></div>
        <div class="detail-row"><span class="detail-label">Imię matki</span><span class="detail-value">${userData.motherName}</span></div>
        <div class="detail-row"><span class="detail-label">Miejsce urodzenia</span><span class="detail-value">${userData.birthPlace}</span></div>
        <div class="detail-row"><span class="detail-label">Adres zameldowania</span><span class="detail-value">${userData.address}</span></div>
        <div class="detail-row"><span class="detail-label">Kod pocztowy</span><span class="detail-value">${userData.postalCode}</span></div>
        <div class="detail-row"><span class="detail-label">Data zameldowania</span><span class="detail-value">${userData.registrationDate}</span></div>
    ;
}

function updateUI() {
    const loginScreen = document.getElementById('loginScreen');
    const activationScreen = document.getElementById('activationScreen');
    const mainScreen = document.getElementById('mainScreen');
    const adminPanel = document.getElementById('adminPanel');

    if (!isLoggedIn) {
        loginScreen.classList.add('active');
        activationScreen.classList.remove('active');
        mainScreen.classList.remove('active');
        return;
    }

    if (!isActivated) {
        loginScreen.classList.remove('active');
        activationScreen.classList.add('active');
        mainScreen.classList.remove('active');
        return;
    }

    loginScreen.classList.remove('active');
    activationScreen.classList.remove('active');
    mainScreen.classList.add('active');
    renderMDowod();

    // QR
    const qrDiv = document.getElementById('qrCode');
    if (qrDiv && userData) {
        qrDiv.innerHTML = '';
        new QRCode(qrDiv, {
            text: JSON.stringify({ name: ${userData.firstName} ${userData.lastName}, pesel: userData.pesel, doc: userData.mDowodNr }),
            width: 180, height: 180
        });
    }

    // Admin panel (widoczny dla Ciebie)
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        adminPanel.style.display = 'block';
        updateAdminPanel();
    } else {
        adminPanel.style.display = 'none';
    }
}

function updateAdminPanel() {
    const list = document.getElementById('activeCodesList');
    if (!list) return;
    list.innerHTML = '';
    for (const [code, data] of Object.entries(activeCodes)) {
        if (!data.used) {
            const li = document.createElement('li');
            li.textContent = ${code} - wygenerowany: ${new Date(data.created).toLocaleString()};
            list.appendChild(li);
        }
    }
    if (list.children.length === 0) list.innerHTML = '<li>Brak aktywnych kodów</li>';
}

function openEditScreen() {
    document.getElementById('editScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
    // wypełnij formularz
    document.getElementById('editFirstName').value = userData.firstName;
    document.getElementById('editLastName').value = userData.lastName;
    document.getElementById('editCitizenship').value = userData.citizenship;
    document.getElementById('editBirthDate').value = userData.birthDate;
    document.getElementById('editPesel').value = userData.pesel;
    document.getElementById('editMDowodNr').value = userData.mDowodNr;
    document.getElementById('editMDowodValid').value = userData.mDowodValid;
    document.getElementById('editMDowodIssue').value = userData.mDowodIssue;
    document.getElementById('editDowodNr').value = userData.dowodNr;
    document.getElementById('editOrgan').value = userData.dowodOrgan;
    document.getElementById('editFatherName').value = userData.fatherName;
    document.getElementById('editMotherName').value = userData.motherName;
    document.getElementById('editBirthPlace').value = userData.birthPlace;
    document.getElementById('editAddress').value = userData.address;
    document.getElementById('editPostal').value = userData.postalCode;
    document.getElementById('editRegistrationDate').value = userData.registrationDate;
}

function saveEditData() {
    userData.firstName = document.getElementById('editFirstName').value;
    userData.lastName = document.getElementById('editLastName').value;
    userData.citizenship = document.getElementById('editCitizenship').value;
    userData.birthDate = document.getElementById('editBirthDate').value;
    userData.pesel = document.getElementById('editPesel').value;
    userData.mDowodNr = document.getElementById('editMDowodNr').value;
    userData.mDowodValid = document.getElementById('editMDowodValid').value;
    userData.mDowodIssue = document.getElementById('editMDowodIssue').value;
    userData.dowodNr = document.getElementById('editDowodNr').value;
    userData.dowodOrgan = document.getElementById('editOrgan').value;
    userData.fatherName = document.getElementById('editFatherName').value;
    userData.motherName = document.getElementById('editMotherName').value;
    userData.birthPlace = document.getElementById('editBirthPlace').value;
    userData.address = document.getElementById('editAddress').value;
    userData.postalCode = document.getElementById('editPostal').value;
    userData.registrationDate = document.getElementById('editRegistrationDate').value;
    saveUserData();
    renderMDowod();
    document.getElementById('editScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
}

// ========== EVENTY I URUCHOMIENIE ==========
document.addEventListener('DOMContentLoaded', () => {
    if (!userData) userData = generateNewUserData();
    updateUI();
// Logowanie
    document.getElementById('loginBtn').onclick = () => {
        const pwd = document.getElementById('loginPassword').value;
        if (pwd === ADMIN_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'true');
            isLoggedIn = true;
            updateUI();
        } else if (pwd === 'user123') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'false');
            isLoggedIn = true;
            updateUI();
        } else {
            alert('Nieprawidłowe hasło');
        }
    };
    document.getElementById('backToLoginBtn').onclick = () => {
        localStorage.setItem('isLoggedIn', 'false');
        isLoggedIn = false;
        updateUI();
    };
    document.getElementById('activateBtn').onclick = () => {
        const code = document.getElementById('activationCode').value.trim().toUpperCase();
        if (activateApp(code)) {
            updateUI();
            alert('✅ Aktywacja udana!');
        } else {
            alert('❌ Nieprawidłowy kod');
        }
    };
    document.getElementById('editDataBtn').onclick = openEditScreen;
    document.getElementById('backToMainBtn').onclick = () => {
        document.getElementById('editScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
    };
    document.getElementById('saveDataBtn').onclick = saveEditData;
    document.getElementById('generateAllBtn').onclick = () => {
        userData = generateNewUserData();
        saveUserData();
        saveEditData();
        alert('✅ Wszystkie dane zostały wygenerowane');
    };
    document.getElementById('genPeselBtn').onclick = () => {
        document.getElementById('editPesel').value = generatePesel();
    };
    document.getElementById('genMDowodBtn').onclick = () => {
        document.getElementById('editMDowodNr').value = generateDocumentNumber('', 9);
    };
    document.getElementById('genDowodBtn').onclick = () => {
        document.getElementById('editDowodNr').value = generateDocumentNumber('', 9);
    };

    // Admin
    document.getElementById('generateCodeBtn').onclick = () => {
        const newCode = generateActivationCode();
        activeCodes[newCode] = { created: new Date().toISOString(), used: false };
        localStorage.setItem('activeCodes', JSON.stringify(activeCodes));
        document.getElementById('generatedCode').value = newCode;
        updateAdminPanel();
        alert(Kod: ${newCode});
    };
    document.getElementById('resetAllBtn').onclick = () => {
        if (confirm('Usunąć wszystkich użytkowników i kody?')) {
            localStorage.clear();
            location.reload();
        }
    };

    // Nawigacja dolna
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.getElementById(tab${tab.charAt(0).toUpperCase() + tab.slice(1)}).classList.remove('hidden');
        };
    });
});