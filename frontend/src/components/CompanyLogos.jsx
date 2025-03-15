import logo from "../assets/Logo/1.png";

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Facilitez votre apprentissage et développez vos compétences avec
      </h5>
      <ul className="flex">
        {[...Array(5)].map((_, index) => (
          <li
            key={index}
            className="flex items-center justify-center flex-1 h-[8.5rem]"
          >
            <img src={logo} width={134} height={28} alt={`logo-${index}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;
