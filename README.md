## Getting Started
### 1. Clone the Repository
```bash
  git clone https://github.com/Yoelaugustan/Acceloka.git
  cd Acceloka
```

### 2. Database Setup
#### a. Configure Database Connection
Update `ConnectionStrings:SQLServerDB` in `Acceloka/appsettings.json`

**Example:**
```bash
  {
    "ConnectionStrings": {
      "SQLServerDB":"Server=(localdb)\\mssqllocaldb;Database=AccelokaDb;Trusted_Connection=True;MultipleActiveResultSets=true"
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
