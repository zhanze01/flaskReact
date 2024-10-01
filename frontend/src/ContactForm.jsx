import { useState } from "react";


const ContactForm =({existingContact={},updateCallback})=>{

    const[firstName,setFirstName]=useState(existingContact.firstName||"")
    const[lastName,setLastName]=useState(existingContact.lastName||"")
    const[email,setEmail]=useState(existingContact.email||"")
    const updating=Object.entries(existingContact).length!==0
    
    const onSubmit= async(e)=>{
        e.preventDefault()
        const data={
            firstName,lastName,email
        }

        const url="http://127.0.0.1:5000/"+(updating?`update/${existingContact.id}`:"add")

        const options={
            method:updating?"PATCH":"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(data)
        }

        const response= await fetch(url,options)

        if (response.status !==201 && response.status!==200){
            const data=await response.json()
            alert(data.message)
        }else{
            updateCallback()
        }
    }

    return <form onSubmit={onSubmit}>
        <div>
            <label htmlFor="firstName">firstName</label>
            <input type="text" id="firstName" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
            <input type="text" id="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
            <input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div> 
        <button type="submit">{updating?"update":"add"}</button>
    </form>


}

export default ContactForm