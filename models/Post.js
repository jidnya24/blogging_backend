const db = require('../config/db');

class Post {
  static async create(title, content, authorId) {
    const [result] = await db.execute(
      'INSERT INTO posts (title, content, author_id, created_at) VALUES (?, ?, ?, NOW())',
      [title, content, authorId]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT posts.*, users.username as author_name 
       FROM posts 
       JOIN users ON posts.author_id = users.id 
       WHERE posts.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.execute(
      `SELECT posts.*, users.username as author_name 
       FROM posts 
       JOIN users ON posts.author_id = users.id 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM posts');
    const totalPosts = countResult[0].total;
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts: rows,
      totalPages,
      currentPage: page
    };
  }

  static async findByAuthor(authorId) {
    const [rows] = await db.execute(
      `SELECT posts.*, users.username as author_name 
       FROM posts 
       JOIN users ON posts.author_id = users.id 
       WHERE author_id = ? 
       ORDER BY created_at DESC`,
      [authorId]
    );
    return rows;
  }

  static async update(id, title, content) {
    const [result] = await db.execute(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(
      `SELECT posts.*, users.username as author_name 
       FROM posts 
       JOIN users ON posts.author_id = users.id 
       WHERE title LIKE ? OR content LIKE ? 
       ORDER BY created_at DESC`,
      [searchTerm, searchTerm]
    );
    return rows;
  }
}

module.exports = Post;
