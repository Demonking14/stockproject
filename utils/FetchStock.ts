import 'dotenv/config';
import axios, {isAxiosError } from "axios";

export async function fetchStocks(symbol: string) {
    try {
        const apiKey = process.env.STOCK_API;
        const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
        const response = await axios.get(url);
        if(response.status==200){
            return {"success": true , "name": response.data.name , "price": Number(response.data.close) }
        }
    } catch (error) {
        if(isAxiosError(error)){
            if(error.response?.status==404){
                return {"success":false , "message": "Please enter valid  stock symbol"}
            }
        }
        console.log(error)
        return {"success": false , "message":"Unable to fetch data currently"}
    }
}

