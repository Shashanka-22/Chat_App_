
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCSUKIRsNtPgkwDrBHwUpyjg1LqkvPvO1c",
  authDomain: "shnk-chat.firebaseapp.com",
  projectId: "shnk-chat",
  storageBucket: "shnk-chat.appspot.com",
  messagingSenderId: "527799469767",
  appId: "1:527799469767:web:37c03e349d34c2c1ec20e2"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"hety bebyev eubeu ee",
            lastSeen:Date.now()
        })

        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[] 
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email,password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
      console.error(error)
      toast.error(error.code.split('/')[1].split('-').join(" "));  
    }
}

const logOut = async ()=>{
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));  
    }
}


const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where('email',"==",email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset email sent")
        }else{
            toast.error("Email doesn't exists");
        }
    } catch (error) {
        console.error(error)
        toast.error(error.message)
    }
}


export{signup, login , logOut ,auth ,db,resetPass}