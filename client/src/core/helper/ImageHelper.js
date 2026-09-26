import React from 'react'
import { API } from '../../backend'
// import Base from '../Base'

const ImageHelper = ({product}) => {
 
    const imageUrl =  `${API}/product/photo/${product._id}`
     return (
       <img
       src={imageUrl}
       alt={product.name}
       style={{ height: '250px', maxWidth: '250px' }}
                className="mb-3 rounded"
       ></img>
    ) 
}
export default ImageHelper