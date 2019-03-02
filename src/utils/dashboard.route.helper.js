module.exports = {
  prepareLinksAggregation: (teamId, author) => {
    const query = author ? { teamId, author } : { teamId };
    return [
      {
        $match: query
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'author',
          foreignField: 'id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          'author._id': 0,
          'author.createdAt': 0,
          'author.updatedAt': 0,
          'author.teamId': 0
        }
      },
      {
        $project: {
          author: 1,
          href: 1,
          channel: 1,
          createdAt: 1
        }
      }
    ];
  },
  prepareHighlightsAggregation: (teamId, author, userId) => {
    const query = author
      ? { 'links.teamId': teamId, 'links.author': author }
      : { 'links.teamId': teamId };
    return [
      {
        $match: {
          user: userId
        }
      },
      {
        $lookup: {
          from: 'Links',
          localField: '_id',
          foreignField: '_id',
          as: 'links'
        }
      },
      {
        $unwind: '$links'
      },
      {
        $match: query
      },
      {
        $project: {
          href: '$links.href',
          teamId: '$links.teamId',
          author: '$links.author',
          channel: '$links.channel',
          createdAt: '$links.createdAt',
          ogp: '$links.ogp'
        }
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'author',
          foreignField: 'id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          'author._id': 0,
          'author.createdAt': 0,
          'author.updatedAt': 0,
          'author.teamId': 0,
        }
      },
      {
        $project: {
          author: 1,
          href: 1,
          channel: 1,
          createdAt: 1
        }
      }
    ];
  }
};
