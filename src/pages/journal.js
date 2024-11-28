import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/pageprops/breadcrumbs";
import { FaRegCalendarAlt, FaRegCommentDots } from "react-icons/fa"; 

const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch('http://localhost:5000/journal'); 
        const data = await response.json();
        setJournals(data);
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    };

    fetchJournals();
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-8">
      <Breadcrumbs title="Journals" prevLocation={prevLocation} />

      <div className="py-10 space-y-8">
        {journals.map((journal) => (
          <div key={journal.id_jour} className="flex flex-col lg:flex-row border border-gray-300 rounded-lg p-4 gap-6">
            {/* Left Column */}
            <div className="lg:w-1/3 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <FaRegCalendarAlt className="mr-2" />
                <span>{new Date(journal.created_at).toLocaleDateString()}</span>
                <FaRegCommentDots className="ml-2 mr-1" />

                {/* Assuming comments count is available */}
                <span className="mr-1">{journal.comment_count || 0} </span> Comments
              </div>
              <img src={`images/journal/${journal.img}`} alt = "img" className="w-full h-120 object-cover rounded-md" />
            </div>

            {/* Right Column */}
            <div className="lg:w-2/3 space-y-4 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">{journal.title}</h2>
              <p className="text-base text-gray-600">{journal.content.substring(0, 400)}...</p>
              <Link to={`/journal/${journal.id_jour}`}>
                <button className="bg-primeColor text-white font-bodyFont w-[105px] h-[30px] hover:bg-black duration-300 font-bold mt-4">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;