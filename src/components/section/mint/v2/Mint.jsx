import { useState } from "react";
import CountdownTimer from "react-component-countdown-timer";
import { useModal } from "../../../../utils/ModalContext";
import { Slider, SliderItem } from "../../../../common/slider/Slider";
import Button from "../../../../common/button";
import Particle from "./Particles";
import MintStyleWrapper from "./Mint.style";

import thumb1 from "../../../../assets/images/nft/v4-slider-img.png";
import thumb2 from "../../../../assets/images/nft/v4-slider-img2.png";
import thumb3 from "../../../../assets/images/nft/v4-slider-img3.png";
import checkIcon from "../../../../assets/images/icon/mint-right-text-icon.svg";
import Swal from 'sweetalert2'
import axios from "axios"
import { useEffect } from "react";

const Mint = ({}) => {
  const [count, setCount] = useState(1);
  const { mintModalHandle } = useModal();
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail]= useState("")
  const [value, setValue] = useState("")

  const GetLastData = async () =>{
    var resposne = await axios.post("http://localhost:4030/getGSheetData")
    console.log(resposne);
    if(resposne.data != null)
    {
      var arrdata = resposne.data.arr;
      setName(arrdata[1])
      setEmail(arrdata[2])
      setWallet(arrdata[3]);
      setValue(resposne.data.value);
    }
  }

  const loading = (msg) => {
    Swal.fire({
        title: msg,
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
          }
      })
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const suc = (msg)=>Toast.fire({
    icon: 'success',
    title: msg
  })
  const err = (message) => Toast.fire({
    icon: 'error',
    title: message
  })

  const MintNFT = async (name, toaddress, val)=>{
    loading("Minting NFT for "+name)
    var resposne = await axios.post("http://localhost:4030/mintNFT", {
      "value": val,
      "toaddress": toaddress,
      "name": name
    }).then(()=>{
      suc("Minted NFT for "+name)
    }).catch((err)=>{
      err("Something went wrong")
    })
  }

  useEffect(async ()=>{
    var res = await GetLastData();
    return res
  }, [])
  


  const slideImages = [thumb1, thumb2, thumb3];

  const sliderSettings = {
    dots: false,
    arrows: false,
    autoplay: true,
    speed: 500,
    fade: true,
    autoplaySpeed: 500,
    centerMode: true,
    centerPadding: "0px",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const counterSettings = {
    count: 5432560,
    showTitle: true,
    size: 40,
    labelSize: 24,
    backgroundColor: "transparent",
    color: "#fff",
    dayTitle: "D",
    hourTitle: "H",
    minuteTitle: "M",
    secondTitle: "S",
    id: "countdownwrap",
  };

  const handleChenge = () => {};

  return (
    <MintStyleWrapper>
      <Particle />
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="mint_left_content">
              <div className="mint_left_inner">
                <div className="mint_slider">
                  <Slider {...sliderSettings}>
                    {slideImages?.map((thumb, idx) => (
                      <SliderItem key={idx}>
                        <div className="mint_thumb">
                          {value && <img src={require("../../../../images/"+value+".jpg")} alt="thumb" />}
                          {!value && <img src={require("../../../../images/12.png")} alt="thumb" />}
                        </div>
                      </SliderItem>
                    ))}
                  </Slider>
                </div>
                <ul className="mint_count_list">
                  {/* <li>
                    <h5>Remaining</h5>
                    <h5>
                      4583/<span>9999</span>
                    </h5>
                  </li>
                  <li>
                    <h5>Price</h5>
                    <h5>0.15 ETH</h5>
                  </li>
                  <li>
                    <h5>Quantity</h5>
                    <div className="mint_quantity_sect">
                      <button
                        className="input_number_decrement"
                        onClick={() =>
                          count > 1 ? setCount(count - 1) : count
                        }
                      >
                        -
                      </button>
                      <input
                        className="input_number"
                        type="text"
                        value={count}
                        onChange={handleChenge}
                      />
                      <button
                        className="input_number_increment"
                        onClick={() =>
                          count > 0 ? setCount(count + 1) : count
                        }
                      >
                        +
                      </button>
                    </div>
                    <h5>
                      <span>0.30</span> ETH
                    </h5>
                  </li> */}
                </ul>
                <Button lg variant="mint" onClick={() => MintNFT(name, wallet, value)}>
                  {" "}
                  Mint now
                </Button>
                <p>
                  By clicking “MINT”, You agree to our{" "}
                  <a href="# ">Terms of Service</a> and our{" "}
                  <a href="# ">Privacy Policy.</a>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mint_right_content">
              <div className="content_header">
                <h4>
                  MINTING FOR:  {name}
                  <span>
                    <img src={checkIcon} alt="icon" />
                  </span>
                </h4>
                <h4>
                  WALLET ADDRESS: {wallet}
                  <span>
                    <img src={checkIcon} alt="icon" />
                  </span>
                </h4>
                <h4>
                  EMAIL: {email}
                  <span>
                    <img src={checkIcon} alt="icon" />
                  </span>
                </h4>

                <h1>NEURAL MURAL NFT MINTING</h1>
              </div>
              <div className="content_footer">
                
              </div>
              <div className="mint_btns">
                <Button lg variant="outline" onClick={async ()=> GetLastData()}>
                  Reload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MintStyleWrapper>
  );
};

export default Mint;
