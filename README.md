# ECE NodeJS Lab 1 2019-2020

## Authors
- CHEONG Loïc : huangloic@hotmail.com
- GUPTA Chirag : unknown

ECE's students in the group ING 4 SI 03 Inter 

## Introduction
This lab contains 2 works 

Part 1: Node.js
The work is in the file hello.js
Create a basic app with three routes:
/ explains how /hello works
/hello takes a name query parameter and
random names replies hello [name]
your own name replies with a short intro of yourself
any other replies a 404 code with a not found message


Part 2: Dependency managment in Node.js
Node.js modules
Packages
Using Nodemon utility
You should have an index.js file with the server creation and handles.js defining the server's callback
Add a package.json file with you module declaration
Add a readme.md file with title, introduction, run instructions and your name

## Run instructions
1. Choose an editor of your choice with a terminal (VS Code, WebStorm, etc.)

2. Download the lab
Clone the repository wherever you want with the command line : 
```
cd PathOfYourChoice
git clone https://github.com/CheongLoic/ece-nodejs-Lab1.git
```

3. Part 1 : Node.js
```
node hello
```
Open a brwoser of your choice (like Google Chrome) and paste the link below http://localhost:8080
Afterwards follow all the instructions

4. Dependency managment in Node.js
```
npm install nodemon --save
npm run dev index.js
```

It will display almost the same thing than hello.js, but if you save some changes in your index.js or handles.js, it restarts the server on saving.
It faster than using 
```
node index.js
```
