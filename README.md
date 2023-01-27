# EZID SMS Authentication

The EZID SMS Authentication project is a full-stack web application that utilizes the EZID SMS Auth endpoint to provide secure and convenient login and sign-up functionality for users. The frontend of the application is built using React.js, providing a user-friendly interface for users to interact with. The backend of the application is built using Express.js and MongoDB, which handle user authentication and authorization, as well as data storage. The project also make use of MongoDB Atlas to create a cloud cluster and get the credentials. The project includes instructions on how to set up your own MongoDB cluster on Atlas and how to configure the application to connect to it. Overall, this project serves as a great starting point for anyone looking to implement EZID SMS-based authentication in their own web application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- Express
- React
- MongoDB
- EZID API credentials (can be obtained from https://www.ezid.io/)
- MongoDB Atlas account (https://www.mongodb.com/atlas/database) to create a cloud cluster and obtain credentials

### Setting up MongoDB Atlas

1. Go to the MongoDB Atlas website (https://www.mongodb.com/atlas) and sign up for a free account.
2. Once you are logged in, click on the "Build a New Cluster" button on the dashboard.
3. Select the cloud provider and region that you want to use for your cluster.
4. Choose a cluster tier that fits your needs. The free tier, M0, is a good option for testing and development.
5. Customize your cluster by adding additional options such as backup, monitoring, and encryption.
6. Click the "Create Cluster" button to create your cluster.
7. Once the cluster is created, you can access it by clicking on the "Connect" button.
8. On the "Connect" page, you can create a new user, whitelist your IP address, and create a connection string.
9. Use the connection string in .env file to connect to your cluster.
10. In the cluster, you can create a database and collections.

### Installing

1. Clone the repository:
   git clone https://github.com/<username>/ezid-sms-authentication.git

Copy code

2. Install the dependencies:

   ```
   cd client && npm install && cd ../server && npm install
   ```

1. Create a .env file in the root of the Server folder and set up the environment variables:

   ```shell
   CLIENT_ID=your_ezid_client_id
   CLIENT_SECRET=your_ezid_client_secret
   MONGODB_CLUSTER=your_mongodb_cluster
   ```

1. Start the development server:
   npm start

## Built With

- [React](https://reactjs.org/) - The web framework used
- [Express](https://expressjs.com/) - The web server used
- [MongoDB](https://www.mongodb.com/) - The database used
- [EZID API](https://www.ezid.io/) - Used for SMS authentication
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Used for creating a cloud-based MongoDB cluster

## Conclusion

The EZID SMS Authentication project is a robust and secure solution for adding SMS-based authentication to your web application. By utilizing the EZID SMS Auth endpoint, users can easily and quickly register and login to your application using their phone number. The project also includes instructions on how to set up a MongoDB Atlas cluster, making it easy to store and manage user data. Whether you are a developer looking to add SMS authentication to your own application or a business looking to improve the security of your online presence, the EZID SMS Authentication project is a great starting point.
