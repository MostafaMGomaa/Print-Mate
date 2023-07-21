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
- [Contributing](#Contributing)
- [License](#License)

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

1. Create a .env file in the project root directory.
2. Add the necessary configuration variables:

```markdown file
DB_HOST=your_mysql_host
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_mysql_database_name
PORT=8080
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

## Contributing

We welcome contributions from the community. To contribute to PrintMate, follow these steps:

Fork the repository on GitHub.
Create a new branch for your feature: git checkout -b my-feature-branch
Make your changes and commit them: git commit -m "Add new feature"
Push your changes to your forked repository: git push origin my-feature-branch
Submit a pull request to the original repository.

## License

This project is licensed under the MIT License.
