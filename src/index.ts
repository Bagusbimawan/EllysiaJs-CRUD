import { Elysia, t } from "elysia";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ellysia",
});

const app = new Elysia()

  .get("/", async () => {
    try {
      const [rows] = await connection.execute("SELECT * FROM login");
      return {
        status: "ok",
        data: rows,
      };
    } catch (error) {
      console.log(error);
    }
  })

  .post(
    "/",
    async ({ body }) => {
      try {
        const [rows] = await connection.execute(
          "INSERT INTO login (nama,password) VALUES (?,?)",
          [body.nama, body.password]
        );
        return {
          status: "ok",
          data: rows,
        };
      } catch (error) {
        console.log(error);
      }
    },
    {
      body: t.Object({ nama: t.String(), password: t.String() }),
    }
  )

  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      const [rows] = await connection.execute(
        "UPDATE login SET nama = ? , password = ? WHERE id= ?",
        [body.nama, body.password, id]
      );
      return {
        status: "ok",
        data: rows,
      };
    },
    {
      body: t.Object({
        nama: t.String(),
        password: t.String(),
      }),
    }
  )
  
  .delete("/:id", async ({ params: { id } }) => {
    const [rows] = await connection.execute("DELETE FROM login WHERE id=?", [
      id,
    ]);
    return {
      status: "ok",
    };
  })
  .listen(3000);

console.log("Ellysia running in port 3000");
