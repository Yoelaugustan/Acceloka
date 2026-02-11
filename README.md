## Getting Started
### 1. Clone the Repository
```bash
  git clone https://github.com/Yoelaugustan/Acceloka.git
  cd Acceloka
```

### 2. Database Setup
#### a. Configure Database Connection
Open `Acceloka/appsettings.json` and update the `ConnectionStrings:SQLServerDB` entry to point to your SQL Server instance.

**Example:**
```bash
  {
    "ConnectionStrings": {
      "SQLServerDB":"Server=localhost;Initial Catalog=AccelokaDb;User id=sa;Pwd=HelloWorld123!;Encrypt=false"
    }
  }
```

#### b. Apply Migrations
```bash
  cd Acceloka.Entities
  dotnet ef database update
  cd ..
```

### 3. Build the Project
```bash
  dotnet build
```

## Running the Application
```bash
  cd Acceloka
  dotnet run
```
