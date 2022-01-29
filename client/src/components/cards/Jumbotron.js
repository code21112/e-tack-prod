// import React from "react";
// import Typewriter from "typewriter-effect";

// const Jumbotron = ({ text }) => (
//   // <Typewriter
//   //   options={{
//   //     strings: text,
//   //     autoStart: true,
//   //     loop: true,
//   //   }}
//   // />
//   <Typewriter
//     onInit={(typewriter) => {
//       typewriter
//         .typeString("Hello World!")
//         .callFunction(() => {
//           console.log("String typed out!");
//         })
//         .pauseFor(2500)
//         .deleteAll()
//         .callFunction(() => {
//           console.log("All strings were deleted");
//         })
//         .start();
//     }}
//   />
// );

// export default Jumbotron;

// ////////////////////////////////////////////////
// ESSAI AVEC FUNCTIONS
import React from "react";
import Typewriter from "typewriter-effect";

const Jumbotron = ({ text }) => {
  // var input = document.getElementById("input");

  // var customNodeCreator = function (character) {
  //   // Add character to input placeholder
  //   input.placeholder = input.placeholder + character;

  //   // Return null to skip internal adding of dom node
  //   return null;
  // };

  // var onRemoveNode = function ({ character }) {
  //   if (input.placeholder) {
  //     // Remove last character from input placeholder
  //     input.placeholder = input.placeholder.slice(0, -1);
  //   }
  // };
  return (
    <>
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("Tanagra")
            // .callFunction(() => {
            //   console.log("String typed out!");
            // })
            // .pauseFor(2500)
            // .deleteAll()
            // .callFunction(() => {
            //   console.log("All strings were deleted");
            // })
            // .start();
            .pauseFor(500)
            .deleteChars(9)
            .typeString("Find the best products")
            .pauseFor(100)
            .deleteAll()
            .typeString("at the <strong>best</strong> price")
            .pauseFor(300)
            .deleteChars(10)
            .typeString("<strong>best</strong> quality")
            .pauseFor(300)
            .deleteAll()
            .typeString("with the <strong>best</strong> accessories ")
            .deleteChars(17)
            .typeString("<strong>best</strong> customer-service client ")
            .deleteAll()
            .typeString(
              '<strong> <span style="color: #1890ff;">Tanagra</span></strong>'
            )
            .pauseFor(2500)
            .start();
        }}
        options={{ autoStart: true, loop: true }}
      />
    </>
  );
};

export default Jumbotron;
