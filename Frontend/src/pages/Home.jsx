import JobPostings from "../components/JobPostings";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="flex flex-col items-center justify-center w-screen overflow-hidden">
        {/* <JobPostings/> */}
        <div className="w-full h-[70vh] max-sm:h-[50vh] flex flex-col justify-center">
          <p className="animate-pulse text-8xl max-sm:text-3xl font-sans text-center">Coming Soon ...</p>
        </div>

      </div>

    </div>
  )
}
export default Home;
