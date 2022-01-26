import React, {useState, useEffect} from 'react';
import axios from 'axios';
import cartIcon from './cartIcon.jpg'
import itemIcon from './item.png'

export default function Minicart(){
    let storage =JSON.parse(localStorage.getItem("items"));
    const [items, setItems]= useState(storage!==null?storage:[]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);

    const entries = (dataList) =>{
        for(const element of dataList){
            element.quantity=1;
            element.price=39;
            element.totalPrice=element.price*element.quantity;
        }  
        return dataList;
    }
    
    
    useEffect(()=>{
        console.log(items);
        if(items.length===0){
            async function fetchData(){
                const data = await axios.get("http://dnc0cmt2n557n.cloudfront.net/products.json");
                setItems(entries(data.data.products));
            };
            fetchData();
            
        }else{
            localStorage.setItem("items",JSON.stringify(items));
        }
        calculateCartTotalPrice();
        calculateCartTotalCount();
    },[items])

    const increaseQuantity =(id) =>{
        var data = items.map(entry => 
            (entry.id === id?
            {...entry,quantity:entry.quantity+1,totalPrice:(entry.quantity+1)*entry.price}
            :entry));
        setItems(data);
    }

    const decreaseQuantity =(id) =>{
        var data = items.map(entry => 
            entry.id === id && entry.quantity>0?
            {...entry,quantity:entry.quantity-1,totalPrice:(entry.quantity-1)*entry.price}
            :entry);
        setItems(data);
    }

    const calculateCartTotalPrice = () =>{
        let totalPrice = items.reduce((a,b) =>{return a+b.totalPrice},0);
        console.log("Total cart price: " + totalPrice);
        setCartTotal(totalPrice);
    }

    const calculateCartTotalCount = () =>{
        let totalItem = items.reduce((a,b) =>{return a+b.quantity},0);
        console.log("Total cart item count: " + totalItem);
        setCartItemCount(totalItem);
    }
    
    return (
        <div>
            <div className="header">
                <div className="title">Mini cart app</div>
                <div className="cart-total-price">
                    <span>${cartTotal}</span><br/>
                    <span>{cartItemCount+" items"}</span>
                </div>
                <div>
                    <img className="img-right" src={cartIcon} alt="cartImage"></img>
                </div>
            </div>
            <div>
            {
            items.map(entry => {
              return <div key={entry.id} className="container">
                <div className="column1">
                    <img alt='itemImg' className='grid-item-image' src={itemIcon}></img>
                </div>
                <div className="column2">
                    <span className="grid-item">{entry.title}</span><br/>
                    <span className="grid-item">{entry.desc}</span>
                </div>
                <div className="column3">
                    <span 
                    className="btn-primary btn-control" 
                    onClick={()=>{
                        decreaseQuantity(entry.id);
                    }}>-</span>
                    <input className="input-control" value={entry.quantity}></input>
                    <span 
                    className="btn-primary btn-control" 
                    onClick={()=>{
                        increaseQuantity(entry.id);
                    }}>+</span>
                </div>
                <div className="column4">
                    ${entry.totalPrice}
                </div>
                </div>
            })}
            </div>
        </div>
    )
}