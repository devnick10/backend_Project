# Video Streaming App

The Video Streaming App is a web application designed to provide users with a platform for watching and sharing videos, similar to popular platforms like YouTube. In addition to video streaming functionality, the app also features a small tweet option, allowing users to post short updates and engage with the community through brief messages.

## Features

- **Video Streaming**: Users can browse, search, and watch a wide variety of videos uploaded by other users or content creators.
- **Upload Videos**: Content creators can upload their videos to share with the community.
- **Community Interaction**: Users can engage with the community by posting short tweets, commenting on videos, and liking or sharing content.
- **User Authentication**: Secure user authentication and authorization mechanisms ensure that only authorized users can upload videos or post tweets.
- **Responsive Design**: The app is designed to be responsive, providing a seamless viewing experience across different devices and screen sizes.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (with React.js for dynamic UI)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose for object modeling)
- **Authentication**: JSON Web Tokens (JWT) for user authentication
- **Cloud Storage**: Cloudinary for storing and serving video files
- **Other Dependencies**: dotenv for environment configuration, Prettier for code formatting

## Installation and Setup

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd backendproject`
3. Install dependencies: `npm install`
4. Configure environment variables: Create a `.env` file in the root directory and add necessary environment variables (e.g., PORT, MONGODB_URI, JWT_SECRET, CLOUDINARY_API_KEY)
5. Start the development server: `npm run dev`

## API Documentation

### Authentication

#### Register User

**POST /api/auth/register**

Registers a new user with the system.

**Request Body**

- `username` (string, required): The username of the user.
- `email` (string, required): The email address of the user.
- `password` (string, required): The password of the user.

**Response**

- 201 Created: User registration successful.
- 400 Bad Request: Invalid request body.

#### Login User

**POST /api/auth/login**

Logs in an existing user.

**Request Body**

- `email` (string, required): The email address of the user.
- `password` (string, required): The password of the user.

**Response**

- 200 OK: Login successful. Returns a JWT token.
- 401 Unauthorized: Invalid credentials.

### Videos

#### Get All Videos

**GET /api/videos**

Retrieves a list of all videos available in the system.

**Response**

- 200 OK: Returns an array of video objects.

#### Upload Video

**POST /api/videos**

Uploads a new video to the system.

**Request Body**

- `title` (string, required): The title of the video.
- `description` (string): The description of the video.
- `url` (string, required): The URL of the video file.

**Response**

- 201 Created: Video upload successful.
- 400 Bad Request: Invalid request body.


## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:
1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit them: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).
