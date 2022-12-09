// navbar setup
function navbarSetup () {
    if (!localStorage.getItem('bg-col'))
        localStorage.setItem('bg-col', "#2ecc71");

    let bg_cols = document.querySelector('.bg-selector').children;

    function changeBG(bg_col) {
        document.querySelector('body').style.backgroundColor = bg_col;
        localStorage.setItem('bg-col', bg_col);
    }

    changeBG(localStorage.getItem('bg-col'));

    for (let i of bg_cols) {
        i.addEventListener('click', () => changeBG(i.value));
        i.style.backgroundColor = i.value;
    }
}

// items
let items;

function showItems() {
    if (!localStorage.getItem('items'))
        localStorage.setItem('items', JSON.stringify([]));

    items = JSON.parse(localStorage.getItem('items'));
    for (let item of items)
        display(item.text, item.col, item.hash);
}

function display(text, col, hash) {
    let ne = document.createElement('article');
    ne.classList.add('ticket');

    ne.innerHTML =
        '<div class="t-col"></div>' +
        '<div class="t-id"></div>' +
        '<div class="t-text"></div>';

    ne.children.item(0).style.backgroundColor = col;
    ne.children.item(1).innerText = hash;
    ne.children.item(2).innerText = text;

    ne.addEventListener('click', () => deleteTicket(ne));

    document.getElementsByTagName('main')[0].appendChild(ne);
}

// mode
let mode;

function setupMode() {
    mode = null;

    function setMode(e) {
        document.querySelector('.mode-selector').children.item(1).style.backgroundColor = 'transparent';
        if (e === null) {
            mode = null;
            return;
        }

        if (e === 'add') {
            document.querySelector('.mode-selector').children.item(0).style.backgroundColor = 'gray';
            document.querySelector('#add-win').style.visibility = 'revert';
            setMode(null);
            return;
        }

        document.querySelector('.mode-selector').children.item(1).style.backgroundColor = 'gray';
        mode = e;
    }

    document.querySelector('#add').addEventListener('click', () => setMode('add'));
    document.querySelector('#del').addEventListener('click', () => setMode('del'));
}

// addTicket
function addTicketingModule() {
    let colours = document.querySelectorAll('.colours')[0].children;

    for (let v of colours)
        v.addEventListener('click', () => doTicketing(v.value));

    function doTicketing(c) {
        generateTicket(document.querySelector('#ticket-t').value, c).then (() => document.querySelector('#ticket-t').value = "");
        document.querySelector('#add-win').style.visibility = 'hidden';
        document.querySelector('.mode-selector').children.item(0).style.backgroundColor = 'transparent';
    }

    async function generateTicket(text, col) {
        let hash = getHash();
        await display(text, col, hash);
        items.push({text: text, col: col, hash: hash});
        localStorage.setItem('items', JSON.stringify(items));
        return Promise.resolve(1);
    }
}

//delete Ticket Module
function deleteTicket(ne) {
    if (mode !== 'del')
        return;

    let removedHash = ne.children.item(1).innerText;

    removeHashFromItems(removedHash);
    ne.parentElement.removeChild(ne);

    function removeHashFromItems(removedHash) {
        items = items.filter((item) => item.hash !== removedHash);
        hashSet.delete(removedHash);
        localStorage.setItem('items', JSON.stringify(items));
    }
}

// hashGeneration

let hashSet = new Set();

function startHashes() {
    items.forEach((item) => hashSet.add(item.hash));
}

function getHash() {
    let hashFound = false;
    while(!hashFound) {
        let nh = getNewHash();
        if (!hashSet.has(nh)) {
            hashFound = true;
            hashSet.add(nh);
            return nh;
        }
    }

    function getNewHash() {
        let hashVars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
        let hash = "#";

        while (hash.length < 7)
            hash += hashVars.charAt(Math.floor(Math.random()*hashVars.length));

        return hash;
    }
}

function startApplication() {
    navbarSetup();
    showItems();
    setupMode();
    addTicketingModule();
    startHashes();
}

// main
startApplication();
