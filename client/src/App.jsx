import { useEffect, useState } from "react";
import { validateFullName, validateEmail, validateMessage, validatePhone } from "./components/Validation";
import InlineError from "./components/InlineError";
import { GetCountries, IpAddress, SendEmail } from "./API";
import Loading from "./components/Loading";
import { toast } from 'react-toastify';
import Toast from "./components/Toast";
const InputClass = "w-full py-4 placeholder:text-gray px-6 text-main border-2 mt-2 border-border rounded"

function App() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [message, setMessage] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ipData, setIpData] = useState("");
  const [countries, setCountries] = useState();
  const [country, setCountry] = useState("France");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [send, setSend] = useState();

  let result = countries && Object.keys(countries).map((key) => countries[key]);
  let output = result && result.find((x) => x.country_name === country);
  let outputResult = output && output.dialling_code;
  let phoneFull = outputResult && outputResult.concat(phone);
  useEffect(() => {
    if(!ipData & !countries){
      IpAddress({setIpData, setLoading});
      GetCountries({setLoading, setCountries});
    }

    /* VALIDATION */
    validateFullName({fullName, setFullNameError})
    validateEmail({email, setEmailError})
    validatePhone({phone, setPhoneError})
    validateMessage({message, setMessageError})

    // ***********
    if (send) {
      toast.success(send.msg);
      setFullName("")
      setEmail("")
      setMessage("")
      setSend()
      setPhone("")
    }
  }, [fullName, email, phone, message, ipData, countries, send]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!fullNameError & !emailError & !phoneError & !messageError) {
      SendEmail({ fullName, email, phone: phoneFull, message, setSend }).then(
        () => {
          setButtonLoading(false);
        }
      );
    }
  } 
  return (
    <>
      <Toast />
      <div className="container flex-colo py-12 mx-auto min-h-screen sm:py-2 px-4">
        {
          loading ? (<Loading />) : (
          <div className="main-box lg:w-3/4 w-full flex box-shadow rounded-lg overflow-hidden">
            <div className="box-1 bg-main flex-colo py-6 sm:py-0">
              <img src="/favicon.png" alt="logo du formulaire" className="w-16 h-16 object-cover"/>
              <h1 className="my-4 text-xl">ShoeShops</h1>
              <p className="italic text-sm">
                We detected you are <br /> current in  {" "}
                <span className="font-bold">({ipData && ipData})</span>
              </p>
            </div>
            <form onSubmit={submitHandler} className="box-2 bg-white pt-12 pb-6 sm:px-12 px-6">
              <h2 className="sm:text-2xl text-xl text-center mb-12 font-semibold">Contact Us</h2>
              {/* fullName */}
              <div className="my-6">
                <label>Fullname</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" required placeholder="User Doe" className={InputClass} aria-label="Nom de l'utilisateur"/>
                {fullNameError && <InlineError error={fullNameError} />}
              </div>
              {/* email */}
              <div className="my-6">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="example@gmail.com" className={InputClass} aria-label="Adresse email"/>
                {emailError && <InlineError error={emailError} />}

              </div>
              {/* phone */}
              <div className="my-6">
                <label>Phone</label>
                <div className="grid gap-3 grid-cols-12 border-2 mt-2 border-border rounded-md w-full px-2">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="col-span-3 bg-main py-3 px-2 my-2 text-sm rounded"
                  >
                    {
                      result && result.map((e, index) => (
                        <option value={e.country_name} key={index}>{e.country_name}</option>
                      ))
                    }
                  </select>
                  <div className="tracking-widest col-span-2 border-x-2 border-border flex-colo">
                    {outputResult}
                  </div>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="number"
                    placeholder="0765452312"
                    className="placeholder:text-gray text-main col-span-7 px-3"
                  />
                </div>
                {phoneError && <InlineError error={phoneError} />}
              </div>
              
              {/* message */}
              <div className="my-6">
                <label>Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="How can i help you ?" className="mt-2 w-full border-2 border-border py-4 placeholder:text-gray px-6 text-main"></textarea>
                {messageError && <InlineError error={messageError} />}
              </div>
              {/* submit */}
              <button type="submit" disabled={buttonLoading && true} className="w-full border-2 border-main hover:bg-white trans bg-main mt-6 rounded-md tracking-widest py-4 font-subMain font-bold">
                {buttonLoading ? "Loading..." : "SUBMIT"}
              </button>
            </form>
          </div>
          )
        }
        
      </div>
        
    </>

  )
}
export default App