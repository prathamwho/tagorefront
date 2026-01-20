import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Home, Link as LinkIcon } from 'lucide-react';

const RightProfilePanel = ({ user }) => {
  if (!user) return null;
  const navigate = useNavigate();

  const [thisUser,setThisUser] = useState({
    profilePic: (user.profilePic==="")?"/src/public/default-photo.png":user.profilePic,
    fullName: (user.fullName==="")?"Enter Name":user.fullName,
    email: (user.email==="")?"Enter Email":user.email,
    headline: (user.headline==="")?"Enter Headline":user.headline,
    institution: (user.institution==="")?"Enter Institution":user.institution,
    location: (user.location==="")?"Enter Location":user.location,
    website: (user.website==="")?"Enter Website":user.website,

  });

  return (
    <div className="flex flex-col gap-6 text-[#c9d1d9]">
      
      {/* Avatar Section */}
      <div className="relative group w-full aspect-square">
        <img 
          src={thisUser.profilePic} 
          alt={thisUser.fullName} 
          className="w-full h-full rounded-full border border-gray-700 shadow-md object-cover"
        />
      </div>

      {/* Name & Bio */}
      <div>
        <h1 className="text-[24px] font-bold leading-tight">{thisUser.fullName}</h1>
        <h2 className="text-[20px] font-light text-[#8b949e]">{thisUser.email}</h2>
        <div className="mt-4 text-[16px] leading-snug">{thisUser.headline}</div>
      </div>

      {/* Actions */}
      <button 
      onClick={()=>{navigate(`/profile/${user._id}`)}}
      className="w-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] font-medium py-1.5 rounded-md text-sm hover:bg-[#30363d] transition-all">
        Edit profile
      </button>

      {/* Meta Stats */}
      {/* 

      <div className="flex items-center gap-1 text-sm text-[#8b949e]">
        <Users size={16} />
        <span className="font-bold text-[#c9d1d9]">{thisUser.stats.followers}</span> followers
        <span>·</span>
        <span className="font-bold text-[#c9d1d9]">{thisUser.stats.following}</span> following
      </div>
      */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-[#c9d1d9]">
            <Home size={16} className="text-[#8b949e]" />
            {thisUser.institution}
        </div>
        <div className="flex items-center gap-2 text-[#c9d1d9]">
            <MapPin size={16} className="text-[#8b949e]" />
            {thisUser.location}
        </div>
        <div className="flex items-center gap-2 text-[#c9d1d9]">
            <LinkIcon size={16} className="text-[#8b949e]" />
            <a href={thisUser.website} target='_blank' className="hover:text-[#58a6ff] hover:underline">{thisUser.website}</a>
        </div>
      </div>

    </div>
  );
};

export default RightProfilePanel;