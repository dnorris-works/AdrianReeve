/**
 * Books Data - Pure JavaScript implementation
 * Reads book data from books/book-XX/meta.json files
 */

let booksCache = null;
let booksPromise = null;

async function coverExists(dir, coverFilename) {
    try {
        const response = await fetch(`/books/${dir}/${coverFilename}`, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        return false;
    }
}

async function loadBooksData() {
    if (booksCache) {
        return booksCache;
    }

    if (booksPromise) {
        return booksPromise;
    }

    booksPromise = (async () => {
        const manifestResponse = await fetch('/books/manifest.json');
        const bookDirs = await manifestResponse.json();
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

if (typeof window !== 'undefined') {
    window.BooksData = {
        loadBooksData,
        coverExists
    };
}
