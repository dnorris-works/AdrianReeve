/**
 * Books Data - Pure JavaScript implementation
 * Reads book data from books/book-XX/meta.json files
 */

// Book data cache
let booksCache = null;
let booksPromise = null;

/**
 * Check if a cover image exists
 * 
 * @param {string} dir Book directory name
 * @param {string} coverFilename Cover filename
 * @returns {Promise<boolean>} True if cover exists
 */
async function coverExists(dir, coverFilename) {
    try {
        const response = await fetch(`/books/${dir}/${coverFilename}`, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        return false;
    }
}

/**
 * Load all book metadata from JSON files
 * 
 * @returns {Promise<Array>} Array of book objects
 */
async function loadBooksData() {
    if (booksCache) {
        return booksCache;
    }
    
    if (booksPromise) {
        return booksPromise;
    }
    
    booksPromise = (async () => {
        const bookDirs = ['book-01', 'book-02', 'book-03'];
        const books = [];
        
        for (const dir of bookDirs) {
            try {
                const response = await fetch(`/books/${dir}/meta.json`);
                if (response.ok) {
                    const meta = await response.json();
                    books.push({
                        id: dir,
                        title: meta.title || '',
                        description: meta.description || '',
                        purchaseLink: meta.purchaseLink || '',
                        cover: meta.cover || '',
                        coverUrl: meta.cover && await coverExists(dir, meta.cover)
                            ? `/books/${dir}/${meta.cover}`
                            : '/assets/favicon.svg',
                        comingSoon: meta.comingSoon || false
                    });
                }
            } catch (e) {
                console.warn(`Failed to load book data for ${dir}:`, e);
            }
        }
        
        booksCache = books;
        booksPromise = null;
        return books;
    })();
    
    return booksPromise;
}

/**
 * Get a single book by directory name
 * 
 * @param {string} dir Book directory name (e.g., 'book-01')
 * @returns {Promise<Object|null>} Book object or null if not found
 */
async function getBookById(dir) {
    const books = await loadBooksData();
    return books.find(book => book.id === dir) || null;
}

/**
 * Get all books
 * 
 * @returns {Promise<Array>} Array of all book objects
 */
async function getAllBooks() {
    return await loadBooksData();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.BooksData = {
        loadBooksData,
        getBookById,
        getAllBooks,
        coverExists
    };
}
