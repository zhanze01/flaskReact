import { useState ,useEffect} from 'react'
import './App.css'
import ContactList from './ContactList'
import ContactForm from './ContactForm'

function App() {

  const[contacts,setContacts]=useState([])

  const [isModalOpen,setIsModalOpen]=useState(false)

  const [currentContact,setCurrentContact]=useState({})

  useEffect(()=>{
    fetchContacts()
  },[])

  const fetchContacts =async()=>{

    const response =await fetch("http://127.0.0.1:5000/contacts")

    const data=await response.json()

    setContacts(data.contacts)

    console.log(data.contacts)
  }

  const closeModal=()=>{
      setIsModalOpen(false)
      setCurrentContact({})
  }

  const openCreateModal=()=>{
    if (!isModalOpen){
      setIsModalOpen(true)
    }
}

  const onUpdate=()=>{
    closeModal()
    fetchContacts()
}

const onDelete=async(id)=>{
  const options={
    method:"DELETE"
}
  const response =await fetch("http://127.0.0.1:5000/delete/"+`${id}`,options)

  if (response.status !==201 && response.status!==200){
    const data=await response.json()
    alert(data.message)
  }else{
    closeModal()
    fetchContacts()
  }
}

const openEditModal=(contact)=>{
    if(isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
}

  return (
    <>
    <button onClick={openCreateModal}>create new contact</button> 
      <ContactList contacts={contacts} updateContact={openEditModal} deleteContact={onDelete}></ContactList>
      {
        isModalOpen && <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <ContactForm existingContact={currentContact} updateCallback={onUpdate}></ContactForm>
          </div>
        </div>
      }
    </>
  )
}

export default App
