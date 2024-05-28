import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {food_list, isLoading} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>

        {isLoading ? <div className='loader'> <h3>Fetching Food data</h3>
          <div className='spinner'></div> </div> :
          <div className="food-display-list">
              {food_list&&food_list.map( (item, index) => {
                  
                  if (category === "All" || category === item.category) {
                      return <FoodItem key={index}
                              id={item._id}
                              name={item.name}
                              price={item.price}
                              description={item.description}
                              image={item.image}
                              />
                  }
              })}
          </div>
        }

    </div>
  )
}

export default FoodDisplay