# Ethereum Wallet Manager
![alt text](image-1.png)

## Description

Ethereum Wallet Manager is a React-based web application that allows users to connect their Ethereum wallet (via MetaMask), view their account balance, and check the balance of any Ethereum address. Built with React, TypeScript, and ethers.js, this project demonstrates how to integrate blockchain functionality into a modern web application.

## Features

- Connect to MetaMask wallet
- Display connected wallet's address, balance, and network
- Real-time updates on account or network changes
- Check balance of any Ethereum address
- Responsive and user-friendly interface

## Technologies Used

- React 18.3.1
- TypeScript
- Vite (for build tooling)
- ethers.js v6
- Jest and React Testing Library (for testing)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MetaMask browser extension

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/DonGuillotine/react-injected-wallet-connection.git
   ```

2. Navigate to the project directory:
   ```
   cd react-injected-wallet-connection
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To run the application in development mode:

```
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) to view it in the browser.

To build the application for production:

```
npm run build
```

## Testing

To run the test suite:

```
npm test
```

### All tests Passed!

![alt text](image.png)

## My Deployment on GitHub Pages

![alt text](image-2.png)

## Project Structure

```
react-injected-wallet-connection/
├── src/
│   ├── components/
│   │   └── WalletManager.tsx
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   └── useWallet.test.ts
│   ├── styles/
│   │   └── styles.css
│   ├── types/
│   │   └── ethereum.d.ts
│   ├── utils/
│   │   └── ethereum.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Contributing

Contributions to the Ethereum Wallet Manager are welcome. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Your Name - infect3dlab@gmail.com

Project Link: [https://donguillotine.github.io/react-injected-wallet-connection/](https://donguillotine.github.io/react-injected-wallet-connection/)
