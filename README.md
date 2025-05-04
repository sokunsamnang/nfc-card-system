# NFC Business Card System

A complete system for creating, writing, and reading business card data using NFC technology. The system consists of three main components:

1. **Server** (Node.js/Express): Backend API for managing user data and business cards
2. **Mobile App** (React Native/Expo): App for writing business card data to NFC tags
3. **Web Client** (Next.js): Web interface for reading and displaying business card data

## Project Structure

This project is organized as a monorepo with the following components:

- `server/`: Backend API built with Node.js and Express
- `nfc-card-client/`: Web client built with Next.js
- `nfc-card-mobile/`: Mobile app built with React Native and Expo

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Expo CLI (for mobile development)
- NFC-enabled Android device (for testing the mobile app)

## Setup

### Clone the Repository

```bash
git clone https://github.com/sokunsamnang/nfc-card-system.git
cd nfc-card-system
git submodule init
git submodule update
```

### Server Setup

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file with the following content:

    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/business-card-db
    JWT_SECRET=your_jwt_secret_key_here
    PUBLIC_BASE_URL=http://localhost:3001
    ```

4. Start the server:
    ```bash
    npm run dev
    ```

### Web Client Setup

1. Navigate to the client directory:

    ```bash
    cd nfc-card-client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

### Mobile App Setup

1. Navigate to the mobile app directory:

    ```bash
    cd nfc-card-mobile
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the Expo development server:

    ```bash
    npm start
    ```

4. Use the Expo Go app on your device to scan the QR code and run the app

## Usage

1. **Server API Endpoints**:

    - POST /api/users/register - Register a new user
    - POST /api/users/login - Login user
    - GET /api/users/profile - Get user profile
    - POST /api/cards - Create a new business card
    - GET /api/cards - Get all cards for user
    - GET /api/cards/nfc/:nfcId - Get card by NFC ID
    - PATCH /api/cards/:id - Update card
    - DELETE /api/cards/:id - Delete card

2. **Mobile App**:

    - Launch the app on an NFC-enabled device
    - Load your business card data
    - Tap "Write to NFC Tag" and hold an NFC tag near your device
    - The app will write the card data to the tag

3. **Web Client**:
    - Open the web interface
    - Enter the NFC ID to view the associated business card
    - The card information will be displayed in a clean, readable format

## Development

This project uses Git submodules to manage the three components. When making changes:

1. Make changes in the respective component directory
2. Commit changes in the component directory
3. Go back to the root directory and commit the submodule reference

## Security Considerations

- Always use HTTPS in production
- Store sensitive data securely
- Implement proper authentication and authorization
- Validate all user inputs
- Use environment variables for sensitive configuration

## License

MIT
