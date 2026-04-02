// We'll point to localhost:8080 explicitly just in case they open the index.html directly from file system.
// Otherwise relative path is fine too.
const API_URL = '/api/books';

// DOM Elements
const bookForm = document.getElementById('book-form');
const booksGrid = document.getElementById('books-grid');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const searchIdInput = document.getElementById('search-id');

// State
let isEditing = false;
let allBooks = [];

// Initialize
document.addEventListener('DOMContentLoaded', fetchBooks);

// Fetch all books
async function fetchBooks() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch books');
        allBooks = await res.json();
        renderBooks(allBooks);
    } catch (err) {
        console.error(err);
        showError('Could not load books. Make sure the Spring Boot server is running.');
    }
}

// Render books to grid
function renderBooks(books) {
    booksGrid.innerHTML = '';

    if (books.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-state">
                <h3>No books found.</h3>
                <p>Start by adding some to your collection.</p>
            </div>
        `;
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-badge">ID: ${book.id}</div>
            <h3 class="book-title">${escapeHTML(book.title)}</h3>
            <p class="book-author">by ${escapeHTML(book.author)}</p>
            <div class="book-year">
                <span>📅</span>
                <span>${book.publishedYear}</span>
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        `;
        booksGrid.appendChild(card);
    });
}

// Form Submit Handler (Create/Update)
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('book-id').value;
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        publishedYear: parseInt(document.getElementById('publishedYear').value)
    };

    try {
        if (isEditing) {
            // PUT /api/books/{id}
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (!res.ok) throw new Error('Failed to update book');
        } else {
            // POST /api/books
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (!res.ok) throw new Error('Failed to create book');
        }

        resetForm();
        fetchBooks();
    } catch (err) {
        console.error(err);
        alert('Error saving book: ' + err.message);
    }
});

// Edit Book
window.editBook = (id) => {
    const book = allBooks.find(b => b.id === id);
    if (!book) return;

    document.getElementById('book-id').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('publishedYear').value = book.publishedYear;

    isEditing = true;
    formTitle.innerText = 'Edit Book';
    submitBtn.innerText = 'Update Book';
    cancelBtn.classList.remove('hidden');

    // Scroll to top to see form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete Book
window.deleteBook = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete book');

        // Remove from UI manually to prevent strict refresh dependency, or just fetch again
        fetchBooks();
    } catch (err) {
        console.error(err);
        alert('Error deleting book: ' + err.message);
    }
};

// Search Book by ID
searchBtn.addEventListener('click', async () => {
    const id = searchIdInput.value.trim();
    if (!id) return;

    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            if (res.status === 404) {
                renderBooks([]);
            } else {
                throw new Error('Failed to fetch book');
            }
            clearSearchBtn.classList.remove('hidden');
            return;
        }

        const book = await res.json();
        renderBooks([book]);
        clearSearchBtn.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        alert('Error: ' + err.message);
    }
});

clearSearchBtn.addEventListener('click', () => {
    searchIdInput.value = '';
    clearSearchBtn.classList.add('hidden');
    fetchBooks();
});

// Cancel Edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    bookForm.reset();
    document.getElementById('book-id').value = '';
    isEditing = false;
    formTitle.innerText = 'Add New Book';
    submitBtn.innerText = 'Save Book';
    cancelBtn.classList.add('hidden');
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}

function showError(msg) {
    booksGrid.innerHTML = `
        <div class="empty-state" style="border-color: var(--danger-color); color: var(--danger-color);">
            <h3>Connection Error</h3>
            <p>${msg}</p>
        </div>
    `;
}
