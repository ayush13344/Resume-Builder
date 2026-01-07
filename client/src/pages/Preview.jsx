import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";


const Preview = () => {
    const {resumeId} = useParams();
    const [resumeData, setResumeData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const loadResume=async()=>{
        try{
            const {data}=await api.get('/api/resumes/public/'+resumeId);
            setResumeData(data.resume);
        }
        catch(error){
            console.log("Error loading resume:",error);
        }
        finally{
            setIsLoading(false);
        }
    }
    useEffect(()=>{
        loadResume();
    },[])
    return resumeData ? (
        <div className="bg-slate-100">
            <div className="max-w-3xl mx-auto py-10">
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="py-4 bg-white" />
            </div>
        </div>
    ) : (
        <div>
            {isLoading ? <Loader /> :(
                <div>
                    <p>Resume not found.</p>
                    <a href="/" className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1
                    ring-1 ring-green-400 flex items-center transition-colors" ><ArrowLeftIcon className="mr-2 size-4" />Go to home</a>
                </div>
            )}
        </div>
    );
}
export default Preview;