import React from "react";
import inject from "../modules/inject";
import { generateRandomKey } from "../modules/keys";
import Page from "./Page";
import { cache } from "../modules/cache";
import { cacheKeys, server } from "../modules/messages";
// import { server }

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: ""
    }
  }


  //For saving extension data, use injected variable on tab

  async componentDidMount() {

    console.log('create page loaded');

    let key = generateRandomKey();

    await cache(cacheKeys.id, key);
    await cache(cacheKeys.key, key);
    setState({
      key: (await inject(server.registerUser)).key
    });

    // console.log(data);
  }

  // async componentWillMount

  render() {
    return (
      <Page
        text="Use the following key to have others join the room."
        buttonProps={{
          text: "Close",
          onClick: () => window.close(),
        }}
      >
        <p>IT is me</p>
      </Page>
    );
  }
}

export default Create;
