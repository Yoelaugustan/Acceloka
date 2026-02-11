CREATE DATABASE AccelokaDb;
GO

USE AccelokaDb;
GO

CREATE TABLE Categories
(
    CategoryName VARCHAR(100) NOT NULL PRIMARY KEY
);

CREATE TABLE Tickets
(
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    TicketCode VARCHAR(50) NOT NULL UNIQUE,
    TicketName VARCHAR(150) NOT NULL,
    CategoryName VARCHAR(100) NOT NULL,
    EventDate DATETIME NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Quota INT NOT NULL,

    CONSTRAINT FK_Tickets_Categories
        FOREIGN KEY (CategoryName)
        REFERENCES Categories(CategoryName)
);

CREATE TABLE Bookings (
    BookedTicketId INT IDENTITY(1,1) PRIMARY KEY,
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