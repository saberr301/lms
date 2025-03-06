import loginImg from "../assets/Images/login.png";
import Template from "../components/core/Auth/Template";

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Une formation pour améliorer vos compétences,"
      description2="et booster votre carrière."
      image={loginImg}
      formType="login"
    />
  );
}

export default Login;
