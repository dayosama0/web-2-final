GEvidence — Blockchain Evidence for ESG Projects
GEvidence is a verification platform for ESG (Environmental, Social, Governance) projects.
It combines structured case management, transparent status tracking, and NFT-based certification to provide trust in sustainability claims.
This project was built as a final academic project and demonstrates:
Authentication & role-based access
Verification case lifecycle management
Status updates (draft → review → verified/rejected)
NFT certificate data attached to verified cases
Public dashboard for viewing ESG cases

Features
Authentication
User registration & login
Role-based access (admin / user)
Admin key protection for admin registration
JWT-based authentication


Verification Cases
Each ESG initiative is represented as a Verification Case containing:
Title
Organization ID
Site location (country, city)
ESG metric (key + unit)
Time period
Methodology
Status (draft / in_review / verified / rejected)

Admins can:
Create new cases
Update case status
Trigger NFT certificate data generation (mock implementation)

Users can:
Browse cases
Search by title / organization / location
View NFT certificate details if available



NFT Certificate (Mock Implementation)
When a case reaches certain states (e.g. verified), it may include:
nftCertificate: {
  tokenId,
  status,
  txHash,
  contractAddress,
  network,
  issuedAt,
  metadataUri
}

The public interface allows users to open and inspect NFT certificate metadata through a modal view.
Note: This is a simulated NFT layer (no real blockchain minting in this version).

Tech Stack
Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
REST API
Frontend
HTML5
Bootstrap 5
Vanilla JavaScript
Dynamic rendering via fetch API

Project Structure
gevidence-mongo-api/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── app.js
│   └── server.js
│
├── public/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│
├── .env
├── package.json
└── README.md


⚙️ Installation & Setup
1️. Clone the repository
git clone https://github.com/<your-username>/web-2-final.git
cd gevidence-mongo-api


2️. Install dependencies
npm install


3️. Configure environment variables
Create a .env file in the root directory:
PORT=3000
MONGO_URI=mongodb://localhost:27017/gevidence
JWT_SECRET=your_secret_key


4️. Run the server
npm start

or
node src/server.js

Server runs at:
http://localhost:3000


API Endpoints
Auth
POST   /auth/register
POST   /auth/login

Verification Cases
GET    /cases
POST   /cases              (admin)
PATCH  /cases/:id/status   (admin)


Roles

User
View verification cases
Search projects
View NFT certificate data

Admin
Create verification cases
Update case status
Manage lifecycle

Project Purpose

This project demonstrates:

Backend API design
Role-based authorization
Clean frontend-backend interaction
Structured data modeling
UI rendering based on database state
NFT certificate integration concept

Future Improvements

Real blockchain integration (ERC-721 minting)
Smart contract deployment (Hardhat)
IPFS metadata storage
Dashboard analytics
Case-level audit logs
Deployment on cloud infrastructure

Public Url:
https://gevidence-api.onrender.com 
