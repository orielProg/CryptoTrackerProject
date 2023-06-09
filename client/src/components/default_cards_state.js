import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {green,red} from "@mui/material/colors"

export const data = [
    {
      value: "0$",
      trendIcon: <ArrowUpwardIcon sx = {{color : green[500]}}/>,
      trendValue: "0",
    },
    {

      value: "0",
      trendIcon: <ArrowDownwardIcon sx = {{color : red[500]}}/>,
      trendValue: "0",
    },
    {

      value: "0",
      trendIcon: <ArrowDownwardIcon sx = {{color : red[500]}}/>,
      trendValue: "0",
    },
    {

      value: "5",
      trendIcon: <ArrowUpwardIcon sx = {{color : green[500]}}/>,
      trendValue: "0",
    },
  ];

  export const staticElements = [
    {
      alt: "worth",
      image:
        "https://imageio.forbes.com/blogs-images/ofx/files/2018/09/OFX3-iStock-492595743-1200x800.jpg?fit=bounds&format=jpg&width=960",
      header: "Total Worth",
    },
    {
      alt: "btc",
      image: "https://block-builders.net/wp-content/uploads/2020/10/Bitcoin-logo-678x381.png",
      header: "BTC Price",
    },
    {
      alt: "eth",
      image: "https://logowik.com/content/uploads/images/ethereum3649.jpg",
      header: "ETH Price",
    },
    {
      alt: "nft",
      image:
        "https://www.coindesk.com/resizer/qPSlzd_QRiApfu7Fxic1sQD0E-I=/1200x628/center/middle/cloudfront-us-east-1.images.arcpublishing.com/coindesk/ROBDVO4PFNFULOLBIK3DGUO5KQ.jpg",
      header: "Number of NFTS",
    },
  ];

  export const getCards = (dynamic_data=data) => {
    let cards = [];
    dynamic_data.forEach((element,index) => {
      cards[index] = {...element,...staticElements[index]};
    })
    return cards;
  }