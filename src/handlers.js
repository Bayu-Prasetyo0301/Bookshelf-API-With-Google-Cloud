import { nanoid } from 'nanoid';
import books from '../books.js';

// Handler untuk menambahkan buku
export const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    // Validasi jika nama buku tidak ada
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    // Validasi jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    // Membuat ID unik menggunakan nanoid
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    // Membuat objek buku baru
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    // Menambahkan buku ke dalam array
    books.push(newBook);

    // Validasi apakah buku berhasil ditambahkan
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // Mengembalikan respons jika berhasil
    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }

    // Mengembalikan respons jika gagal
    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

// Handler untuk mendapatkan semua buku
export const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    // Filter berdasarkan nama jika ada parameter query 'name'
    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    // Filter berdasarkan status reading jika ada parameter query 'reading'
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
    }

    // Filter berdasarkan status finished jika ada parameter query 'finished'
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);
};

// Handler untuk mendapatkan detail buku berdasarkan ID
export const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find((b) => b.id === bookId);

    if (book) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

// Handler untuk mengubah buku berdasarkan ID
export const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    // Validasi jika nama buku tidak ada
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    // Validasi jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        // Memperbarui buku yang ditemukan berdasarkan ID
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};

// Handler untuk menghapus buku berdasarkan ID
export const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        // Menghapus buku yang ditemukan berdasarkan ID
        books.splice(index, 1);

        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};
