import { error } from "console";
import {Pool} from "pg";
export const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT_NUMBER ? parseInt(process.env.PORT_NUMBER) : undefined
})

export default async function connectToDb(){
 await pool.connect((error, client, release) => {
    if(error){
        return console.error("Error in connection", error.stack);
    }
    client?.query("SELECT NOW()", (error, result)=>{
        release();
        if(error){
            return console.error("Error in query execution", error.stack);
        }
        console.log("Success connet with databsase")
    })
 })   
}