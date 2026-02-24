const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const addButton = document.getElementById("add-btn");
const bookList = document.getElementById("book-list");
const emptyMsg = document.getElementById("empty-msg");
const totalBooks = document.getElementById("total-books");
const readBooks = document.getElementById("read-books");
const unreadBooks = document.getElementById("unread-books");

//local storage
function saveBooks() {
    const books = [];
    const rows = bookList.querySelectorAll("li");
    rows.forEach(row => {
        books.push({
            title: row.querySelector(".title").textContent,
            author: row.querySelector(".author").textContent,
            status: row.classList.contains("read") ? "read" : "unread"
        });
    });
    localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach(book => {
        addBooks(book.title, book.author, book.status);
    });
    renderBook();
}

//add books
function addBooks(bookName, bookAuthorName, status = "unread") {
    const li = document.createElement("li");

    // if book was saved as read, apply read styles immediately
    if (status === "read") {
        li.classList.add("read");
    }

    li.innerHTML = `
        <div class="book-info">
            <p class="title">${bookName}</p>
            <p class="author">${bookAuthorName}</p>
        </div>
        <button class="status-btn ${status === "read" ? "mark-unread" : ""}">
            ${status === "read" ? "Mark as Unread" : "Mark as Read"}
        </button>
        <button class="delete-btn">Delete</button>
    `;
    bookList.appendChild(li);
}

//render 
function renderBook() {
    const rows = bookList.querySelectorAll("li");

    if (rows.length === 0) {
        totalBooks.textContent = 0;
        readBooks.textContent = 0;
        unreadBooks.textContent = 0;
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";
    totalBooks.textContent = rows.length;

    let readCount = 0;
    rows.forEach(row => {
        if (row.classList.contains("read")) {
            readCount++;
        }
    });

    readBooks.textContent = readCount;
    unreadBooks.textContent = rows.length - readCount;
}

//add button
addButton.addEventListener("click", function () {
    const title = bookTitle.value.trim();
    const author = bookAuthor.value.trim();

    if (title === "") {
        alert("Please enter a book name");
        return;
    }
    if (author === "") {
        alert("Please enter book author");
        return;
    }

    addBooks(title, author);
    bookTitle.value = "";
    bookAuthor.value = "";
    renderBook();
    saveBooks();
});

//toggle read and unread
bookList.addEventListener("click", function (e) {
    if (e.target.classList.contains("status-btn")) {
        const li = e.target.parentElement;
        const btn = e.target;

        if (li.classList.contains("read")) {
            li.classList.remove("read");
            btn.classList.remove("mark-unread");
            btn.textContent = "Mark as Read";
        } else {
            li.classList.add("read");
            btn.classList.add("mark-unread");
            btn.textContent = "Mark as Unread";
        }

        renderBook();
        saveBooks();
    }
});

//delete book
bookList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        const li = e.target.parentElement;
        li.remove();
        renderBook();
        saveBooks();
    }
});

//filter between readn and unread
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {

        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const filter = this.dataset.filter;
        const rows = bookList.querySelectorAll("li");

        rows.forEach(row => {
            if (filter === "all") {
                row.style.display = "flex";
            } else if (filter === "read" && row.classList.contains("read")) {
                row.style.display = "flex";
            } else if (filter === "unread" && !row.classList.contains("read")) {
                row.style.display = "flex";
            } else {
                row.style.display = "none";
            }
        });
    });
});

loadBooks();