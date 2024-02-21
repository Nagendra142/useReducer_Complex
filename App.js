import React,{useEffect,useReducer,useState} from 'react';


const reducer=(state,action)=>{
    if(action.type==="Update_data"){
        return{
        ...state,
        DataStorage:(action.payload)
        }
    }
    else if(action.type==="Loading"){
        
            return{
                ...state,
                isLoading:action.payload
            }
            
    }
    else if(action.type==="Error"){
        return{
            ...state,
            isError:action.payload
        }
    }
    else if(action.type==="Delete"){
        const new_data=state.DataStorage.filter(ch=>{
            return ch.id!==action.payload;
        })
        return{
            ...state,
            DataStorage:new_data
        }
        
    }
    else if(action.type==="IsEditing"){
        return{
            ...state,
            isEditing_status:action.payload,

        }
        
    }
    else if(action.type==="Editing_Details"){
        const OriginatedList=state.DataStorage.map(child=>
            {
                if(child.id===action.payload.id){
                    console.log("Hii");
                    return {
                        
                        id:child.id,
                        name:action.payload.name,
                        email:action.payload.email
                    }
                }
                else{
                    return child;
                }
            });
            return {
                ...state,
                DataStorage:OriginatedList
            }
            
    }
   
    return state;
}
export const App=()=>{

    const initialize={
        DataStorage:[],
        isLoading:false,
        isError:{status:false,msg:""},
        Editing_fun:{status:false,id:'',name:'',email:''},
        isEditing_status:{status:false,id:'' ,name:'',email:''}
        
    }

    const url="https://jsonplaceholder.typicode.com/users";

    async function Fectching_Fun(url_passed){
        dispatch({type:"Loading",payload:true});
        dispatch({type:"Error",payload:{status:false,msg:""}});
        try{
            const resp=await fetch(url_passed);
            const data=await resp.json();
            dispatch({type:"Update_data",payload:data});
            dispatch({type:"Loading",payload:false});
            
        }
        catch(error){
            dispatch({type:"Loading",payload:false});
            dispatch({type:"Error",payload:{status:true,msg:"Some thing wrong"}});

        }
    }
    useEffect(()=>{
        Fectching_Fun(url)
        
    },[]);
    const [state,dispatch]=useReducer(reducer,initialize);

    if(state.isLoading){
        return <><h3>Loading.....</h3></>
    }

    if(state.isError.status){
        return <h3>{state.isError.msg}</h3>
    }

    function Edit_Fun(id,name,email){
        dispatch({
            type:"IsEditing",
            payload:{status:true,
                id:id,
                name:name,
                email:email
            }
        })
    }

    function Delete_Fun(id){
        dispatch({
            type:"Delete",
            payload:id

        })
    }

   

    function updateData(id,name,email){
        dispatch({
            type:"Editing_Details",
            payload:{id:id,name:name,email:email}
        })
        dispatch({
            type:"IsEditing",
            payload:{
                status:false,
                id:"",
                name:"",
                email:''
            }
        })

    }
    return (
       
        <>
        {state.isEditing_status.status && <Form_Component id={state.isEditing_status.id} name={state.isEditing_status.name} email={state.isEditing_status.email} updateData={updateData}/>}
         
        
        {
            
            state.DataStorage.map(child=>{
                const {id,name,email}=child;
                return <li key={id}>
                    <h3>{name}</h3>
                    <h3>{email}</h3>
                    <button onClick={()=>Delete_Fun(id)}>Delete</button>
                    <button onClick={()=>Edit_Fun(id,name,email)}>Edit</button>
                </li>
            })
        }
        </>
    )
}
const Form_Component=(props)=>{
    const [name_state,setName]=useState(props.name || "");
    const [email_state,setemail]=useState(props.email || "");

    function Handle_name(e){
        setName(e.target.value);
    }
    function Handle_email(e){
        setemail(e.target.value);
    }

    return (
        <>
        <input type="text" id="name" placeholder="name" value={name_state} onChange={Handle_name}/>
        <input type="text" id="email" placeholder="email" value={email_state} onChange={Handle_email}/>
        <button onClick={()=>props.updateData(props.id ,name_state,email_state)}>Update Data</button>
        </>
    )
}