# Design API For Voucher Pool Microservices (k8s)

## Getting Started

### First Step
To get started, make sure you have Docker installed and enabled <b>kubernates</b> on your system, and then clone this repository.

### Second Step (Skaffold) 

<i><small>Skaffold handles the workflow for building, pushing and deploying your application, allowing you to focus on what matters most: writing code. </small></i>

setup skaffold [Installing skaffold](https://skaffold.dev/docs/install/)

### Third Step
install ingress-nginx by running 
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/cloud/deploy.yaml
```

#### Creating a secret / accessing secret
```sh
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=my-secret-key
```

### Fourth Step
add [vouchers.dev](vouchers.dev) domain to hosts files into your machine

- windows => ``` C:\Windows\System32\drivers\etc\hosts ```
- mac / linux => ``` nano /etc/hosts ```
<br />
<div>
<img align="center" src="https://i.imgur.com/Rw1qxI7.png" alt="Hosts file" />
</div>



### Last Step
Next, navigate in your terminal to the directory you cloned this, and spin up the containers for the web server by running

```sh
skaffold dev
```

## API Collection of Voucher Pool app on postman
***NOTE*** create new environment in postman with domain variable has values: https://vouchers.dev ***make it https to store cookies***


[Voucher Pool App Service app collection](https://documenter.getpostman.com/view/3000372/2s8YYHKhcu)

You can access your application via localhost, if you're running the containers directly
[https://vouchers.dev](https://vouchers.dev)


## Running the tests

To get started, make sure you have NODE installed on your system,.

Next, navigate in your terminal to the directory you cloned this, run command below:
`npm install && npm install --save-dev`

- running tests:
-	users:
		`cd auth && npm run test`
-	vouchers:
		`cd vouchers && npm run test`
- 	redeem:
		`cd redeem && npm run test`

\*\* Note our running test outside the container to prevent container to upload large libraries like: `mongodb-memory-server` every time change `package.json`
[mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server)

## System Design Of App
 - [x] architect ,scalable app using collections of services handle by kubernets.
 - [x] using load balancing is called nginx-ingress.
 - [x] communication between services using a lighting-fast event bus by using nats-streaming.
 - [x] share reusable code between multiple express services using custom. NPM Package to prevent repeating code [common package](https://www.npmjs.com/package/@dev0vouchers/common).
 
## API
- [x] implemented JWT based security in a test Core Web API REST project

## Authentication
- [x] Sign In
- [x] Sign Up
- [x] Me
- [x] Logout

## Voucher Pool
- [x] Create
- [x] Update
- [x] Show
- [x] Get All

## Vouchers
- [x] Create
- [x] Update
- [x] Show
- [x] Get All
- [x] emits voucher:created event when create new vouceher
- [x] emits voucher:updated event when update voucher

## redeem
- [x] redeem voucher
- [x] check if voucher is expired 
- [x] check if voucher is already used.
- [x] emits redeem:created event when redeem created
- [x] listen voucher:creaetd evnet
- [x] listen voucher:updated evnet

## Common  <small>share reusable code between multiple express services using custom. NPM Package to prevent repeating code</small>
- [x] middlewares
- [x] events
- [x] errors
- [x] publish lib on npm packages
