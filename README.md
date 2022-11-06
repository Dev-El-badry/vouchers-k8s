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

### Fourth Step
add [vouchers.dev](vouchers.dev) domain to hosts files into your machine

- windows => ``` C:\Windows\System32\drivers\etc ```
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
