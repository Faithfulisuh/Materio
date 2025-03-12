import * as SQLite from "expo-sqlite";

// Open the database
const db = SQLite.openDatabaseAsync("materio.db");

// Function to initialize all tables
const initializeTables = async () => {
  try {
    // Create Categories table
    await (
      await db
    ).runAsync(`
      CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL
      )
    `);

    // Create Materials table
    await (
      await db
    ).runAsync(`
      CREATE TABLE IF NOT EXISTS Materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES Categories (id)
      )
    `);

    // Create Activities table
    await (
      await db
    ).runAsync(`
      CREATE TABLE IF NOT EXISTS Activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        material_name TEXT,
        material_quantity INTEGER,
        category_name TEXT
      )
    `);

    console.log("All tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing tables:", error);
  }
};

const fetchAllCategories = async () => {
  try {
    const result = await (await db).getAllAsync("SELECT * FROM Categories");
    return result; // Return the result as an array of objects
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

const fetchAllMaterials = async (id, title) => {
  try {
  	if(title == "Materials"){
	    const result = await (await db).getAllAsync("SELECT * FROM Materials WHERE category_id = ?;", [id]);
    	return result;
  	}else {
  		const result = await (await db).getAllAsync("SELECT * FROM Materials");
    	return result;
  	}
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

const fetchAllActivities = async () => {
  try {
    const result = await (
      await db
    ).getAllAsync("SELECT * FROM Activities ORDER BY id DESC");
    return result;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

const insertCategory = async (category) => {
  try {
    if (!category || category.trim() === "") {
      throw new Error("Category cannot be empty");
    }
    await (
      await db
    ).runAsync("INSERT INTO Categories (category) VALUES (?)", [category]);
  } catch (error) {
    console.error("Error inserting category:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

const insertMaterial = async (name, quantity, categoryId) => {
  try {
    await (
      await db
    ).runAsync(
      "INSERT INTO Materials (name, quantity, category_id) VALUES (?, ?, ?)",
      [name, quantity, categoryId]
    );
  } catch (error) {
    console.error("Error inserting material:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

const insertActivity = async (
  action,
  materialName,
  materialQuantity,
  categoryName
) => {
  try {
    await (
      await db
    ).runAsync(
      "INSERT INTO Activities (action, material_name, material_quantity, category_name) VALUES (?, ?, ?, ?)",
      [action, materialName, materialQuantity, categoryName]
    );
  } catch (error) {
    console.error("Error inserting activity:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

const deleteitem = async (markedItems, table) => {
  try {
    for (const id of markedItems) {
      await (
        await db
      ).runAsync(`DELETE FROM ${table} WHERE id = ?;`, [id]);
    }
    console.log("Items deleted successfully.");
  } catch (error) {
    console.error("Error deleting items:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export {
  initializeTables,
  fetchAllCategories,
  fetchAllMaterials,
  fetchAllActivities,
  insertCategory,
  insertMaterial,
  insertActivity,
  deleteitem
};
