import kennethMejiaLogo from "@/assets/kenneth-mejia-logo.png";

export const Navbar = () => {
  return (
    <nav className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <img 
          src={kennethMejiaLogo} 
          alt="Kenneth Mejia - LA City Controller" 
          className="h-16 md:h-20"
        />
      </div>
    </nav>
  );
};
