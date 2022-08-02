import React, { useEffect } from "react";
import Page from "./Page";

// function Failure(props) {
//   text="For this extension to work, the current website must contain a supported video player."
//       buttonProps={{
//         text: "Close",
//         onClick: () => window.close(),
//       }}
//     />
//   );
// }

function TestFailure(props) {

    useEffect(() => {
        props.textHandler("For this extension to work, the current website must contain a supported video player.")
        props.buttonPropsHandler({
            text: "Close",
            onClick: () => window.close(),
          })
    }, [])

//   text: "For this extension to work, the current website must contain a supported video player.",
//   buttonProps: {
//     text: "Close",
//     onClick: () => window.close(),
//   },

    return <></>;
};

export default TestFailure;
