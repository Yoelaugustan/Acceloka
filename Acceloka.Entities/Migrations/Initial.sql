CREATE DATABASE AccelokaDb;
GO

USE AccelokaDb;
GO

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Categories (
    CategoryName VARCHAR(100) NOT NULL PRIMARY KEY
);

CREATE TABLE Tickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TicketCode VARCHAR(50) NOT NULL UNIQUE,
    TicketName VARCHAR(150) NOT NULL,
    CategoryName VARCHAR(100) NOT NULL,
    EventDate DATETIME NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Quota INT NOT NULL,

    CONSTRAINT FK_Tickets_Categories
        FOREIGN KEY (CategoryName)
        REFERENCES Categories(CategoryName),
    CONSTRAINT FK_Tickets_Users
        FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Bookings (
    BookedTicketId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,

    CONSTRAINT FK_Bookings_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE BookedTickets (
    BookedTicketDetailId INT IDENTITY(1,1) PRIMARY KEY,
    BookedTicketId INT NOT NULL,
    TicketCode VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,

    CONSTRAINT FK_BookedTickets_Bookings
        FOREIGN KEY (BookedTicketId) REFERENCES Bookings(BookedTicketId),
    CONSTRAINT FK_BookedTickets_Tickets
        FOREIGN KEY (TicketCode) REFERENCES Tickets(TicketCode)
);