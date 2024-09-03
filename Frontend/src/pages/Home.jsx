import JobPostings from "../components/JobPostings";
import Navbar from "../components/Navbar";

const Home = ()=>{
  return(
    <div className="overflow-hidden">
   <Navbar/>
   <div className="flex flex-col items-center justify-center w-screen overflow-hidden">
   <JobPostings/>

   </div>

    </div>
  )
}
export default Home;
