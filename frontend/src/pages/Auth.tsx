import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth(){

  const navigate = useNavigate()

  const [isLogin,setIsLogin] = useState(true)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e:any)=>{
    e.preventDefault()
    setLoading(true)

    try{

      const url = isLogin
        ? "http://localhost:8000/auth/login"
        : "http://localhost:8000/auth/register"

      const res = await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json()

      if(!res.ok){
        throw new Error(data.detail || "Error")
      }

      if(isLogin){
        localStorage.setItem("token",data.access_token)
        navigate("/")
      }else{
        alert("Account created successfully")
        setIsLogin(true)
      }

    }catch(err:any){
      alert(err.message)
    }

    setLoading(false)
  }

  return(

    <div style={{
      minHeight:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }}>

      <div style={{
        width:"350px",
        padding:"30px",
        border:"1px solid #ddd",
        borderRadius:"10px"
      }}>

        <h2 style={{textAlign:"center"}}>
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            style={{width:"100%",marginBottom:"10px"}}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            style={{width:"100%",marginBottom:"10px"}}
          />

          <button
            type="submit"
            disabled={loading}
            style={{width:"100%"}}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>

        </form>

        <p style={{textAlign:"center",marginTop:"10px"}}>

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={()=>setIsLogin(!isLogin)}
            style={{marginLeft:"5px"}}
          >
            {isLogin ? "Register" : "Login"}
          </button>

        </p>

      </div>

    </div>

  )

}