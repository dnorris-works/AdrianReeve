(async function loadBooks() {
    const grid = document.getElementById('books-grid');

    try {
        // Fetch books using the pure JavaScript data loader
        const books = await window.BooksData.loadBooksData();

        for (const book of books) {
            try {
                const coverSrc = book.coverUrl;

                const card = document.createElement('div');
                card.className = 'book-card';

                let coverHtml;
                if (book.comingSoon) {
                    coverHtml = `<div class="book-cover book-cover--coming-soon"><span>Coming Soon</span></div>`;
                } else {
                    coverHtml = `<div class="book-cover"><img src="${coverSrc}" alt="${book.title} cover" onerror="this.src='/assets/noBgBlackIcon.png'"></div>`;
                }

                if (book.purchaseLink) {
                    card.innerHTML = `
                        <a href="${book.purchaseLink}" target="_blank" rel="noopener" class="book-link">
                            ${coverHtml}
                            <p class="book-title">${book.title}</p>
                            <div class="book-description">${book.description}</div>
                        </a>
                    `;
                } else {
                    card.innerHTML = `
                        ${coverHtml}
                        <p class="book-title">${book.title}</p>
                        <div class="book-description">${book.description}</div>
                    `;
                }

                grid.appendChild(card);
            } catch (e) {
                // Skip books with missing data
            }
        }
    } catch (e) {
        // No books found or API error — books section stays empty
    }
})();
