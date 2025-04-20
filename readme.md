# MySQL Database Utility Module

This module provides a set of utility functions to interact with a MySQL database using the `mysql2` library. It includes functions for connecting to the database, creating tables, inserting data, querying data with various conditions, updating records, deleting records, and executing raw SQL queries.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Functions](#functions)
    - [connect](#connect)
    - [disconnect](#disconnect)
    - [createTable](#createtable)
    - [insert](#insert)
    - [findAll](#findall)
    - [findColumns](#findcolumns)
    - [findByWhere](#findbywhere)
    - [findByOR](#findbyor)
    - [findGroup](#findgroup)
    - [findGroupByOR](#findgroupbyor)
    - [findGroupByORAND](#findgroupbyorand)
    - [findGroupByANDOR](#findgroupbyandor)
    - [findWithOrderASC](#findwithorderasc)
    - [findWithOrderASCbyOR](#findwithorderascbyor)
    - [findWithOrderDESC](#findwithorderdesc)
    - [findWithOrderDESCbyOR](#findwithorderdescbyor)
    - [find](#find)
    - [update](#update)
    - [deleteRecords](#deleterecords)
    - [rawQuery](#rawquery)
4. [Test Cases](#test-cases)
5. [Error Handling](#error-handling)
6. [License](#license)

## Installation

To use this module, you need to have Node.js and the `alpha-sql` library installed. You can install the `alpha-sql` library using npm:

```bash
npm install alpha-sql
```

## Usage

First, require the module in your JavaScript file:

```javascript
const dbUtils = require('alpha-sql');
```

Then, you can use the functions provided by the module to interact with your MySQL database.

## Functions

### connect

Connects to the MySQL database using the provided configuration object.

**Parameters:**
- `obj` (Object): Configuration object containing database connection details (e.g., host, user, password, database).

**Returns:**
- `Promise`: Resolves with the connection object if the connection is successful, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.connect({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'testdb'
}).then(connection => {
    console.log('Connected to the database');
}).catch(err => {
    console.error('Connection error:', err);
});
```

### disconnect

Disconnects from the MySQL database.

**Returns:**
- `Promise`: Resolves if the disconnection is successful, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.disconnect().then(() => {
    console.log('Disconnected from the database');
}).catch(err => {
    console.error('Disconnection error:', err);
});
```

### createTable

Creates a table in the database with the specified name and schema.

**Parameters:**
- `tableName` (String): Name of the table to create.
- `schemaObj` (Object): Object defining the table schema. Each key is a column name, and the value is an object or string defining the column properties.

**Returns:**
- `Promise`: Resolves if the table is created successfully, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.createTable('users', {
    id: { type: 'INT', isnull: false, isprimarykey: true },
    name: { type: 'VARCHAR(255)', isnull: false },
    email: { type: 'VARCHAR(255)', isnull: false },
    created_at: { type: 'TIMESTAMP', isnull: false, default: 'CURRENT_TIMESTAMP' }
}).then(() => {
    console.log('Table created successfully');
}).catch(err => {
    console.error('Table creation error:', err);
});
```

### insert

Inserts a new record into the specified table.

**Parameters:**
- `tableName` (String): Name of the table to insert the record into.
- `dataObj` (Object): Object containing the data to insert. Each key is a column name, and the value is the data to insert into that column.

**Returns:**
- `Promise`: Resolves with the result of the insert operation, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.insert('users', {
    name: 'John Doe',
    email: 'john.doe@example.com'
}).then(result => {
    console.log('Record inserted successfully:', result);
}).catch(err => {
    console.error('Insert error:', err);
});
```

### findAll

Retrieves all records from the specified table.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findAll('users', { limit: 10, offset: 0 }).then(results => {
    console.log('All users:', results);
}).catch(err => {
    console.error('Find all error:', err);
});
```

### findColumns

Retrieves specific columns from the specified table.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `colArray` (Array): Array of column names to retrieve.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findColumns('users', ['id', 'name'], { limit: 10, offset: 0 }).then(results => {
    console.log('Selected columns:', results);
}).catch(err => {
    console.error('Find columns error:', err);
});
```

### findByWhere

Retrieves records from the specified table that match the given conditions (AND).

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `obj` (Object): Object containing the conditions to match. Each key is a column name, and the value is the value to match.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findByWhere('users', { name: 'John Doe' }, { limit: 10, offset: 0 }).then(results => {
    console.log('Matching records:', results);
}).catch(err => {
    console.error('Find by where error:', err);
});
```

### findByOR

Retrieves records from the specified table that match any of the given conditions (OR).

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `obj` (Object): Object containing the conditions to match. Each key is a column name, and the value is the value to match.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findByOR('users', { name: 'John Doe', email: 'jane.doe@example.com' }, { limit: 10, offset: 0 }).then(results => {
    console.log('Matching records:', results);
}).catch(err => {
    console.error('Find by OR error:', err);
});
```

### findGroup

Retrieves records from the specified table, grouped by the given columns, with optional WHERE and HAVING conditions (AND).

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `groupByCols` (Array): Array of column names to group by.
- `havingObj` (Object): Object containing the HAVING conditions to match. Each key is a column name, and the value is the value to match.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `selectedCols` (Array): Array of column names to retrieve. Default is `['*']`.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findGroup('users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }, ['id', 'name'], { limit: 10, offset: 0 }).then(results => {
    console.log('Grouped records:', results);
}).catch(err => {
    console.error('Find group error:', err);
});
```

### findGroupByOR

Retrieves records from the specified table, grouped by the given columns, with optional WHERE (OR) and HAVING (OR) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `groupByCols` (Array): Array of column names to group by.
- `havingObj` (Object): Object containing the HAVING conditions to match. Each key is a column name, and the value is the value to match.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `selectedCols` (Array): Array of column names to retrieve. Default is `['*']`.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findGroupByOR('users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }, ['id', 'name'], { limit: 10, offset: 0 }).then(results => {
    console.log('Grouped records:', results);
}).catch(err => {
    console.error('Find group by OR error:', err);
});
```

### findGroupByORAND

Retrieves records from the specified table, grouped by the given columns, with optional WHERE (OR) and HAVING (AND) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `groupByCols` (Array): Array of column names to group by.
- `havingObj` (Object): Object containing the HAVING conditions to match. Each key is a column name, and the value is the value to match.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `selectedCols` (Array): Array of column names to retrieve. Default is `['*']`.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findGroupByORAND('users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }, ['id', 'name'], { limit: 10, offset: 0 }).then(results => {
    console.log('Grouped records:', results);
}).catch(err => {
    console.error('Find group by OR AND error:', err);
});
```

### findGroupByANDOR

Retrieves records from the specified table, grouped by the given columns, with optional WHERE (AND) and HAVING (OR) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `groupByCols` (Array): Array of column names to group by.
- `havingObj` (Object): Object containing the HAVING conditions to match. Each key is a column name, and the value is the value to match.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `selectedCols` (Array): Array of column names to retrieve. Default is `['*']`.
- `options` (Object): Optional parameters for limiting and offsetting the results.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findGroupByANDOR('users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }, ['id', 'name'], { limit: 10, offset: 0 }).then(results => {
    console.log('Grouped records:', results);
}).catch(err => {
    console.error('Find group by AND OR error:', err);
});
```

### findWithOrderASC

Retrieves records from the specified table, ordered by the given column in ascending order, with optional WHERE (AND) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `options` (Object): Optional parameters for ordering, limiting, and offsetting the results.
    - `orderBy` (String): Column name to order by.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findWithOrderASC('users', { name: 'John Doe' }, { orderBy: 'id', limit: 10, offset: 0 }).then(results => {
    console.log('Ordered records:', results);
}).catch(err => {
    console.error('Find with order ASC error:', err);
});
```

### findWithOrderASCbyOR

Retrieves records from the specified table, ordered by the given column in ascending order, with optional WHERE (OR) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `options` (Object): Optional parameters for ordering, limiting, and offsetting the results.
    - `orderBy` (String): Column name to order by.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findWithOrderASCbyOR('users', { name: 'John Doe', email: 'jane.doe@example.com' }, { orderBy: 'id', limit: 10, offset: 0 }).then(results => {
    console.log('Ordered records:', results);
}).catch(err => {
    console.error('Find with order ASC by OR error:', err);
});
```

### findWithOrderDESC

Retrieves records from the specified table, ordered by the given column in descending order, with optional WHERE (AND) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `options` (Object): Optional parameters for ordering, limiting, and offsetting the results.
    - `orderBy` (String): Column name to order by.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findWithOrderDESC('users', { name: 'John Doe' }, { orderBy: 'id', limit: 10, offset: 0 }).then(results => {
    console.log('Ordered records:', results);
}).catch(err => {
    console.error('Find with order DESC error:', err);
});
```

### findWithOrderDESCbyOR

Retrieves records from the specified table, ordered by the given column in descending order, with optional WHERE (OR) conditions.

**Parameters:**
- `tableName` (String): Name of the table to retrieve records from.
- `whereObj` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
- `options` (Object): Optional parameters for ordering, limiting, and offsetting the results.
    - `orderBy` (String): Column name to order by.
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.findWithOrderDESCbyOR('users', { name: 'John Doe', email: 'jane.doe@example.com' }, { orderBy: 'id', limit: 10, offset: 0 }).then(results => {
    console.log('Ordered records:', results);
}).catch(err => {
    console.error('Find with order DESC by OR error:', err);
});
```

### find

A general-purpose function to retrieve records from the specified table with various options.

**Parameters:**
- `options` (Object): Object containing the options for the query.
    - `table` (String): Name of the table to retrieve records from.
    - `columns` (Array): Array of column names to retrieve. Default is `['*']`.
    - `where` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
    - `or` (Object): Object containing the OR conditions to match. Each key is a column name, and the value is the value to match.
    - `groupBy` (Array): Array of column names to group by.
    - `having` (Object): Object containing the HAVING conditions to match. Each key is a column name, and the value is the value to match.
    - `orderBy` (Object): Object containing the ORDER BY conditions. Each key is a column name, and the value is the sorting direction ('ASC' or 'DESC').
    - `limit` (Number): Maximum number of records to retrieve.
    - `offset` (Number): Number of records to skip.
    - `joins` (Array): Array of join objects. Each object contains the type of join, the table to join, and the ON condition.
    - `distinct` (Boolean): Whether to retrieve distinct records. Default is `false`.
    - `alias` (String): Alias for the table.
    - `subqueries` (Object): Object containing subqueries. Each key is an alias, and the value is the subquery string.
    - `expressions` (Array): Array of expression strings to include in the SELECT clause.
    - `filters` (Object): Object containing custom filter conditions. Each key is a column name, and the value is an object containing the operator and the value to match.
    - `functions` (Array): Array of function strings to include in the SELECT clause.
    - `window` (String): Window clause for the query.
    - `withClause` (String): WITH clause for the query.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.find({
    table: 'users',
    columns: ['id', 'name'],
    where: { name: 'John Doe' },
    or: { email: 'jane.doe@example.com' },
    groupBy: ['name'],
    having: { email: 'john.doe@example.com' },
    orderBy: { id: 'ASC' },
    limit: 10,
    offset: 0,
    joins: [{ type: 'INNER', table: 'orders', on: { left: 'users.id', right: 'orders.user_id' } }],
    distinct: true,
    alias: 'u',
    subqueries: { total_orders: 'SELECT COUNT(*) FROM orders WHERE orders.user_id = u.id' },
    expressions: ['CONCAT(u.first_name, " ", u.last_name) AS full_name'],
    filters: { created_at: { '>': '2023-01-01' } },
    functions: ['COUNT(*) AS total_users'],
    window: 'my_window AS (PARTITION BY u.name ORDER BY u.id)',
    withClause: 'my_cte AS (SELECT * FROM users)'
}).then(results => {
    console.log('Query results:', results);
}).catch(err => {
    console.error('Find error:', err);
});
```

### update

Updates records in the specified table that match the given conditions.

**Parameters:**
- `options` (Object): Object containing the options for the update operation.
    - `table` (String): Name of the table to update records in.
    - `set` (Object): Object containing the columns to update and their new values. Each key is a column name, and the value is the new value.
    - `where` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
    - `or` (Object): Object containing the OR conditions to match. Each key is a column name, and the value is the value to match.
    - `joins` (Array): Array of join objects. Each object contains the type of join, the table to join, and the ON condition.
    - `filters` (Object): Object containing custom filter conditions. Each key is a column name, and the value is an object containing the operator and the value to match.
    - `orderBy` (Object): Object containing the ORDER BY conditions. Each key is a column name, and the value is the sorting direction ('ASC' or 'DESC').
    - `limit` (Number): Maximum number of records to update.
    - `alias` (String): Alias for the table.

**Returns:**
- `Promise`: Resolves with the result of the update operation, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.update({
    table: 'users',
    set: { name: 'Jane Doe' },
    where: { id: 1 },
    or: { email: 'john.doe@example.com' },
    joins: [{ type: 'INNER', table: 'orders', on: { left: 'users.id', right: 'orders.user_id' } }],
    filters: { created_at: { '>': '2023-01-01' } },
    orderBy: { id: 'ASC' },
    limit: 1,
    alias: 'u'
}).then(result => {
    console.log('Update result:', result);
}).catch(err => {
    console.error('Update error:', err);
});
```

### deleteRecords

Deletes records from the specified table that match the given conditions.

**Parameters:**
- `options` (Object): Object containing the options for the delete operation.
    - `table` (String): Name of the table to delete records from.
    - `where` (Object): Object containing the WHERE conditions to match. Each key is a column name, and the value is the value to match.
    - `or` (Object): Object containing the OR conditions to match. Each key is a column name, and the value is the value to match.
    - `filters` (Object): Object containing custom filter conditions. Each key is a column name, and the value is an object containing the operator and the value to match.
    - `joins` (Array): Array of join objects. Each object contains the type of join, the table to join, and the ON condition.
    - `alias` (String): Alias for the table.
    - `orderBy` (Object): Object containing the ORDER BY conditions. Each key is a column name, and the value is the sorting direction ('ASC' or 'DESC').
    - `limit` (Number): Maximum number of records to delete.
    - `offset` (Number): Number of records to skip.

**Returns:**
- `Promise`: Resolves with the result of the delete operation, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.deleteRecords({
    table: 'users',
    where: { id: 1 },
    or: { email: 'john.doe@example.com' },
    filters: { created_at: { '<': '2023-01-01' } },
    joins: [{ type: 'INNER', table: 'orders', on: { left: 'users.id', right: 'orders.user_id' } }],
    alias: 'u',
    orderBy: { id: 'ASC' },
    limit: 1,
    offset: 0
}).then(result => {
    console.log('Delete result:', result);
}).catch(err => {
    console.error('Delete error:', err);
});
```

### rawQuery

Executes a raw SQL query.

**Parameters:**
- `sql` (String): The SQL query to execute.
- `values` (Array): Array of values to use in the query.

**Returns:**
- `Promise`: Resolves with an array of records, rejects with an error otherwise.

**Example:**

```javascript
dbUtils.rawQuery('SELECT * FROM users WHERE id = ?', [1]).then(results => {
    console.log('Raw query results:', results);
}).catch(err => {
    console.error('Raw query error:', err);
});
```

## Test Cases

### connect

1. **Valid Configuration:**
    - Input: `{ host: 'localhost', user: 'root', password: 'password', database: 'testdb' }`
    - Expected Output: Resolves with the connection object.

2. **Invalid Configuration:**
    - Input: `{ host: 'localhost', user: 'root', password: 'wrongpassword', database: 'testdb' }`
    - Expected Output: Rejects with an error.

### disconnect

1. **Active Connection:**
    - Input: None
    - Expected Output: Resolves successfully.

2. **No Active Connection:**
    - Input: None
    - Expected Output: Resolves successfully with a warning.

### createTable

1. **Valid Schema:**
    - Input: `'users', { id: { type: 'INT', isnull: false, isprimarykey: true }, name: { type: 'VARCHAR(255)', isnull: false } }`
    - Expected Output: Resolves successfully.

2. **Invalid Schema:**
    - Input: `'users', { id: { type: 'INVALID_TYPE', isnull: false, isprimarykey: true } }`
    - Expected Output: Rejects with an error.

### insert

1. **Valid Data:**
    - Input: `'users', { name: 'John Doe', email: 'john.doe@example.com' }`
    - Expected Output: Resolves with the result of the insert operation.

2. **Invalid Data:**
    - Input: `'users', { invalid_column: 'value' }`
    - Expected Output: Rejects with an error.

### findAll

1. **No Options:**
    - Input: `'users'`
    - Expected Output: Resolves with an array of all records.

2. **With Limit and Offset:**
    - Input: `'users', { limit: 10, offset: 0 }`
    - Expected Output: Resolves with an array of up to 10 records.

### findColumns

1. **Valid Columns:**
    - Input: `'users', ['id', 'name']`
    - Expected Output: Resolves with an array of records containing only the specified columns.

2. **Invalid Columns:**
    - Input: `'users', ['invalid_column']`
    - Expected Output: Rejects with an error.

### findByWhere

1. **Matching Records:**
    - Input: `'users', { name: 'John Doe' }`
    - Expected Output: Resolves with an array of matching records.

2. **No Matching Records:**
    - Input: `'users', { name: 'Nonexistent User' }`
    - Expected Output: Resolves with an empty array.

### findByOR

1. **Matching Records:**
    - Input: `'users', { name: 'John Doe', email: 'jane.doe@example.com' }`
    - Expected Output: Resolves with an array of matching records.

2. **No Matching Records:**
    - Input: `'users', { name: 'Nonexistent User', email: 'nonexistent@example.com' }`
    - Expected Output: Resolves with an empty array.

### findGroup

1. **Valid Group By:**
    - Input: `'users', ['name'], {}, { name: 'John Doe' }`
    - Expected Output: Resolves with an array of grouped records.

2. **Invalid Group By:**
    - Input: `'users', ['invalid_column'], {}, {}`
    - Expected Output: Rejects with an error.

### findGroupByOR

1. **Valid Group By with OR:**
    - Input: `'users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }`
    - Expected Output: Resolves with an array of grouped records.

2. **Invalid Group By with OR:**
    - Input: `'users', ['invalid_column'], { email: 'john.doe@example.com' }, {}`
    - Expected Output: Rejects with an error.

### findGroupByORAND

1. **Valid Group By with OR AND:**
    - Input: `'users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }`
    - Expected Output: Resolves with an array of grouped records.

2. **Invalid Group By with OR AND:**
    - Input: `'users', ['invalid_column'], { email: 'john.doe@example.com' }, {}`
    - Expected Output: Rejects with an error.

### findGroupByANDOR

1. **Valid Group By with AND OR:**
    - Input: `'users', ['name'], { email: 'john.doe@example.com' }, { name: 'John Doe' }`
    - Expected Output: Resolves with an array of grouped records.

2. **Invalid Group By with AND OR:**
    - Input: `'users', ['invalid_column'], { email: 'john.doe@example.com' }, {}`
    - Expected Output: Rejects with an error.

### findWithOrderASC

1. **Valid Order By ASC:**
    - Input: `'users', { name: 'John Doe' }, { orderBy: 'id' }`
    - Expected Output: Resolves with an array of ordered records.

2. **Invalid Order By ASC:**
    - Input: `'users', { name: 'John Doe' }, { orderBy: 'invalid_column' }`
    - Expected Output: Rejects with an error.

### findWithOrderASCbyOR

1. **Valid Order By ASC with OR:**
    - Input: `'users', { name: 'John Doe', email: 'jane.doe@example.com' }, { orderBy: 'id' }`
    - Expected Output: Resolves with an array of ordered records.

2. **Invalid Order By ASC with OR:**
    - Input: `'users', { name: 'John Doe', email: 'jane.doe@example.com' }, { orderBy: 'invalid_column' }`
    - Expected Output: Rejects with an error.

### findWithOrderDESC

1. **Valid Order By DESC:**
    - Input: `'users', { name: 'John Doe' }, { orderBy: 'id' }`
    - Expected Output: Resolves with an array of ordered records.

2. **Invalid Order By DESC:**
    - Input: `'users', { name: 'John Doe' }, { orderBy: 'invalid_column' }`
    - Expected Output: Rejects with an error.

### findWithOrderDESCbyOR

1. **Valid Order By DESC with OR:**
    - Input: `'users', { name: 'John Doe', email: 'jane.doe@example.com' }, { orderBy: 'id' }`
    - Expected Output: Resolves with an array of ordered records.

2. **Invalid Order By DESC with OR:**
    - Input: `'users', { name: 'John Doe', email: 'jane.doe@example.com' }, { orderBy: 'invalid_column' }`
    - Expected Output: Rejects with an error.

### find

1. **Valid Query:**
    - Input: `{ table: 'users', columns: ['id', 'name'], where: { name: 'John Doe' } }`
    - Expected Output: Resolves with an array of matching records.

2. **Invalid Query:**
    - Input: `{ table: 'invalid_table', columns: ['id', 'name'], where: { name: 'John Doe' } }`
    - Expected Output: Rejects with an error.

### update

1. **Valid Update:**
    - Input: `{ table: 'users', set: { name: 'Jane Doe' }, where: { id: 1 } }`
    - Expected Output: Resolves with the result of the update operation.

2. **Invalid Update:**
    - Input: `{ table: 'users', set: { invalid_column: 'value' }, where: { id: 1 } }`
    - Expected Output: Rejects with an error.

### deleteRecords

1. **Valid Delete:**
    - Input: `{ table: 'users', where: { id: 1 } }`
    - Expected Output: Resolves with the result of the delete operation.

2. **Invalid Delete:**
    - Input: `{ table: 'invalid_table', where: { id: 1 } }`
    - Expected Output: Rejects with an error.

### rawQuery

1. **Valid Query:**
    - Input: `'SELECT * FROM users WHERE id = ?', [1]`
    - Expected Output: Resolves with an array of matching records.

2. **Invalid Query:**
    - Input: `'INVALID SQL QUERY', []`
    - Expected Output: Rejects with an error.

## Error Handling

The module handles errors by rejecting promises with error objects. Errors are also logged to the console for debugging purposes. It is recommended to handle errors in your application code to provide user-friendly error messages.

## License

This module is licensed under the MIT License. See the LICENSE file for more information.