const firebaseConfig = {
    apiKey: "AIzaSyBNE3c2kgw37PWj5gLQEVFDKUvTLJ4YJ_Y",
    authDomain: "election-ae770.firebaseapp.com",
    databaseURL: "https://election-ae770-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "election-ae770",
    storageBucket: "election-ae770.appspot.com",
    messagingSenderId: "642288438852",
    appId: "1:642288438852:web:703eaec93b6e2e204d3b6c"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function vote(role, candidate) {
    const voterName = document.getElementById('voterName').value.trim();
    if (!voterName) {
        alert('Please enter your name!');
        return;
    }

    const voterRef = database.ref('voters/' + voterName);
    voterRef.once('value').then(snapshot => {
        if (snapshot.exists() && snapshot.val()[role]) {
            alert('You have already voted for ' + role + '!');
        } else {
            const voteRef = database.ref('votes/' + role);
            voteRef.child(candidate).push(voterName);

            const updatedVotes = {};
            updatedVotes[role] = candidate;
            voterRef.update(updatedVotes);

            alert('Your vote for ' + role + ' has been successfully cast!');
        }
    });
}

// Admin Panel - Fetch Vote Counts
function fetchVoteCounts() {
    const roles = ['President', 'Vice President', 'Secretary', 'Treasurer', 'IoT Lead', 'PR Lead', 'Creatives Lead', 'Tech Lead', 'Media Lead'];

    roles.forEach(role => {
        const voteRef = database.ref('votes/' + role);
        voteRef.once('value').then(snapshot => {
            const count = snapshot.numChildren();
            document.getElementById(role.toLowerCase().replace(' ', '-') + '-count').innerHTML = `${role}: <span>${count}</span> votes`;
        });
    });
}

// Toggle Navbar (Hamburger)
function toggleMenu() {
    var navbar = document.getElementById("navbar");
    navbar.classList.toggle("responsive");
}

// Display Admin Panel (Admin-only)
if (window.location.href.includes("admin.html")) {
    fetchVoteCounts();
    document.getElementById('admin-panel').style.display = 'block';
}