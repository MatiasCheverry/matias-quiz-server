This proyect is a multiplayer quiz app that I built for dekabeza's challenge.

Technologies used:

-node.js
-sequelize
-postgres
-express.js

The interface is very simple:

You type your nickname and log in. Then you have a specified time to answer all the questions.
The timer is running at the server so all users see the live countdown. Each second, it emmits the remaining seconds to all users.

-When you log in the nickname and all the user data is saved in localstorage so you don't have to log in again.

-When you press "log out" you're redirected to the login page and the localstorage is cleared.

I've had a lot of fun building this simple app. It's likely that I continue to develop it since I want to add functionalities and improve the existing ones.
You can see the proyect deployed at:

https://matias-quiz-server.herokuapp.com/

DISCLAIMER :
If you want to clone this repository in your computer to run the app locally, you'll need to create a postres database in your computer.
Then add the .env file with a variable named DATABASE_URL on it with the path to your database. This will depend on your postgres user, password and url

For example

If:

-user:postgresuser
-password:postgrespassword
-url:postgresURL

Then the variable at .env shold be like this:

DATABASE_URL=postgres://postgresuser:postgrespassword@postgresURL:5432/nameofthedatabase

I appreciate any feedback you want to give me. My email address is matiascheverry24@gmail.com .

Thank you !
