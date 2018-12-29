module.exports = (req, res) => {
  const { state, client_id } = req;
  return res.status(200).send(`
    <a href="https://slack.com/oauth/authorize?client_id=${client_id}&scope=bot,channels:history,groups:history,im:history,mpim:history&state=${state}">
      <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
    </a>`);
};
