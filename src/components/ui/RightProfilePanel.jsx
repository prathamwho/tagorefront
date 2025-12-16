import React from 'react';
import { Users, MapPin, Link as LinkIcon } from 'lucide-react';

const RightProfilePanel = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 text-[#c9d1d9]">
      
      {/* Avatar Section */}
      <div className="relative group w-full aspect-square">
        <img 
          src={user.avatarUrl} 
          alt={user.name} 
          className="w-full h-full rounded-full border border-gray-700 shadow-md object-cover"
        />
        <div className="absolute bottom-[10%] right-[5%] bg-[#0d1117] border border-gray-600 rounded-full p-2 cursor-pointer shadow-sm">
           😊
        </div>
      </div>

      {/* Name & Bio */}
      <div>
        <h1 className="text-[24px] font-bold leading-tight">{user.name}</h1>
        <h2 className="text-[20px] font-light text-[#8b949e]">{user.handle}</h2>
        <div className="mt-4 text-[16px] leading-snug">{user.bio}</div>
      </div>

      {/* Actions */}
      <button className="w-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] font-medium py-1.5 rounded-md text-sm hover:bg-[#30363d] transition-all">
        Edit profile
      </button>

      {/* Meta Stats */}
      <div className="flex items-center gap-1 text-sm text-[#8b949e]">
        <Users size={16} />
        <span className="font-bold text-[#c9d1d9]">{user.stats.followers}</span> followers
        <span>·</span>
        <span className="font-bold text-[#c9d1d9]">{user.stats.following}</span> following
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-[#c9d1d9]">
            <MapPin size={16} className="text-[#8b949e]" />
            {user.location}
        </div>
        <div className="flex items-center gap-2 text-[#c9d1d9]">
            <LinkIcon size={16} className="text-[#8b949e]" />
            <a href={user.website} className="hover:text-[#58a6ff] hover:underline">{user.website}</a>
        </div>
      </div>

    </div>
  );
};

export default RightProfilePanel;