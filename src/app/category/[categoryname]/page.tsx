import Navbar from "@/component/Navbar";
import { MealModel } from "@/interface/MealModel";
import axios from "axios";
import Link from "next/link";
export default async function Category({params}: CategoryProps){
    const categoryname = params.categoryname;
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c='+categoryname);
    const data: MealModel[] = response.data.meals;
    return (
        <>
        <Navbar/>
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="grid grid-cols-4 gap-4">
        
            {data.map((category, index) => (
                <div key={index} className="border border-gray-300 p-4 mb-4 mx-auto">
                    <h4 className="text-lg font-semibold mb-2">{category.strMeal}</h4>
                    <img className="w-48 h-48 object-cover mb-2" alt={category.strMeal} src={category.strMealThumb}></img>
                    <Link href={"/meal/"+category.idMeal}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              Check Receipe Detail
                          </button>
                    </Link>
                </div>
            ))}
            </div>
        </div>
        </>
    )
}