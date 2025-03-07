import React from 'react';

export function Button(props) {
    return (
        <button
            className="disabled:opacity-50
  disabled:cursor-not-allowed 
  inline-flex 
  text-base 
  text-gray-100 
  shadow-md 
  items-center 
  justify-center
  whitespace-nowrap 
  rounded-md 
  transition-all 
  ring-blue-400 
  ring-offset-blue-400 
  focus-visible:outline-none
  focus-visible:ring-2 
  focus-visible:ring-offset-2 
  focus:outline-none
  focus:ring-2 
  focus:ring-offset-2 
  active:scale-[.95] 
  active:shadow-sm bg-zinc-950 hover:bg-zinc-950/55 h-9 px-4 py-2  relative
  after:absolute
  after:-inset-0.5
  after:-z-10 
  after:animate-pulse 
  after:rounded-lg
  after:bg-gradient-to-r 
  after:from-pink-600
  after:to-violet-600
  after:blur-sm"
            {...props}
        />
    );
}
