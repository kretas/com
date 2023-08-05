// src/com/functions/supabaseQueries.js
const functions = {
  async $getAll(supabase, table) {
    try {
      const { data, error } = await supabase.from(table).select("*");

      if (error) {
        console.error("Error fetching data from table:", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async $getById(supabase, table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching data from" + table + " by id: ", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async $getByField(supabase, table, field, value) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(field, value)
        .single();

      if (error) {
        console.error("Error fetching data from" + table + " by " + field, error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async $getAllByField(supabase, table, field, value) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(field, value);

      if (error) {
        console.error("Error fetching data from" + table + " by " + field, error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async $updateById(supabase, table, id, updates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error("Error updating data by id:", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async $deleteById(supabase, table, id) {
    try {
      const { data, error } = await supabase.from(table).delete().eq("id", id);

      if (error) {
        console.error("Error deleting data by id:", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async $create(supabase, table, newItem) {
    try {
      const { data, error } = await supabase.from(table).insert(newItem);

      if (error) {
        console.error("Error creating new item:", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async $upload(supabase, bucket, filePath, file) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
      if (error) {
        console.error("Error uploading file:", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async $download(supabase, bucket, file) {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(file);
      if (error) {
        console.error("Error downloading file:", error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

};

export default function (app, supabase) {
  for (const [name, fn] of Object.entries(functions)) {
    app.config.globalProperties[name] = (...args) => fn(supabase, ...args);
  }
}
