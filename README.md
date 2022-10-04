# FullStack Banking Application

## Description/Motivation
Capstone Project for MIT xPro

This project uses a 3 tier system including a React JavaScript framework for the front-end, a middle tier hosted on an HTTP server using NodeJS and ExpressJS, and a back-end of MongoDB, Firebase, and Docker.

## Installation Guidelines

Clone the files to your local machine with the git clone command.

Go to firebase.com and create a project. Once the project is created:

    Go to your project settings
    Under 'General', add a web app
    Find the SDK setup and configuration section for your new app
    Copy the code for the firebase config
    Add this code to the index.html file in the public folder in the project and save the file

After adding your firebase credentials, open a terminal window and run the following command (make sure you have docker installed and running):

    'docker run -p 27017:27017 --name fullstackBankingApp -d mongo'

Then do the following:

    Open another terminal window in the root folder of the project and run 'docker images' to check if the containers are running
    Go to your browser and navigate to http://localhost:3000 to use the site
    If you want to see the database, download Robo 3T
    On startup, connect Robo 3T to port localhost:27017 and you will be able to see all the users you create
  
## Technology Used

    JavaScript/HTML/CSS
    Express
    React
    Node
    MongoDB
    Docker
    Firebase

## Features

    Account Creation
    Login Authentication with OAuth2.0 using Firebase
    Hosted on Server with -------------------------------------------------------------------
    Maintains State Across Logins

## License

MIT License
