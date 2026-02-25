const contactName = document.getElementById("contact-name");
const contactPhone = document.getElementById("contact-phone");
const contactEmail = document.getElementById("contact-email");
const addButton = document.getElementById("add-btn");
const searchInput = document.getElementById("search-input");
const contactList = document.getElementById("contact-list");
const emptyMessage = document.getElementById("empty-msg");
const totalContacts = document.getElementById("total-contacts");

//local storage
function saveContacts() {
    const contacts = [];
    const rows = contactList.querySelectorAll("li");
    rows.forEach((row) => {
        contacts.push({
            name: row.querySelector(".name").textContent,
            phone: row.querySelector(".phone").textContent,
            email: row.querySelector(".email").textContent,
        });
    });
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.forEach(contact => {
        addContact(contact.name, contact.phone, contact.email)
    })
    renderContact()
}

//add contact
function addContact(name, phone, email) {
    const li = document.createElement("li");

    li.innerHTML = `
        <div class="avatar">${name[0].toUpperCase()}</div>
            <div class="contact-info">
                <p class="name">${name}</p>
                <p class="phone">${phone}</p>
                <p class="email">${email}</p>
            </div>
        <button class="delete-btn">Delete</button>
    `;

    contactList.appendChild(li)
};

//render contact
function renderContact() {
    const rows = contactList.querySelectorAll("li")

    if (rows.length === 0) {
        totalContacts.textContent = 0;
        emptyMessage.style.display = "block"
        return
    }

    emptyMessage.style.display = "none"
    totalContacts.textContent = rows.length
}

//add button
addButton.addEventListener("click", function () {
    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();
    const email = contactEmail.value.trim();

    if (name === "") {
        alert("Please enter name")
        return
    }

    if (phone === "") {
        alert("Please enter phone number")
        return
    }

    if (email === "") {
        alert("Please enter email")
        return
    }

    addContact(name, phone, email);
    contactName.value = ""
    contactPhone.value = ""
    contactEmail.value = ""
    renderContact()
    saveContacts()
})

//delete button
contactList.addEventListener("click", function (e) {

    if (e.target.classList.contains("delete-btn")) {
        const li = e.target.parentElement;
        li.remove();
        renderContact();
        saveContacts();
    }
})

//search names
searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const contactToFilter = contactList.querySelectorAll("li");

    contactToFilter.forEach(item => {
        const itemText = item.querySelector(".name").textContent.toLowerCase();
        if (itemText.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })
})

//init
loadContacts()
