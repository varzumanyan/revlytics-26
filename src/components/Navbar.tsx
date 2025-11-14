import kennethMejiaLogo from "@/assets/kenneth-mejia-logo.png";

export const Navbar = () => {
  return (
    <nav className="w-full bg-black border-b border-border/10">
      <div className="container mx-auto px-6 py-3">
        <img 
          src={kennethMejiaLogo} 
          alt="Kenneth Mejia - LA City Controller" 
          className="h-10"
        />
      </div>
    </nav>
  );
};
