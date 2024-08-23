# Book Store Client

This is the client-side code for the Book Store web application. It is built using React with Vite and provides the frontend functionality for interacting with the backend and Firebase for authentication.

## Installation

After cloning the repository, navigate to the project directory in your terminal and run:

```bash
npm install
```

This will install all the necessary dependencies.

## Configuration

Before running the client, create a `.env` file in the root of your project with the following content:

```bash
VITE_API_KEY=your-api-key-here
VITE_AUTH_DOMAIN=your-auth-domain-here
VITE_PROJECT_ID=your-project-id-here
VITE_STORAGE_BUCKET=your-storage-bucket-here
VITE_MESSAGING_SENDER_ID=your-messaging-sender-id-here
VITE_APP_ID=your-app-id-here
VITE_BACKEND_URL=http://localhost:5001
```

### Firebase Configuration

All the API keys in the `.env` file are provided by Firebase. To use your own keys, you need to create a Firebase project and obtain your own configuration. Follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on **Add Project** and follow the prompts to create a new project.
3. Once the project is created, navigate to **Project Settings**.
4. Under **Your Apps**, choose the **Web App** option and register your app.
5. Firebase will provide you with a configuration object that includes `apiKey`, `authDomain`, `projectId`, and other details.
6. Replace the values in the `.env` file with your own Firebase keys.

Make sure that your backend server URL is correctly set in the `VITE_BACKEND_URL`. By default, it is set to `http://localhost:5001` for local development.

## Usage

To start the client application, run the following command:

```bash
npm run dev
```

This will start the development server.

## Technology Used

- **React with Vite**: Fast and modern development setup for the frontend.
- **Firebase for Authentication**: Used for user authentication, including support for Google login.
- **Private Routing**: Implemented for protecting the admin dashboard from unauthorized access.

## Features

- **Admin Dashboard**: Access restricted to authenticated users with proper permissions.
- **Vlog Page**: Currently under development.
- **About Page**: Currently under development.

## Notes

Ensure that your backend server is running and accessible at the provided URL in the `.env` file. For development purposes, you can set `VITE_BACKEND_URL` to `http://localhost:5001` if your backend is running locally.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the MIT License file for details.
```

This addition explains how to get Firebase API keys and set them up for your project. Let me know if you need anything else!