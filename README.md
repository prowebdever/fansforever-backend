# FAN Backend

FAN Backend

## Prerequisites

- Node.js >12.x
- Yarn or Node Package Manager (NPM)

## Setting up your Development Enviroment

1. Clone the repository on your local machine

```bash
git clone https://github.com/junaidShaikh/fan-backend.git
```

2. Change current directory to the project directory

```bash
cd fan-backend
```

3. Install your dependencies with a package manager of your choice

```bash
yarn
```

or

```bash
npm install
```

4. Run the development version of you application

```bash
yarn start
```

or

```bash
npm run start
```

5. The APIs should be accessible at the base URL http://localhost:8000. You can visit the link in your browser of choice as long as the dev server is running.

## Postman collection for the API routes can be found [here](https://www.getpostman.com/collections/86956f3392efac484aad).

---

---

# APIs available as on 23-04-2021

## Auction APIs

APIs to interface with Auctions collection in DB.

### 1. GET /auction

Get single auction details from DB.

### 2. GET /auction/list

Get list of all auctions with details from DB.

### 3. POST /auction

Create new Auction in DB.

---

## Event APIs

APIs to interface with various Event related collections in DB.

### 1. GET /events/auction/create

Get list of all auction created events on smart contract

### 2. GET /events/auction/bids

Get filtered list of all auction bid events on smart contract

### 3. GET /events/auction/claim-tokens

Get list of all auction claim token events on smart contract

---

## NFT APIs

APIs to interface with NFT collection in DB.

### 1. GET /nft/listall

Get list of all NFTs in collection

### 2. POST /nft/details/:tokenId

Get details of single NFT from collection filtered by tokenId.

### 3. POST /nft/list

Get list of all nfts associated with a single wallet address.

### 4. POST /nft

Create a new NFT Document on NFTs collection in DB.

### 5. PUT /nft

Update an NFT Document associated with a wallet address. Operation allowed to the owner of NFT only

---

## User Profiles APIs

APIs to interface with Profiles collection in DB.

### 1. GET /profile

Get Profile details of a user by matching user's wallet address or their account handle

### 2. POST /profile

Create a new profile document in Profiles collection in DB.

### 3. PUT /profile

Update the matched user profile.

### 4. GET /profile/user

Check if user account handle already exists.

---

## IPFS APIs

APIs to interface with IPFS network via the Pinata service.

### 1. POST /ipfs/file

Add a file to IPFS network using Pinata service.

### 2. POST /ipfs/json

Add a JSON object to IPFS network using Pinata service.
