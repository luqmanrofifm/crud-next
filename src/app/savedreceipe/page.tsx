import connectToDb, { pool } from "@/utils/dbconnect";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SavedReceipe() {
    connectToDb();
    const data = await pool.query("SELECT * FROM saved_meal");
    const result = data.rows;

    async function deleteReceipe(data: any) {
        "use server"
        let id = data.get("id").valueOf();
        try{
  
          await pool.query("DELETE FROM saved_meal WHERE id = $1", [id]);
          console.log("success delete");
  
        } catch(err){
          console.log(err);
        }

        redirect("/savedreceipe");
      }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Saved Receipe</h1>
            <div className="grid grid-cols-4 gap-4">
                {result.map((value, index) => (
                    <div key={index} className="border border-gray-300 p-4 mb-4 mx-auto">
                        <h4 className="text-lg font-semibold mb-2">{value.meal_name}</h4>
                        <img className="w-48 h-48 object-cover mb-2" alt={value.meal_name} src={value.meal_img}></img>
                        <Link href={"/meal/"+value.idmeal}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Receipe Detail
                        </button>
                        </Link>
                        <form action={deleteReceipe}>
                            <input type="hidden" name="id" value={value.id}/>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" type="submit">Remove From Archive</button>
                        </form>
                    </div>
                ))}
            </div>    
        </div>
    );
}