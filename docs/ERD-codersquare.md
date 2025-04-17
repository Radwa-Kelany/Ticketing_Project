# ERD: Ticketing

This document explores the design of Ticketing, a mini E-commerce web app for selling
and purchasing tickets of social events.

I'll use a microservices architecture, using Docker and Kubernetes technology. 
The communication between services will be established using Message Queue service "NATS".
The app will be deployed on a cloud provider, and serving HTTP traffic from
a public endpoint.

## Storage

I'll use a NoSql database, Mongo_DB (schema follows) to fast retrieval of tickets and orders.

### Schema:
I'll need at least the following entities to implement the service:

**Users**:
| Attribute | Type |
|--------|------|
| Username| String |
| Password | String |
| Email | String |

**Tickets**:
| Attribute | Type |
|--------|------|
| Title | String |
| Price | Number |
| UserId | String |
| OrderId | String |

**Orders**:
| Attribute | Type |
|--------|------|
| UserId | String |
| Status| String |
| ExpiresAt| Date |
| Ticket| ObjectId |

**Payments**:
| Attribute | Type |
|---------|------|
| OrderId | STRING |
| StripeId | STRING/UUID |


## Server

HTTP server is responsible for authentication, serving stored data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Using Bootstrap for CSS style


### Auth

For v1, a simple JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database. OAuth is to be added initially or later
for Google + Facebook and maybe others (Github?).

### API

**Auth**:

```
/signIn  [POST]
/signUp  [POST]
/signOut [POST]
/currentUser [GET]
```

**Tickets**:

```
/tickets [GET]   <!-- List all tickets -->
/tickets [POST]  <!-- Post new ticket -->
/tickets/:id  [GET] <!-- Display single ticket info -->
/tickets/:id  [PUT] <!-- Update Ticket info -->
```

**Orders**:

```
/orders [GET] <!-- List all orders of authenticated user -->
/orders [POST] <!-- Create new order -->
/orders/:id [GET] <!-- Get single order info -->
/orders/:id [DELETE]  <!-- Cancel an order -->

```

**Payments**:

```
/payments [POST] <!-- create new payment -->



## Clients

For now we'll start with a single web client, possibly adding mobile clients later.

The web client will be implemented in React.js and Next.js.
See UI images for details.
API server will serve a static bundle of the React app.
Uses ReactQuery to talk to the backend.

## Hosting

The code will be hosted on Github, PRs and issues welcome.

A domain will be purchased for the site, and configured to point to the
web host's server public IP

## Deployment

The sever will be deployed on AWS cloud, using different needed services:
EKS, ECR, Route53 ....


Integration and deployment processes will be automated using Github actions and Terraform for different environments.

