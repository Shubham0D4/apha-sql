const mysql = require("mysql2");

let connection = null;

// Function to connect to the database
function connect(obj) {
    return new Promise((resolve, reject) => {
        connection = mysql.createConnection(obj);

        connection.connect(err => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

// Function to disconnect the database
function disconnect() {
    return new Promise((resolve, reject) => {
        if (!connection) {
            console.warn("No active connection to disconnect.");
            return resolve();
        }

        connection.end(err => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                connection = null;
                resolve();
            }
        });
    });
}

// Function to create a table
function createTable(tableName, schemaObj) {
    return new Promise((resolve, reject) => {
        try {
            const columns = [];

            for (const [colName, props] of Object.entries(schemaObj)) {
                if (typeof props === "string") {
                    columns.push(`\`${colName}\` ${props}`);
                    continue;
                }

                let colDef = `\`${colName}\` ${props.type}`;
                if (props.isnull === false) colDef += " NOT NULL";
                if (props.isprimarykey === true) colDef += " PRIMARY KEY";

                columns.push(colDef);
            }

            for (const [colName, props] of Object.entries(schemaObj)) {
                if (props.isRefKey && props.refCol) {
                    const colDef = `FOREIGN KEY (\`${colName}\`) REFERENCES \`${props.refCol.table}\`(\`${props.refCol.column}\`)`;
                    columns.push(colDef);
                }
            }

            const query = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columns.join(", ")});`;
            connection.query(query);
            console.log(`Table '${tableName}' created successfully.`);
            resolve();
        } catch (err) {
            console.error( err);
            reject(err);
        }
    });
}

//function to insert values in table
function insert(tableName, dataObj = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName || Object.keys(dataObj).length === 0) {
            return reject(new Error("Table name and data object are required."));
        }

        const columns = Object.keys(dataObj).map(col => `\`${col}\``).join(", ");
        const placeholders = Object.keys(dataObj).map(() => "?").join(", ");
        const values = Object.values(dataObj);

        const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

        connection
            .promise()
            .query(sql, values)
            .then(([result]) => resolve(result))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

// Function to fetch all rows
function findAll(tableName, options = {}) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM \`${tableName}\``;
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        query+= limit+offset
        connection.query(query, (err, results) => {
            if (err){
                console.log(err);
                return reject(err);
            } 
            resolve(results);;
        });
    });
}

// Function to fetch specific columns
function findColumns(tableName, colArray = [], options = {}) {
    return new Promise((resolve, reject) => {
        const columns = colArray.length > 0 ? colArray.join(", ") : "*";
        let query = `SELECT ${columns} FROM \`${tableName}\``;
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        query+= limit+offset

        connection.query(query, (err, results) => {
            if (err){
                console.log(err);
                return reject(err);
            } 
            resolve(results);
        });
    });
}

// Function to find with WHERE (AND)
function findByWhere(tableName, obj = {}, options = {}) {
    return new Promise((resolve, reject) => {
        if (!obj || Object.keys(obj).length === 0) {
            const limit = options.limit ? `LIMIT ${options.limit}` : "";
            const offset = options.offset ? `OFFSET ${options.offset}` : "";
            return connection.query(`SELECT * FROM \`${tableName}\` \`${limit}\` \`${offset}\``, (err, results) => {
                if (err){
                    console.log(err);
                    return reject(err);
                } 
                resolve(results);
            });
        }

        const keys = Object.keys(obj);
        const values = Object.values(obj);
        const whereClause = keys.map(key => `\`${key}\` = ?`).join(" AND ");
        let query = `SELECT * FROM \`${tableName}\` WHERE ${whereClause}`;

        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        query+= limit+offset

        connection.query(query, values, (err, results) => {
            if (err){
                console.log(err);
                return reject(err);
            } 
            resolve(results);
        });
    });
}

// Function to find with WHERE (OR)
function findByOR(tableName, obj = {}, options = {}) {
    return new Promise((resolve, reject) => {
        if (!obj || Object.keys(obj).length === 0) {
            const limit = options.limit ? `LIMIT ${options.limit}` : "";
            const offset = options.offset ? `OFFSET ${options.offset}` : "";
            return connection.query(`SELECT * FROM \`${tableName}\` \`${limit}\` \`${offset}\``, (err, results) => {
                if (err){
                    console.log(err);
                    return reject(err);
                } 
                resolve(results);
            });
        }

        const keys = Object.keys(obj);
        const values = Object.values(obj);
        const whereClause = keys.map(key => `\`${key}\` = ?`).join(" OR ");
        let query = `SELECT * FROM \`${tableName}\` WHERE ${whereClause}`;
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        query+= limit+offset

        connection.query(query, values, (err, results) => {
            if (err){
                console.log(err);
                return reject(err);
            } 
            resolve(results);
        });
    });
}

//function to find data but using group by - - default and for where and having
function findGroup(tableName, groupByCols = [], havingObj = {}, whereObj = {}, selectedCols = ['*'], options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName || groupByCols.length === 0) {
            return reject(new Error("Table name and groupByCols are required."));
        }

        const values = [];
        let sql = `SELECT ${selectedCols.join(", ")} FROM \`${tableName}\``;

        // WHERE Clause
        if (Object.keys(whereObj).length > 0) {
            const whereClause = Object.keys(whereObj)
                .map(key => {
                    values.push(whereObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }

        // GROUP BY
        sql += ` GROUP BY ${groupByCols.map(col => `\`${col}\``).join(", ")}`;

        // HAVING Clause
        if (Object.keys(havingObj).length > 0) {
            const havingClause = Object.keys(havingObj)
                .map(key => {
                    values.push(havingObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" AND ");
            sql += ` HAVING ${havingClause}`;
        }

        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        sql+= limit+offset

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//function to find data but using group by - - or for where and having
function findGroupByOR(tableName, groupByCols = [], havingObj = {}, whereObj = {}, selectedCols = ['*'], options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName || groupByCols.length === 0) {
            return reject(new Error("Table name and groupByCols are required."));
        }

        const values = [];
        let sql = `SELECT ${selectedCols.join(", ")} FROM \`${tableName}\``;

        // WHERE Clause
        if (Object.keys(whereObj).length > 0) {
            const whereClause = Object.keys(whereObj)
                .map(key => {
                    values.push(whereObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" OR ");
            sql += ` WHERE ${whereClause}`;
        }

        // GROUP BY
        sql += ` GROUP BY ${groupByCols.map(col => `\`${col}\``).join(", ")}`;

        // HAVING Clause
        if (Object.keys(havingObj).length > 0) {
            const havingClause = Object.keys(havingObj)
                .map(key => {
                    values.push(havingObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" OR ");
            sql += ` HAVING ${havingClause}`;
        }
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        sql+= limit+offset


        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error( err);
                reject(err);
            });
    });
}

//function to find data but using group by - - or for where and and for having
function findGroupByORAND(tableName, groupByCols = [], havingObj = {}, whereObj = {}, selectedCols = ['*'], options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName || groupByCols.length === 0) {
            return reject(new Error("Table name and groupByCols are required."));
        }

        const values = [];
        let sql = `SELECT ${selectedCols.join(", ")} FROM \`${tableName}\``;

        // WHERE Clause
        if (Object.keys(whereObj).length > 0) {
            const whereClause = Object.keys(whereObj)
                .map(key => {
                    values.push(whereObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" OR ");
            sql += ` WHERE ${whereClause}`;
        }

        // GROUP BY
        sql += ` GROUP BY ${groupByCols.map(col => `\`${col}\``).join(", ")}`;

        // HAVING Clause
        if (Object.keys(havingObj).length > 0) {
            const havingClause = Object.keys(havingObj)
                .map(key => {
                    values.push(havingObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" AND ");
            sql += ` HAVING ${havingClause}`;
        }
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        sql+= limit+offset

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//function to find data but using group by - - and for where and or for having
function findGroupByANDOR(tableName, groupByCols = [], havingObj = {}, whereObj = {}, selectedCols = ['*'], options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName || groupByCols.length === 0) {
            return reject(new Error("Table name and groupByCols are required."));
        }

        const values = [];
        let sql = `SELECT ${selectedCols.join(", ")} FROM \`${tableName}\``;

        // WHERE Clause
        if (Object.keys(whereObj).length > 0) {
            const whereClause = Object.keys(whereObj)
                .map(key => {
                    values.push(whereObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }

        // GROUP BY
        sql += ` GROUP BY ${groupByCols.map(col => `\`${col}\``).join(", ")}`;

        // HAVING Clause
        if (Object.keys(havingObj).length > 0) {
            const havingClause = Object.keys(havingObj)
                .map(key => {
                    values.push(havingObj[key]);
                    return `\`${key}\` = ?`;
                })
                .join(" OR ");
            sql += ` HAVING ${havingClause}`;
        }

        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";
        sql+= limit+offset

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//function to use order by ASC and limit and offset - -default and
function findWithOrderASC(tableName, whereObj = {}, options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName) return reject(new Error("Table name is required."));

        const whereKeys = Object.keys(whereObj);
        const whereClause = whereKeys.length > 0
            ? "WHERE " + whereKeys.map(k => `\`${k}\` = ?`).join(" AND ")
            : "";

        const orderBy = options.orderBy ? `ORDER BY \`${options.orderBy}\` ${options.order || 'ASC'}` : "";
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";

        const sql = `SELECT * FROM \`${tableName}\` ${whereClause} ${orderBy} ${limit} ${offset}`.trim();
        const values = Object.values(whereObj);

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error("Query Error:", err);
                reject(err);
            });
    });
}

//function to use order by ASC and limit and offset - -default and
function findWithOrderASCbyOR(tableName, whereObj = {}, options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName) return reject(new Error("Table name is required."));

        const whereKeys = Object.keys(whereObj);
        const whereClause = whereKeys.length > 0
            ? "WHERE " + whereKeys.map(k => `\`${k}\` = ?`).join(" OR ")
            : "";

        const orderBy = options.orderBy ? `ORDER BY \`${options.orderBy}\` ${options.order || 'ASC'}` : "";
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";

        const sql = `SELECT * FROM \`${tableName}\` ${whereClause} ${orderBy} ${limit} ${offset}`.trim();
        const values = Object.values(whereObj);

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error("Query Error:", err);
                reject(err);
            });
    });
}

//function to use order by DESC and limit and offset - -default and
function findWithOrderDESC(tableName, whereObj = {}, options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName) return reject(new Error("Table name is required."));

        const whereKeys = Object.keys(whereObj);
        const whereClause = whereKeys.length > 0
            ? "WHERE " + whereKeys.map(k => `\`${k}\` = ?`).join(" AND ")
            : "";

        const orderBy = options.orderBy ? `ORDER BY \`${options.orderBy}\` ${options.order || 'DESC'}` : "";
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";

        const sql = `SELECT * FROM \`${tableName}\` ${whereClause} ${orderBy} ${limit} ${offset}`.trim();
        const values = Object.values(whereObj);

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error("Query Error:", err);
                reject(err);
            });
    });
}

//function to use order by DESC and limit and offset - -default and
function findWithOrderDESCbyOR(tableName, whereObj = {}, options = {}) {
    return new Promise((resolve, reject) => {
        if (!tableName) return reject(new Error("Table name is required."));

        const whereKeys = Object.keys(whereObj);
        const whereClause = whereKeys.length > 0
            ? "WHERE " + whereKeys.map(k => `\`${k}\` = ?`).join(" OR ")
            : "";

        const orderBy = options.orderBy ? `ORDER BY \`${options.orderBy}\` ${options.order || 'DESC'}` : "";
        const limit = options.limit ? `LIMIT ${options.limit}` : "";
        const offset = options.offset ? `OFFSET ${options.offset}` : "";

        const sql = `SELECT * FROM \`${tableName}\` ${whereClause} ${orderBy} ${limit} ${offset}`.trim();
        const values = Object.values(whereObj);

        connection
            .promise()
            .query(sql, values)
            .then(([rows]) => resolve(rows))
            .catch(err => {
                console.error("Query Error:", err);
                reject(err);
            });
    });
}

//general purpose find - all cases included
function find(options = {}) {
    return new Promise((resolve, reject) => {
      const {
        table,
        columns = ["*"],
        where = {},
        or = {},
        groupBy = [],
        having = {},
        orderBy = {},
        limit,
        offset,
        joins = [],
        distinct = false,
        alias = null,
        subqueries = {},
        expressions = [],
        filters = {},
        functions = [],
        window = null,
        withClause = null
      } = options;
      
      if (!table) return reject(new Error("Table name is required"));
      
      const values = [];
      let sql = '';
      
      // WITH clause
      if (withClause) {
        sql += `WITH ${withClause} `;
      }
      
      // SELECT clause
      const selectColumns = [
        ...columns.map(col => col === "*" ? "*" : `\`${col}\``),
        ...functions,
        ...expressions,
        ...Object.entries(subqueries).map(([alias, sub]) => `(${sub}) AS \`${alias}\``)
      ];
      
      sql += `SELECT ${distinct ? "DISTINCT " : ""}${selectColumns.join(", ")} FROM \`${table}\`${alias ? ` AS \`${alias}\`` : ""}`;
      
      // JOINs
      joins.forEach(join => {
        const { type = "INNER", table, on } = join;
        if (!table || !on?.left || !on?.right) return;
        sql += ` ${type.toUpperCase()} JOIN \`${table}\` ON \`${on.left}\` = \`${on.right}\``;
      });
      
      // WHERE clause
      const whereKeys = Object.keys(where);
      const filterKeys = Object.keys(filters);
      
      if (whereKeys.length > 0 || filterKeys.length > 0) {
        sql += ` WHERE `;
        
        // Standard WHERE conditions
        if (whereKeys.length > 0) {
          sql += whereKeys.map(k => {
            values.push(where[k]);
            return `\`${k}\` = ?`;
          }).join(" AND ");
        }
        
        // Custom filters
        if (filterKeys.length > 0) {
          if (whereKeys.length > 0) sql += " AND ";
          
          sql += filterKeys.map(key => {
            const filter = filters[key];
            if (typeof filter === 'object') {
              const operator = Object.keys(filter)[0];
              values.push(filter[operator]);
              return `\`${key}\` ${operator} ?`;
            } else {
              values.push(filter);
              return `\`${key}\` = ?`;
            }
          }).join(" AND ");
        }
      }
      
      // OR conditions
      const orKeys = Object.keys(or);
      if (orKeys.length > 0) {
        sql += (whereKeys.length > 0 || filterKeys.length > 0) ? " AND (" : " WHERE (";
        sql += orKeys.map(k => {
          values.push(or[k]);
          return `\`${k}\` = ?`;
        }).join(" OR ") + ")";
      }
      
      // GROUP BY
      if (groupBy.length > 0) {
        sql += ` GROUP BY ${groupBy.map(g => `\`${g}\``).join(", ")}`;
      }
      
      // HAVING
      const havingKeys = Object.keys(having);
      if (havingKeys.length > 0) {
        sql += ` HAVING ${havingKeys.map(col => {
          const operator = Object.keys(having[col])[0];
          const val = having[col][operator];
          values.push(val);
          return `\`${col}\` ${operator} ?`;
        }).join(" AND ")}`;
      }
      
      // WINDOW clause
      if (window) {
        sql += ` WINDOW ${window}`;
      }
      
      // ORDER BY
      const orderKeys = Object.keys(orderBy);
      if (orderKeys.length > 0) {
        sql += ` ORDER BY ${orderKeys.map(col => {
          const direction = orderBy[col].toUpperCase();
          return `\`${col}\` ${direction}`;
        }).join(", ")}`;
      }
      
      // LIMIT & OFFSET
      if (limit != null) sql += ` LIMIT ${parseInt(limit, 10)}`;
      if (offset != null) sql += ` OFFSET ${parseInt(offset, 10)}`;
      
      try {
        // Assuming connection is a global variable
        // If connection is not available, provide a helpful error
        if (!connection) {
          return reject(new Error("Database connection is not available"));
        }
        
        connection.promise()
          .query(sql, values)
          .then(([rows]) => resolve(rows))
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
}


// function to update operation
function update(options = {}) {
    return new Promise((resolve, reject) => {
      const {
        table,
        set = {},
        where = {},
        or = {},
        joins = [],
        filters = {},
        orderBy = {},
        limit,
        alias = null
      } = options;
  
      if (!table) return reject(new Error("Table name is required"));
      if (!set || Object.keys(set).length === 0) return reject(new Error("Set values are required"));
  
      let sql = `UPDATE \`${table}\`${alias ? ` AS \`${alias}\`` : ""}`;
      const values = [];
  
      // JOINs
      joins.forEach(join => {
        const { type = "INNER", table: joinTable, on } = join;
        if (!joinTable || !on?.left || !on?.right) return;
        sql += ` ${type.toUpperCase()} JOIN \`${joinTable}\` ON \`${on.left}\` = \`${on.right}\``;
      });
  
      // SET clause
      const setKeys = Object.keys(set);
      if (setKeys.length > 0) {
        const setClauses = setKeys.map(k => {
          values.push(set[k]);
          return `\`${k}\` = ?`;
        });
        sql += ` SET ${setClauses.join(", ")}`;
      }
  
      const whereKeys = Object.keys(where);
      const filterKeys = Object.keys(filters);
  
      // WHERE clause
      if (whereKeys.length > 0 || filterKeys.length > 0) {
        sql += ` WHERE `;
  
        // WHERE conditions
        if (whereKeys.length > 0) {
          sql += whereKeys.map(k => {
            values.push(where[k]);
            return `\`${k}\` = ?`;
          }).join(" AND ");
        }
  
        // Filter conditions
        if (filterKeys.length > 0) {
          if (whereKeys.length > 0) sql += " AND ";
  
          sql += filterKeys.map(key => {
            const filter = filters[key];
            if (typeof filter === 'object') {
              const operator = Object.keys(filter)[0];
              values.push(filter[operator]);
              return `\`${key}\` ${operator} ?`;
            } else {
              values.push(filter);
              return `\`${key}\` = ?`;
            }
          }).join(" AND ");
        }
      }
  
      // OR clause
      const orKeys = Object.keys(or);
      if (orKeys.length > 0) {
        sql += (whereKeys.length > 0 || filterKeys.length > 0) ? " AND (" : " WHERE (";
        sql += orKeys.map(k => {
          values.push(or[k]);
          return `\`${k}\` = ?`;
        }).join(" OR ") + ")";
      }
  
      // ORDER BY
      const orderKeys = Object.keys(orderBy);
      if (orderKeys.length > 0) {
        sql += ` ORDER BY ${orderKeys.map(col => {
          const direction = orderBy[col].toUpperCase();
          return `\`${col}\` ${direction}`;
        }).join(", ")}`;
      }
  
      // LIMIT
      if (limit != null) sql += ` LIMIT ${parseInt(limit, 10)}`;
  
      try {
        if (!connection) {
          return reject(new Error("Database connection is not available"));
        }
  
        connection.promise()
          .query(sql, values)
          .then(([result]) => resolve(result))
          .catch(err => {
            console.error(err);
            reject(err);
          });
  
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
}
  
//function to delete operation
function deleteRecords(options = {}) {
    return new Promise((resolve, reject) => {
      const {
        table,
        where = {},
        or = {},
        filters = {},
        joins = [],
        alias = null,
        orderBy = {},
        limit,
        offset
      } = options;
  
      if (!table) return reject(new Error("Table name is required"));
  
      const values = [];
      let sql = '';
  
      // SELECT table with alias if provided
      sql += `DELETE FROM \`${table}\`${alias ? ` AS \`${alias}\`` : ''}`;
  
      // JOINs (for complex delete queries)
      joins.forEach(join => {
        const { type = "INNER", table, on } = join;
        if (!table || !on?.left || !on?.right) return;
        sql += ` ${type.toUpperCase()} JOIN \`${table}\` ON \`${on.left}\` = \`${on.right}\``;
      });
  
      // WHERE clause
      const whereKeys = Object.keys(where);
      const filterKeys = Object.keys(filters);
  
      if (whereKeys.length > 0 || filterKeys.length > 0) {
        sql += ` WHERE `;
        
        // Standard WHERE conditions
        if (whereKeys.length > 0) {
          sql += whereKeys.map(k => {
            values.push(where[k]);
            return `\`${k}\` = ?`;
          }).join(" AND ");
        }
  
        // Custom filters
        if (filterKeys.length > 0) {
          if (whereKeys.length > 0) sql += " AND ";
  
          sql += filterKeys.map(key => {
            const filter = filters[key];
            if (typeof filter === 'object') {
              const operator = Object.keys(filter)[0];
              values.push(filter[operator]);
              return `\`${key}\` ${operator} ?`;
            } else {
              values.push(filter);
              return `\`${key}\` = ?`;
            }
          }).join(" AND ");
        }
      }
  
      // OR conditions
      const orKeys = Object.keys(or);
      if (orKeys.length > 0) {
        sql += (whereKeys.length > 0 || filterKeys.length > 0) ? " AND (" : " WHERE (";
        sql += orKeys.map(k => {
          values.push(or[k]);
          return `\`${k}\` = ?`;
        }).join(" OR ") + ")";
      }
  
      // ORDER BY (optional for delete operations)
      const orderKeys = Object.keys(orderBy);
      if (orderKeys.length > 0) {
        sql += ` ORDER BY ${orderKeys.map(col => {
          const direction = orderBy[col].toUpperCase();
          return `\`${col}\` ${direction}`;
        }).join(", ")}`;
      }
  
      // LIMIT and OFFSET
      if (limit != null) sql += ` LIMIT ${parseInt(limit, 10)}`;
      if (offset != null) sql += ` OFFSET ${parseInt(offset, 10)}`;
  
      try {
        // Assuming connection is a global variable
        // If connection is not available, provide a helpful error
        if (!connection) {
          return reject(new Error("Database connection is not available"));
        }
  
        // Execute the delete query
        connection.promise()
          .query(sql, values)
          .then(([result]) => resolve(result))
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
  
// general purpose function that supports raw queries
function rawQuery(sql, values = []) {
    return new Promise((resolve, reject) => {
      if (!sql || typeof sql !== 'string') {
        return reject(new Error("A valid SQL query string is required"));
      }
  
      if (!connection) {
        return reject(new Error("Database connection is not available"));
      }
  
      connection.promise()
        .query(sql, values)
        .then(([rows]) => resolve(rows))
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }

module.exports = {
    connect,
    disconnect,
    createTable,
    insert,
    findAll,
    findColumns,
    findByWhere,
    findByOR,
    findGroup,
    findGroupByOR,
    findGroupByORAND,
    findGroupByANDOR,
    findWithOrderASC,
    findWithOrderASCbyOR,
    findWithOrderDESC,
    findWithOrderDESCbyOR,
    find,
    update,
    deleteRecords,
    rawQuery

};
