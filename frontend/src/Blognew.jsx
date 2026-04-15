import Lottie from "lottie-react";

import animPOS from "./assets/Chagee.json";
import animOnline from "./assets/Sushi.json";


const blogs = [
  {
    author: "Sam Pitak",
    date: "20 Apr 2024",
    title: "Beyond Transactions: POS System",
    desc: "POS systems now do much more than process payments.",
    animation: animPOS,
  },
  {
    author: "Yuli Sumpil",
    date: "20 Apr 2024",
    title: "From Store to Online",
    desc: "Learn how POS systems integrate online and offline.",
    animation: animOnline,
  },
];

export default function BlogNew() {
  return (
    <>
      {blogs.map((blog, index) => (
        <div key={index} className="h-48 flex items-center justify-center p-4">
          <Lottie
            animationData={blog.animation}
            loop
            autoplay
          />
        </div>
      ))}
    </>
  );
}