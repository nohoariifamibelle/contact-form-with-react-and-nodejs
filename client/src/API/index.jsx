import axios from 'axios';

// ******** GET IP Address
export const IpAddress = async ({ setLoading, setIpData }) => {
    try{
        let res = await axios.get(`http://api.ipstack.com/check?access_key=${import.meta.env.VITE_IP_ADDRESS_API_KEY}`);
        if(res){
            setLoading(false)
            setIpData(res.data.country_name)
        }
    } catch (error) {
        alert(`IP Address Error: ${error}`)
    }
}

// ******** Get Countries
export const GetCountries = async ({ setLoading, setCountries }) => {
    try{
        let res = await axios.get(`https://api.apilayer.com/number_verification/countries`, {
            headers:{
                apikey: import.meta.env.VITE_NUMBER_VALIDATE_API_KEY
            }
        });
        if(res){
            setLoading(false)
            setCountries(res.data)
        }
    } catch (error) {
        alert(error.response.data.message);
        setLoading(false);
    }
}

// *********** Send email
export const SendEmail = async ({
    fullName,
    email,
    phone,
    message,
    setSend
  }) => {
    try {
      const datas = { fullName, email, phone, message };
      let res = await axios.post(`http://localhost:5000/send`, datas);
      if (res) {
        setSend(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };