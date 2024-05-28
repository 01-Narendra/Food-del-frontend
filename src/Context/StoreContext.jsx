import { createContext, useEffect, useState } from "react";
import {toast, Toaster} from 'sonner'
import axios from 'axios'

export const StoreContext = createContext()

const ContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({})
    const url = "https://food-del-backend-o1mw.onrender.com"
    const [token,setToken] = useState("");
    const [food_list, setFoodList] = useState([])
    const [isLoading, setIsloading] = useState(true)
    
    const addToCart = async(itemId) => {
        if(!cartItems[itemId]) {
            setCartItems((prev) => ({...prev, [itemId]:1}))
        }
        else {
            setCartItems((prev) => ({...prev, [itemId]:prev[itemId]+1}))
        }
        // adding to database for user's cart
        if (token) {
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}})
        }
    }

    const removeFromCart = async(itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]-1}));
        // removing from database for user's cart
        if (token) {
            await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems) 
        {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price* cartItems[item];
            }
        }
        return totalAmount;
    }

    const getNumberOfItemsInCart = () => {
        let totalItems = 0;
        for(const item in cartItems) 
        {
            if (cartItems[item] > 0) {
                totalItems += 1;
            }
        }
        return totalItems;
    }

    // for taking data from backend to display on frontend
    const fetchFoodList = async() => {
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async(token) => {
        const response = await axios.post(url+"/api/cart/get",{}, {headers:{token}})
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        <Toaster position="top-right" richColors />
        async function loadData() {
            try { 
                await fetchFoodList();

                    if (localStorage.getItem("token")) {
                        setToken(localStorage.getItem("token"));
                        await loadCartData(localStorage.getItem("token"));
                    }
            }
            catch (error) {
                console.error("error in fetching data", error)
            }  finally {
                setIsloading(false)
                toast.success("PLEASE REFRESH IF FOOD LIST NOT FETCHED", {duration:2000})
            }
        }
        loadData()
}, [])
    


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getNumberOfItemsInCart,
        url,
        token,
        setToken,
        isLoading
    }

    return (
        <StoreContext.Provider value={contextValue} >
            {props.children}
        </StoreContext.Provider>
    )
}

export default ContextProvider