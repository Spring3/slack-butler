module.exports = (req, res) => {
  const { state } = req;
  return res.status(200).send(`
    <a href="https://slack.com/oauth/authorize?client_id=298198096945.298647920563&scope=bot,channels:history,groups:history,im:history,mpim:history,reactions:read,reactions:write&state=${state}">
      <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
    </a>`);
};
