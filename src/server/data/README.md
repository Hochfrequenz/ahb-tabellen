# AHB Database Documentation

## Overview

The `ahb.db` file is a SQLite database that contains AHB (Anwendungshandbuch) data for the energy industry.
This database serves as the primary data source for the AHB Tabellen application.

## Database Structure

- **File**: `ahb.db`
- **Type**: SQLite database
- **Purpose**: Stores AHB data in a structured format for efficient querying and retrieval
- **Location**: `src/server/data/ahb.db.encrypted.7z` (encrypted and compressed)

## Data Source and Generation

### Creation Process

The database is created using the [fundament](https://github.com/Hochfrequenz/xml-fundamend-python/) Python package, which processes XML files containing AHB specifications.

### Source Repository

The database generation script is located in the private repository:

- **Repository**: [xml-migs-and-ahbs](https://github.com/Hochfrequenz/xml-migs-and-ahbs)
- **Script**: `load_ahbs_into_sqlitedb.py`
- **Access**: Private repository - only accessible to Hochfrequenz organization members

### Why Private?

The source XML files must be paid for, so they are not publicly available, which is why the repository is private.

## Maintenance

To update the database with new AHB data:

1. Access the private xml-migs-and-ahbs repository
2. Run the `load_ahbs_into_sqlitedb.py` script
3. Replace the existing `ahb.db.encrypted.7z` file with the new version
4. Deploy the updated application
