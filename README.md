# trel

A command line Trello client.

## Usage

Before first use, you will need to obtain your Trello public key from `https://trello.com/1/appKey/generate` ([link](https://trello.com/1/appKey/generate)). You will also need to generate a Trello api token by visiting `https://trello.com/1/connect?key=<PUBLIC_KEY>&name=trel&response_type=token&expiration=never&scope=read,write`, replacing `<PUBLIC_KEY>` with your public key obtained previously.

Next set the environment variables `TRELLO_DEVELOPER_PUBLIC_KEY` and `TRELLO_MEMBER_TOKEN` to the public key and api token respectively.
