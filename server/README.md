# Book Store Server

This is the server-side code for the Book Store web application. It provides the backend functionality for managing books in a database.

## Installation

After cloning the repository, navigate to the project directory in your terminal and run:

```bash
npm install
```

This will install all the necessary dependencies.

## Configuration

Before running the server, create a `.env` file in the root of your project with the following content:

```bash
MONGODB_URI = "your-mongodb-uri"
```

Replace `"your-mongodb-uri"` with your actual MongoDB connection string, including the username, password, and cluster information. This will be used to connect to your MongoDB database.

Ensure that the `.env` file includes the correct URI for your MongoDB cluster.

## Usage

To start the server, run the following command:

```bash
npm start
```

This will start the server on the specified port (default is 5001).

## Endpoints

### Upload a Book

- **URL:** `/upload-book`
- **Method:** POST
- **Description:** Uploads a new book to the database.
- **Request Body:** JSON object representing the book data.

### Fetch All Books

- **URL:** `/all-books`
- **Method:** GET
- **Description:** Retrieves all books from the database.

### Update a Book

- **URL:** `/book/:id`
- **Method:** PATCH
- **Description:** Updates the data of a specific book.
- **Request Parameters:** `id` (MongoDB ObjectId) - The ID of the book to update.
- **Request Body:** JSON object representing the updated book data.

### Delete a Book

- **URL:** `/book/:id`
- **Method:** DELETE
- **Description:** Deletes a specific book from the database.
- **Request Parameters:** `id` (MongoDB ObjectId) - The ID of the book to delete.

### Filter Books by Category

- **URL:** `/all-books`
- **Method:** GET
- **Description:** Retrieves books from the database filtered by category.
- **Query Parameters:** `category` - The category by which to filter the books.

## Notes

- This server assumes that the client-side application will interact with it via HTTP requests.
- Make sure to handle security and authentication in a production environment.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the MIT License file for details.
```

This addition informs users about the `.env` file for setting up the MongoDB URI properly. Let me know if you need any further adjustments!