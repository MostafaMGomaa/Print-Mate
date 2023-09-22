# PrintMate

![PrintMate sLogo](./images/printMateLogo.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Uploading PDFs](#uploading-pdf)
  - [Checking Order Status](#checking-order-status)
  - [Notifications](#notifications)
- [Schema](#schema)

## Introduction

PrinMate is a web application that allows users to upload PDF documents and have them printed by a printing library. Users can check the status of their orders and receive notifications when their orders are complete.

## Features

- Upload PDF documents for printing.
- Check the status of the printing order.
- Receive notifications when the order is complete.

## Getting Start

Follow these instructions to get the PrintMate app up and running on your local machine.

### Prerequisites

- Node.js and npm installed on your system.
- MySQL database to store order and user data.

### Installation

1. Clone this repository:

```shell
git clone https://github.com/MostafaMGomaa/printmate.git
```

2. Change into the project directory and install the required

```shell
cd printmate-app && npm install
```

### Configuration

1. Create a .env file in the src directory.
2. Add the necessary configuration variables:

```markdown file
NODE_ENV=""
PORT=""

DB_NAME=""
DB_USERNAME=""
DB_PASSWORD=""
DB_HOST=""
DB_PORT=3307

TEST_DB_NAME=""
TEST_DB_USERNAME=""
TEST_DB_PASSWORD=""
TEST_DB_HOST=""
TEST_DB_PORT=3307 || 33070

SECKEY = jsonwebtoken_secret_key
SENDGRID_APIKEY = your_send_grid_api_key
EMAIL_NAME = your_email
```

## Usage

Follow these steps to use the PrintMate app:

### Uploading PDFs

- Sign up or log in to your PrintMate account.
- Navigate to the upload section.
- Select the PDF document you want to print and submit the order.

### Checking Order Status

- Navigate to the order status section.
- Check the status of your printing order.

### Notifications

PrintMate will automatically send you notifications through email or SMS when your order is complete.

## Schema

**User**

| Column               | Type              |
| -------------------- | ----------------- |
| UserID               | UNSIGNED SMALLINT |
| Name                 | STRING            |
| Email                | STRING            |
| Photo                | STRING            |
| Role                 | STRING            |
| Password             | STRING            |
| PasswordConfirm      | STRING            |
| Verified             | BOOLEAN           |
| PasswordChangedAt    | DATE              |
| PasswordResetToken   | STRING            |
| PasswordResetExpires | DATE              |

**Notification**

| Column      | Type              |
| ----------- | ----------------- |
| UserID      | UNSIGNED SMALLINT |
| Description | Text              |
| IsRead      | BOOLEAN           |
| CreateAt    | DATE              |

**Order**

| Column    | Type              |
| --------- | ----------------- |
| UserID    | UNSIGNED SMALLINT |
| Size      | STRING            |
| Material  | STRING            |
| File      | STRING            |
| Notes     | TEXT              |
| CreatedAt | DATE              |

**Library**

| Column         | Type              |
| -------------- | ----------------- |
| Name           | STRING            |
| File           | STRING            |
| AveragePrice   | UNSIGNED SMALLINT |
| RatingQuantity | UNSIGNED SMALLINT |
| RatingAverage  | FLOAT             |
