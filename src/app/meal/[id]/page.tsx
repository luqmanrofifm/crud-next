import { MealDetailModel } from "@/interface/MealDetailModel";
import connectToDb, { pool } from "@/utils/dbconnect";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { redirect } from "next/navigation";
import swal from 'sweetalert';

export default async function Meal({params}: DetailProps) {
    connectToDb();
    const id = params.id;
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const data: MealDetailModel = response.data.meals[0];

    const dataFromDb = await pool.query("SELECT * FROM saved_meal where idmeal = $1",[id]);
    const resultFromDb = dataFromDb.rows;

    async function saveMealReceipe() {
      "use server"
      const currentTime: Date = new Date();
      let id = uuidv4();
      let createdDate = currentTime;
      let idMeal = data.idMeal;
      let mealName = data.strMeal;
      let mealCategory = data.strCategory;
      let mealImage = data.strMealThumb;

      try{
        const query = {
          text: 'INSERT INTO saved_meal (id, created_date, updated_date, idmeal, meal_name, meal_category, meal_img) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
          values: [id, createdDate, null, idMeal, mealName, mealCategory, mealImage],
        };

        const result = await pool.query(query);
        console.log(result);

      } catch(err){
        console.log(err);
      }

      redirect("/savedreceipe");
    }

    async function deleteReceipe() {
      "use server"
      try{

        await pool.query("DELETE FROM saved_meal WHERE idmeal = $1", [id]);
        console.log("success delete");

      } catch(err){
        console.log(err);
      }

      redirect("/meal/"+id);
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">{data.strMeal}</h1>
          <img src={data.strMealThumb} alt={data.strMeal} className="max-w-64 rounded-lg mb-4" />
          {
            resultFromDb.length===0?
            (<form action={saveMealReceipe}>
              <input type="hidden"/>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">save receipe</button>
            </form>):
            (<form action={deleteReceipe}>
              <input type="hidden"/>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Remove From Archive</button>
            </form>)
          }
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Category:</h2>
              <p>{data.strCategory}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Area:</h2>
              <p>{data.strArea}</p>
            </div>
          </div>
          <p className="text-lg mt-4"><span className="font-semibold">Instructions:</span> {data.strInstructions}</p>
          {data.strTags && <p className="text-lg mt-4"><span className="font-semibold">Tags:</span> {data.strTags}</p>}
          <div>
            <h2 className="text-xl font-semibold mt-8 mb-4">Ingredients:</h2>
            <ul>
              {Object.entries(data)
                .filter(([key, value]) => key.startsWith('strIngredient') && value)
                .map(([key, value]) => (
                  <li key={key} className="mb-2">{value} - {data[`strMeasure${parseInt(key.slice(13))}` as keyof MealDetailModel]}</li>
                ))}
            </ul>
          </div>
          {data.strYoutube && <p className="text-lg mt-8"><span className="font-semibold">Youtube Link:</span> <a href={data.strYoutube} className="text-blue-500">{data.strYoutube}</a></p>}
          {data.strSource && <p className="text-lg mt-4"><span className="font-semibold">Source:</span> <a href={data.strSource} className="text-blue-500">{data.strSource}</a></p>}
        </div>
      );
}